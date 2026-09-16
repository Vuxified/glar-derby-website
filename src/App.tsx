import React, { useState } from 'react';
import { TabType, Jockey, SubmissionItem, StableRanking, ActivityTask, Mentor } from './types';
import {
  CURRENT_USER,
  INITIAL_STABLES,
  STABLE_JOCKEYS,
  INITIAL_SUBMISSIONS,
  INITIAL_TASKS,
  ELEANOR_VANCE_MENTOR,
} from './data/mockData';
import { NavigationSidebar } from './components/NavigationSidebar';
import { RaceHeader } from './components/RaceHeader';
import { TrackTrackerView } from './components/views/TrackTrackerView';
import { TheStableView } from './components/views/TheStableView';
import { HallOfFameView } from './components/views/HallOfFameView';
import { ThePaddockView } from './components/views/ThePaddockView';
import { TrainerConnectView } from './components/views/TrainerConnectView';

import { NewStakeModal } from './components/modals/NewStakeModal';
import { MentorProfileModal } from './components/modals/MentorProfileModal';
import { ScheduleModal } from './components/modals/ScheduleModal';
import { ActivityLogDrawer } from './components/modals/ActivityLogDrawer';
import { SpeechModal } from './components/modals/SpeechModal';
import { UserProfileModal } from './components/modals/UserProfileModal';
import { SubmitEvidenceModal } from './components/modals/SubmitEvidenceModal';
import { ToastContainer, ToastMessage } from './components/Toast';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('track-tracker');
  const [currentUser, setCurrentUser] = useState<Jockey>(CURRENT_USER);
  const [stables, setStables] = useState<StableRanking[]>(INITIAL_STABLES);
  const [jockeys, setJockeys] = useState<Jockey[]>(STABLE_JOCKEYS);
  const [queueItems, setQueueItems] = useState<SubmissionItem[]>(INITIAL_SUBMISSIONS);
  const [tasks, setTasks] = useState<ActivityTask[]>(INITIAL_TASKS);

  // Modals and Drawers
  const [isNewStakeOpen, setIsNewStakeOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isSpeechOpen, setIsSpeechOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Tiered Verification Modal State
  const [evidenceTask, setEvidenceTask] = useState<ActivityTask | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, description: string, type: 'success' | 'info' | 'reward' = 'reward') => {
    const newToast: ToastMessage = {
      id: `t-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      description,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper to add points to user and check for quarter advancements
  const creditPointsToUser = (pts: number, activityName: string) => {
    setCurrentUser((prev) => {
      const oldPts = prev.points;
      const updatedPts = oldPts + pts;
      const updatedPercent = Math.min(Math.round((updatedPts / 1200) * 100), 100);

      // Check if user crossed quarter thresholds
      if (oldPts < 500 && updatedPts >= 500) {
        setTimeout(() => {
          addToast(
            'MILESTONE UNLOCKED: Education Classic (Q2)!',
            'You reached 500 PTS! The First Solo Listing milestone and Q2 perks are now unlocked.',
            'reward'
          );
        }, 500);
      } else if (oldPts < 800 && updatedPts >= 800) {
        setTimeout(() => {
          addToast(
            'MILESTONE UNLOCKED: Leadership Stakes (Q3)!',
            'You passed 800 PTS! Entered the homestretch toward the Winner’s Circle.',
            'reward'
          );
        }, 500);
      } else if (oldPts < 1200 && updatedPts >= 1200) {
        setTimeout(() => {
          addToast(
            'CHAMPION! Winner’s Circle (Q4) Reached!',
            '1,200 PTS achieved! Congratulations on claiming the Triple Crown trophy.',
            'reward'
          );
        }, 500);
      }

      return {
        ...prev,
        points: updatedPts,
        progressPercent: updatedPercent,
      };
    });
  };

  // Manual Points Setter for testing / demoing different stages
  const handleSetUserPoints = (newPoints: number) => {
    const updatedPercent = Math.min(Math.round((newPoints / 1200) * 100), 100);
    setCurrentUser((prev) => ({
      ...prev,
      points: newPoints,
      progressPercent: updatedPercent,
    }));

    const stageName =
      newPoints >= 1200
        ? "Winner's Circle (Q4)"
        : newPoints >= 800
        ? 'Leadership Stakes (Q3)'
        : newPoints >= 500
        ? 'Education Classic (Q2)'
        : 'Starting Gate (Q1)';

    addToast(
      `Jumped to ${stageName}!`,
      `Purse adjusted to ${newPoints} PTS (${updatedPercent}% along the track).`,
      'info'
    );
  };

  // Actions
  const handleLogActivity = (task: ActivityTask) => {
    creditPointsToUser(task.points, task.title);
    addToast(
      `+${task.points} PTS Added to Purse!`,
      `Verified completion of "${task.title}". Track progress updated.`,
      'reward'
    );
  };

  // Open the Tiered Evidence Submission Modal
  const handleRequestSubmitEvidence = (task: ActivityTask) => {
    setEvidenceTask(task);
  };

  // Handle Evidence Submission (Auto-approved or queued for Stewards)
  const handleSubmitEvidence = (
    submission: Omit<SubmissionItem, 'id' | 'status' | 'timeAgo'>,
    autoApprove?: boolean
  ) => {
    if (autoApprove) {
      // Immediate credit
      creditPointsToUser(submission.points, submission.title);
      addToast(
        `+${submission.points} PTS Auto-Approved!`,
        `Evidence for "${submission.title}" was verified via Fast-Track Steward Mode.`,
        'reward'
      );

      // Also add to queue for history record
      const approvedItem: SubmissionItem = {
        ...submission,
        id: `sub-${Date.now()}`,
        timeAgo: 'Just now',
        status: 'approved',
      };
      setQueueItems((prev) => [approvedItem, ...prev]);
    } else {
      // Route to Trainer / Stewards Approval Queue
      const pendingItem: SubmissionItem = {
        ...submission,
        id: `sub-${Date.now()}`,
        timeAgo: 'Just now',
        status: 'pending',
      };
      setQueueItems((prev) => [pendingItem, ...prev]);

      addToast(
        'Evidence Submitted to Approval Queue!',
        `Your proof for "${submission.title}" (+${submission.points} PTS) is awaiting review in The Stable.`,
        'info'
      );
    }
  };

  const handleUpdateNotesCount = (delta: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.title.toLowerCase().includes('handwritten')) {
          const current = (t.progressCurrent || 0) + delta;
          const total = t.progressTotal || 5;
          if (current >= total) {
            handleLogActivity(t);
            return { ...t, progressCurrent: total };
          }
          addToast('Note Logged', `Logged 1 handwritten note (${current}/${total})`, 'info');
          return { ...t, progressCurrent: current };
        }
        return t;
      })
    );
  };

  const handleApproveQueueItem = (id: string) => {
    const item = queueItems.find((q) => q.id === id);
    if (!item) return;

    setQueueItems((prev) => prev.filter((q) => q.id !== id));

    // If this submission belongs to the current user, credit their points and advance track!
    if (item.jockeyName === currentUser.name) {
      creditPointsToUser(item.points, item.title);
    }

    addToast(
      'Point Submission Approved!',
      `Awarded +${item.points} PTS to ${item.jockeyName} for "${item.title}". Purse updated.`,
      'success'
    );
  };

  const handleDenyQueueItem = (id: string) => {
    const item = queueItems.find((q) => q.id === id);
    if (!item) return;

    setQueueItems((prev) => prev.filter((q) => q.id !== id));
    addToast(
      'Submission Returned for Revision',
      `Denied stake submission from ${item.jockeyName}. Feedback sent.`,
      'info'
    );
  };

  const handleApproveAll = () => {
    const count = queueItems.length;
    const userPointsToAdd = queueItems
      .filter((q) => q.jockeyName === currentUser.name)
      .reduce((sum, q) => sum + q.points, 0);

    if (userPointsToAdd > 0) {
      creditPointsToUser(userPointsToAdd, 'Batch Stewards Verification');
    }

    setQueueItems([]);
    addToast(
      'All Submissions Approved!',
      `Successfully verified and credited all ${count} queue submissions.`,
      'success'
    );
  };

  const handleSubmitNewStake = (data: Omit<SubmissionItem, 'id' | 'status' | 'timeAgo'>) => {
    const newItem: SubmissionItem = {
      ...data,
      id: `sub-${Date.now()}`,
      timeAgo: 'Just now',
      status: 'pending',
    };
    setQueueItems((prev) => [newItem, ...prev]);

    // Also credit to user if submitted by J. Harrington
    creditPointsToUser(data.points, data.title);

    addToast(
      'New Stake Logged!',
      `Submitted "${data.title}" (+${data.points} PTS) to the race stewards.`,
      'reward'
    );
  };

  const handleBookSession = (details: { date: string; time: string; topic: string }) => {
    addToast(
      '1-on-1 Session Scheduled!',
      `Meeting with Eleanor Vance booked for ${details.date} at ${details.time} (${details.topic}).`,
      'success'
    );
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-body-md antialiased selection:bg-tertiary-fixed selection:text-primary w-full max-w-full overflow-x-hidden">
      {/* Sidebar Navigation */}
      <NavigationSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentUser={currentUser}
        onOpenProfile={() => setIsProfileOpen(true)}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
        {/* Top Race Header */}
        <RaceHeader
          onOpenNewStake={() => setIsNewStakeOpen(true)}
          onOpenMobileNav={() => setMobileNavOpen(true)}
          unreadCount={queueItems.length}
        />

        {/* Dynamic Main Body View */}
        <main className="flex-1 pt-16 sm:pt-20 w-full max-w-full overflow-x-hidden">
          {activeTab === 'track-tracker' && (
            <TrackTrackerView
              currentUser={currentUser}
              onLogActivity={handleLogActivity}
              onRequestSubmitEvidence={handleRequestSubmitEvidence}
              onOpenTrainerChat={() => setActiveTab('trainer-connect')}
              onOpenSchedule={() => setIsScheduleOpen(true)}
              onOpenActivityLog={() => setIsActivityLogOpen(true)}
              tasks={tasks}
              onUpdateNotesCount={handleUpdateNotesCount}
            />
          )}

          {activeTab === 'the-paddock' && (
            <ThePaddockView
              tasks={tasks}
              onLogTask={handleLogActivity}
              onRequestSubmitEvidence={handleRequestSubmitEvidence}
              onOpenNewStake={() => setIsNewStakeOpen(true)}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'the-stable' && (
            <TheStableView
              stables={stables}
              jockeys={jockeys}
              queueItems={queueItems}
              onApproveQueueItem={handleApproveQueueItem}
              onDenyQueueItem={handleDenyQueueItem}
              onApproveAll={handleApproveAll}
              onOpenJockeyDetail={(jockey) => {
                addToast(
                  `${jockey.name} Performance`,
                  `Rank #${jockey.rank} in stable with ${jockey.points} PTS (${jockey.progressPercent}% track complete).`,
                  'info'
                );
              }}
            />
          )}

          {activeTab === 'trainer-connect' && (
            <TrainerConnectView
              currentUser={currentUser}
              onOpenScheduleModal={() => setIsScheduleOpen(true)}
            />
          )}

          {activeTab === 'hall-of-fame' && (
            <HallOfFameView
              onSelectMentor={(mentor) => setSelectedMentor(mentor)}
              onRequestMentorship={(mentor) => {
                setSelectedMentor(mentor);
                setIsScheduleOpen(true);
              }}
              onWatchSpeech={() => setIsSpeechOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Modals & Drawers */}
      <NewStakeModal
        isOpen={isNewStakeOpen}
        onClose={() => setIsNewStakeOpen(false)}
        onSubmit={handleSubmitNewStake}
        jockeyName={currentUser.name}
        jockeyAvatar={currentUser.avatar}
      />

      <SubmitEvidenceModal
        task={evidenceTask}
        isOpen={Boolean(evidenceTask)}
        onClose={() => setEvidenceTask(null)}
        onSubmit={handleSubmitEvidence}
        jockeyName={currentUser.name}
        jockeyAvatar={currentUser.avatar}
      />

      <MentorProfileModal
        mentor={selectedMentor}
        isOpen={Boolean(selectedMentor)}
        onClose={() => setSelectedMentor(null)}
        onRequestMentorship={(m) => {
          setSelectedMentor(null);
          setIsScheduleOpen(true);
        }}
        onSendMessage={() => {
          setSelectedMentor(null);
          setActiveTab('trainer-connect');
        }}
      />

      <ScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onBook={handleBookSession}
        mentorName={selectedMentor?.name || ELEANOR_VANCE_MENTOR.name}
      />

      <ActivityLogDrawer
        isOpen={isActivityLogOpen}
        onClose={() => setIsActivityLogOpen(false)}
        userPoints={currentUser.points}
      />

      <SpeechModal
        isOpen={isSpeechOpen}
        onClose={() => setIsSpeechOpen(false)}
      />

      <UserProfileModal
        user={currentUser}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onSetPoints={handleSetUserPoints}
      />

      {/* Floating Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}

export default App;
