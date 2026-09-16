import React, { useState } from 'react';
import { Jockey, ActivityTask } from '../../types';
import { SCRUBBER_HORSE_ICON, ELEANOR_VANCE_MENTOR } from '../../data/mockData';

interface TrackTrackerViewProps {
  currentUser: Jockey;
  onLogActivity: (task: ActivityTask) => void;
  onRequestSubmitEvidence: (task: ActivityTask) => void;
  onOpenTrainerChat: () => void;
  onOpenSchedule: () => void;
  onOpenActivityLog: () => void;
  tasks: ActivityTask[];
  onUpdateNotesCount: (delta: number) => void;
}

export const TrackTrackerView: React.FC<TrackTrackerViewProps> = ({
  currentUser,
  onLogActivity,
  onRequestSubmitEvidence,
  onOpenTrainerChat,
  onOpenSchedule,
  onOpenActivityLog,
  tasks,
  onUpdateNotesCount,
}) => {
  const [hoveredQuarter, setHoveredQuarter] = useState<string | null>(null);

  // Determine current active quarter dynamically from user points
  const points = currentUser.points;
  let currentQuarter: 'Q1' | 'Q2' | 'Q3' | 'Q4' = 'Q1';
  let currentQuarterTitle = 'Starting Gate (Q1)';
  let nextQuarterName = 'Education Classic (Q2)';
  let pointsNeededForNext = Math.max(0, 500 - points);

  if (points >= 1200) {
    currentQuarter = 'Q4';
    currentQuarterTitle = "Winner's Circle (Q4)";
    nextQuarterName = 'Triple Crown Champion';
    pointsNeededForNext = 0;
  } else if (points >= 800) {
    currentQuarter = 'Q3';
    currentQuarterTitle = 'Leadership Stakes (Q3)';
    nextQuarterName = "Winner's Circle (Q4)";
    pointsNeededForNext = Math.max(0, 1200 - points);
  } else if (points >= 500) {
    currentQuarter = 'Q2';
    currentQuarterTitle = 'Education Classic (Q2)';
    nextQuarterName = 'Leadership Stakes (Q3)';
    pointsNeededForNext = Math.max(0, 800 - points);
  }

  // Milestone completion states
  const isQ1Completed = points >= 500;
  const isQ2Reached = points >= 500;
  const isQ2Completed = points >= 800;
  const isQ3Reached = points >= 800;
  const isQ3Completed = points >= 1200;
  const isQ4Reached = points >= 1200;

  // Proportional track position across the 4 quarters:
  // Q1: 0 - 500 PTS -> maps linearly to 0% - 33.333% (Education Classic is at 33.333%)
  // Q2: 500 - 800 PTS -> maps linearly to 33.333% - 66.666% (Leadership Stakes is at 66.666%)
  // Q3: 800 - 1200 PTS -> maps linearly to 66.666% - 100% (Winner's Circle is at 100%)
  // Q4: 1200+ PTS -> 100%
  let trackPercent = 0;
  if (points <= 0) {
    trackPercent = 0;
  } else if (points < 500) {
    trackPercent = (points / 500) * 33.333;
  } else if (points < 800) {
    trackPercent = 33.333 + ((points - 500) / 300) * 33.333;
  } else if (points < 1200) {
    trackPercent = 66.666 + ((points - 800) / 400) * 33.334;
  } else {
    trackPercent = 100;
  }
  const clampedTrackPercent = Math.min(Math.max(trackPercent, 0), 100);

  // Handwritten notes task
  const notesTask = tasks.find((t) => t.title.toLowerCase().includes('handwritten'));
  const notesCount = notesTask?.progressCurrent ?? 3;
  const notesTotal = notesTask?.progressTotal ?? 5;

  // Q2 First Solo Listing task
  const isSoloListingUnlocked = points >= 500;
  const soloListingTask: ActivityTask = tasks.find((t) =>
    t.title.toLowerCase().includes('solo listing')
  ) || {
    id: 'task-4',
    title: 'First Solo Listing',
    description: 'Successfully close your first independent property listing.',
    category: 'Production',
    points: 50,
    verificationTier: 'Tier 3',
  };

  return (
    <div className="flex flex-col w-full relative">
      {/* Track Tracker Section (Hero) */}
      <section className="w-full px-4 sm:px-8 lg:px-margin-desktop py-10 lg:py-12 bg-surface-container relative overflow-hidden flex flex-col gap-8">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
        <div className="absolute -right-24 -top-24 text-outline/5 rotate-12 z-0 pointer-events-none">
          <span className="material-symbols-outlined text-[300px]">flag</span>
        </div>

        <div className="relative z-10 flex flex-col gap-4 max-w-[1000px] mx-auto w-full">
          {/* Title and Current Purse */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end w-full gap-4 mb-2">
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps text-primary tracking-widest uppercase mb-1">
                Your Race Season
              </span>
              <h1 className="font-display-xl text-3xl sm:text-4xl lg:text-display-xl text-on-surface tracking-tight">
                The Track Tracker
              </h1>

              {/* Dynamic Quarter Status Indicator */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-label-caps uppercase font-bold shadow-sm transition-all ${
                    currentQuarter === 'Q4'
                      ? 'bg-amber-500 text-white animate-pulse'
                      : currentQuarter === 'Q3'
                      ? 'bg-tertiary text-white'
                      : currentQuarter === 'Q2'
                      ? 'bg-secondary text-white'
                      : 'bg-primary text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  Active Stage: {currentQuarterTitle}
                </span>

                <span className="text-xs font-body-sm text-outline font-medium">
                  {pointsNeededForNext > 0
                    ? `${pointsNeededForNext} PTS to ${nextQuarterName}`
                    : 'Winner’s Circle Champion Status Unlocked!'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/70 sm:bg-white/50 p-3 sm:p-2.5 rounded-2xl border border-surface-container-high/60 shadow-sm w-full sm:w-auto justify-between sm:justify-end">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                Verified Purse:
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-stats-number text-3xl sm:text-stats-number text-derby-red font-black">
                  {currentUser.points}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant font-bold">
                  PTS
                </span>
              </div>
            </div>
          </div>

          {/* The Track Progress Bar Container */}
          <div className="relative w-full py-12 px-8 sm:px-14 flex items-center bg-white rounded-3xl shadow-md border border-surface-container-high/40 min-h-[175px] sm:min-h-[165px]">
            <div className="absolute inset-0 bg-track-sand/15 rounded-3xl pointer-events-none"></div>

            {/* Unified Track Runway */}
            <div className="relative w-full h-4 my-6">
              {/* Dirt Track Groove Background */}
              <div className="absolute inset-0 bg-surface-container-high rounded-full overflow-hidden shadow-inner">
                {/* Green Progress Fill */}
                <div
                  className="h-full bg-secondary rounded-full shadow-[0_0_12px_rgba(62,102,88,0.6)] transition-all duration-700 ease-out"
                  style={{ width: `${clampedTrackPercent}%` }}
                  id="track-progress"
                ></div>
              </div>

              {/* 4 Milestones Overlay: Positioned precisely at 0%, 33.333%, 66.666%, 100% */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Milestone 1: Starting Gate Q1 (0%) */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto cursor-pointer"
                  style={{ left: '0%' }}
                  onMouseEnter={() => setHoveredQuarter('Q1')}
                  onMouseLeave={() => setHoveredQuarter(null)}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md border-4 border-white z-20 transition-all ${
                      isQ1Completed
                        ? 'bg-secondary text-white'
                        : 'bg-primary text-white ring-4 ring-primary/20'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-sm"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check
                    </span>
                  </div>
                  <div className="absolute top-10 whitespace-nowrap font-label-caps text-[10px] sm:text-[11px] text-center">
                    <span className="text-on-surface font-bold">Starting Gate</span>
                    <br />
                    <span
                      className={
                        isQ1Completed ? 'text-secondary font-bold' : 'text-primary font-bold'
                      }
                    >
                      Q1 {isQ1Completed ? '• Done' : '• Active'}
                    </span>
                  </div>
                </div>

                {/* Milestone 2: Education Classic Q2 (33.333% - 500 PTS) */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto cursor-pointer"
                  style={{ left: '33.333%' }}
                  onMouseEnter={() => setHoveredQuarter('Q2')}
                  onMouseLeave={() => setHoveredQuarter(null)}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center z-20 shadow-md border-4 border-white transition-all ${
                      isQ2Completed
                        ? 'bg-secondary text-white'
                        : isQ2Reached
                        ? 'bg-secondary text-white ring-4 ring-secondary/30 scale-110'
                        : 'bg-white border-surface-container-highest text-outline-variant'
                    }`}
                  >
                    {isQ2Reached ? (
                      <span
                        className="material-symbols-outlined text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-xs">lock</span>
                    )}
                  </div>
                  <div className="absolute top-10 whitespace-nowrap font-label-caps text-[10px] sm:text-[11px] text-center">
                    <span
                      className={
                        isQ2Reached ? 'text-on-surface font-bold' : 'text-on-surface-variant opacity-60'
                      }
                    >
                      Education Classic
                    </span>
                    <br />
                    <span
                      className={
                        isQ2Reached
                          ? 'text-secondary font-bold'
                          : 'text-outline-variant font-medium'
                      }
                    >
                      Q2 {isQ2Reached ? (isQ2Completed ? '• Done' : '• ACTIVE') : '(500 PTS)'}
                    </span>
                  </div>
                </div>

                {/* Milestone 3: Leadership Stakes Q3 (66.666% - 800 PTS) */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto cursor-pointer"
                  style={{ left: '66.666%' }}
                  onMouseEnter={() => setHoveredQuarter('Q3')}
                  onMouseLeave={() => setHoveredQuarter(null)}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center z-20 shadow-md border-4 border-white transition-all ${
                      isQ3Completed
                        ? 'bg-secondary text-white'
                        : isQ3Reached
                        ? 'bg-tertiary text-white ring-4 ring-tertiary/30 scale-110'
                        : 'bg-white border-surface-container-highest text-outline-variant'
                    }`}
                  >
                    {isQ3Reached ? (
                      <span
                        className="material-symbols-outlined text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-xs">lock</span>
                    )}
                  </div>
                  <div className="absolute top-10 whitespace-nowrap font-label-caps text-[10px] sm:text-[11px] text-center">
                    <span
                      className={
                        isQ3Reached ? 'text-on-surface font-bold' : 'text-on-surface-variant opacity-60'
                      }
                    >
                      Leadership Stakes
                    </span>
                    <br />
                    <span
                      className={
                        isQ3Reached ? 'text-tertiary font-bold' : 'text-outline-variant font-medium'
                      }
                    >
                      Q3 {isQ3Reached ? (isQ3Completed ? '• Done' : '• ACTIVE') : '(800 PTS)'}
                    </span>
                  </div>
                </div>

                {/* Milestone 4: Winner's Circle Q4 (100% - 1,200 PTS) */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto cursor-pointer"
                  style={{ left: '100%' }}
                  onMouseEnter={() => setHoveredQuarter('Q4')}
                  onMouseLeave={() => setHoveredQuarter(null)}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-4 border-white z-20 transition-all ${
                      isQ4Reached
                        ? 'bg-amber-500 text-white ring-4 ring-amber-400/40 animate-bounce'
                        : 'bg-white border-tertiary-fixed text-tertiary-fixed-dim'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-lg"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      emoji_events
                    </span>
                  </div>
                  <div className="absolute top-12 whitespace-nowrap font-label-caps text-[10px] sm:text-[11px] text-center">
                    <span
                      className={
                        isQ4Reached ? 'text-amber-600 font-bold' : 'text-on-surface-variant opacity-70'
                      }
                    >
                      Winner's Circle
                    </span>
                    <br />
                    <span
                      className={
                        isQ4Reached ? 'text-amber-600 font-black' : 'text-outline-variant font-medium'
                      }
                    >
                      Q4 {isQ4Reached ? '• CHAMPION' : '(1200 PTS)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Jockey Horse Scrubber (Track Level) */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 pointer-events-auto transition-all duration-700 ease-out cursor-pointer"
                style={{ left: `${clampedTrackPercent}%` }}
                title={`Current Position: ${currentUser.points} PTS (${currentQuarterTitle})`}
              >
                <div className="relative group -translate-y-6 sm:-translate-y-7">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full border-3 border-tertiary-fixed shadow-xl bg-white object-cover group-hover:ring-4 group-hover:ring-tertiary-fixed/40 transition-all flex items-center justify-center overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      data-alt="Jockey on horse icon"
                      src={SCRUBBER_HORSE_ICON}
                      alt="Jockey Scrubber"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                  </div>

                  {/* Floating Badge */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex flex-col items-center pointer-events-none z-50">
                    <div className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-lg whitespace-nowrap">
                      {currentUser.points} PTS • {currentQuarter}
                    </div>
                    <div className="w-2 h-2 bg-primary rotate-45 -mt-1"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="w-full px-4 sm:px-8 lg:px-margin-desktop py-10 lg:py-12 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Left Column: The Points Paddock (Span 8) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-headline-lg text-2xl sm:text-headline-lg text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary-container">grid_view</span>
                The Points Paddock
              </h2>
              <button
                onClick={onOpenActivityLog}
                className="text-primary hover:text-derby-red font-label-caps text-label-caps flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>View Activity Log</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Attend GLAR Class (Tier 2 Verification) */}
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-6 flex flex-col gap-4 relative overflow-hidden group border border-surface-container-high/60">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-secondary-container/40 to-transparent rounded-bl-full pointer-events-none"></div>
                <div className="flex justify-between items-start">
                  <div className="w-11 h-11 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-2xl">school</span>
                  </div>
                  <div className="bg-surface-container-low px-3 py-1 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-tertiary-container">
                      stars
                    </span>
                    <span className="font-label-caps text-label-caps text-on-surface">+10 PTS</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-headline-md text-xl sm:text-headline-md text-on-surface leading-tight mb-1">
                    Attend GLAR Class
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Complete an official GLAR educational seminar or workshop.
                  </p>
                </div>
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <div className="w-7 h-7 rounded-full bg-surface-container border-2 border-white flex items-center justify-center text-[10px] font-bold text-primary">
                      SJ
                    </div>
                    <div className="w-7 h-7 rounded-full bg-primary-fixed border-2 border-white flex items-center justify-center text-[10px] font-bold text-primary">
                      MC
                    </div>
                    <div className="w-7 h-7 rounded-full bg-surface-container border-2 border-white flex items-center justify-center text-[10px] font-bold text-on-surface-variant">
                      +3
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      onRequestSubmitEvidence(
                        tasks.find((t) => t.id === 'task-1') || {
                          id: 'task-1',
                          title: 'Attend GLAR Class',
                          description: 'Complete an official GLAR seminar or workshop.',
                          category: 'Education',
                          points: 10,
                          verificationTier: 'Tier 2',
                        }
                      )
                    }
                    className="bg-primary text-on-primary font-label-caps text-label-caps px-4 py-2 rounded-xl hover:bg-primary-container transition-all shadow-sm active:scale-95 group-hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">upload_file</span>
                    LOG ACTIVITY
                  </button>
                </div>
              </div>

              {/* Card 2: Committee Meeting (Tier 2 Verification) */}
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-6 flex flex-col gap-4 relative overflow-hidden group border border-surface-container-high/60">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full pointer-events-none"></div>
                <div className="flex justify-between items-start">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-2xl">groups</span>
                  </div>
                  <div className="bg-surface-container-low px-3 py-1 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-tertiary-container">
                      stars
                    </span>
                    <span className="font-label-caps text-label-caps text-on-surface">+20 PTS</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-headline-md text-xl sm:text-headline-md text-on-surface leading-tight mb-1">
                    Committee Meeting
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Active participation in a monthly committee strategy session.
                  </p>
                </div>
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="font-body-sm text-body-sm text-outline-variant italic font-medium">
                    Next: Oct 14
                  </span>
                  <button
                    onClick={() =>
                      onRequestSubmitEvidence(
                        tasks.find((t) => t.id === 'task-2') || {
                          id: 'task-2',
                          title: 'Committee Meeting',
                          description: 'Active participation in a monthly committee session.',
                          category: 'Networking',
                          points: 20,
                          verificationTier: 'Tier 2',
                        }
                      )
                    }
                    className="bg-primary text-on-primary font-label-caps text-label-caps px-4 py-2 rounded-xl hover:bg-primary-container transition-all shadow-sm active:scale-95 group-hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">upload_file</span>
                    LOG ACTIVITY
                  </button>
                </div>
              </div>

              {/* Card 3: Handwritten Notes (Tier 1 Micro-Habit) */}
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-6 flex flex-col gap-4 relative overflow-hidden group border border-surface-container-high/60">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-derby-red/5 to-transparent rounded-bl-full pointer-events-none"></div>
                <div className="flex justify-between items-start">
                  <div className="w-11 h-11 rounded-xl bg-derby-red/10 flex items-center justify-center text-derby-red">
                    <span className="material-symbols-outlined text-2xl">edit</span>
                  </div>
                  <div className="bg-surface-container-low px-3 py-1 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-tertiary-container">
                      stars
                    </span>
                    <span className="font-label-caps text-label-caps text-on-surface">+10 PTS</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-headline-md text-xl sm:text-headline-md text-on-surface leading-tight mb-1">
                    Handwritten Notes
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Send 5 personalized handwritten notes to prospective clients.
                  </p>
                </div>
                <div className="mt-auto pt-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="w-full bg-surface-container-high h-2.5 rounded-full mr-4 overflow-hidden">
                      <div
                        className="h-full bg-derby-red rounded-full transition-all duration-300"
                        style={{ width: `${(notesCount / notesTotal) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-body-sm text-body-sm font-bold text-on-surface whitespace-nowrap">
                      {notesCount} / {notesTotal}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-xs text-outline">
                      {notesCount >= notesTotal
                        ? 'Target achieved for this week!'
                        : `${notesTotal - notesCount} notes needed to complete`}
                    </span>
                    <button
                      onClick={() => onUpdateNotesCount(1)}
                      className="text-xs font-label-caps text-derby-red hover:underline uppercase flex items-center gap-1 cursor-pointer font-bold"
                    >
                      <span className="material-symbols-outlined text-sm">add_circle</span> Log 1 Note
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 4: First Solo Listing (Q2 Milestone Card - Dynamic Unlocking) */}
              <div
                className={`rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden transition-all duration-300 border ${
                  isSoloListingUnlocked
                    ? 'bg-white shadow-md border-2 border-secondary/50 hover:border-secondary'
                    : 'bg-surface-container shadow-sm border-surface-container-high opacity-60 grayscale hover:grayscale-0 cursor-not-allowed'
                }`}
              >
                {!isSoloListingUnlocked && (
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="bg-finish-line-black text-white px-4 py-2 rounded-xl font-label-caps text-label-caps flex items-center gap-2 shadow-lg">
                      <span className="material-symbols-outlined text-sm">lock</span> Unlocks in Q2 (500 PTS)
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-start">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      isSoloListingUnlocked
                        ? 'bg-secondary/15 text-secondary'
                        : 'bg-outline-variant text-on-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl">real_estate_agent</span>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full flex items-center gap-1 ${
                      isSoloListingUnlocked
                        ? 'bg-secondary/10 text-secondary'
                        : 'bg-surface-container-highest text-on-surface-variant'
                    }`}
                  >
                    <span className="font-label-caps text-label-caps font-bold">
                      {isSoloListingUnlocked ? 'UNLOCKED • +50 PTS' : '50 PTS'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <h3 className="font-headline-md text-xl sm:text-headline-md text-on-surface leading-tight mb-1">
                    First Solo Listing
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Successfully close your first independent property listing.
                  </p>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between text-outline">
                  {isSoloListingUnlocked ? (
                    <>
                      <span className="text-xs font-label-caps text-secondary font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">check_circle</span> Ready to Claim
                      </span>
                      <button
                        onClick={() => onRequestSubmitEvidence(soloListingTask)}
                        className="bg-secondary text-white font-label-caps text-label-caps px-4 py-2 rounded-xl hover:bg-secondary/90 transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5 font-bold"
                      >
                        <span className="material-symbols-outlined text-sm">verified_user</span>
                        SUBMIT MLS PROOF
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-label-caps uppercase flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">lock_clock</span> Prerequisite:
                      Reach 500 PTS (Q2)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar Bento (Span 4) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Trainer Connection */}
            <div className="bg-primary text-on-primary rounded-2xl shadow-lg p-1 relative overflow-hidden border border-white/10">
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle at 100% 0%, #ffffff 0%, transparent 50%)',
                }}
              ></div>
              <div className="bg-white/5 rounded-xl p-6 flex flex-col gap-6 backdrop-blur-sm h-full relative z-10">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary-fixed">military_tech</span>
                  <h2 className="font-headline-md text-headline-md text-white tracking-tight">
                    Trainer Connection
                  </h2>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-2 border-tertiary-fixed shadow-[0_0_15px_rgba(255,224,136,0.3)] overflow-hidden">
                      <img
                        className="w-full h-full object-cover"
                        data-alt="Eleanor Vance headshot"
                        src={ELEANOR_VANCE_MENTOR.imageUrl}
                        alt="Eleanor Vance"
                      />
                    </div>
                    <div
                      className="absolute -bottom-1 -right-1 bg-secondary text-white w-5 h-5 rounded-full flex items-center justify-center border-2 border-primary shadow-sm"
                      title="Online Now"
                    >
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-body-md text-body-md font-bold text-white">
                      {ELEANOR_VANCE_MENTOR.name}
                    </span>
                    <span className="font-label-caps text-label-caps text-primary-fixed-dim tracking-wider">
                      {ELEANOR_VANCE_MENTOR.title}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 w-full mt-2">
                  <button
                    onClick={onOpenTrainerChat}
                    className="flex-1 bg-white text-primary font-label-caps text-label-caps py-3 rounded-xl hover:bg-surface-container transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 cursor-pointer font-bold"
                  >
                    <span className="material-symbols-outlined text-sm">chat</span> MESSAGE
                  </button>
                  <button
                    onClick={onOpenSchedule}
                    className="flex-1 border border-white/30 text-white font-label-caps text-label-caps py-3 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer font-bold"
                  >
                    <span className="material-symbols-outlined text-sm">event</span> SCHEDULE
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats Bento */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-surface-container-high/60 flex flex-col items-center justify-center text-center gap-2 hover:-translate-y-1 transition-transform">
                <span className="material-symbols-outlined text-sky-blue text-3xl">
                  local_fire_department
                </span>
                <span className="font-stats-number text-3xl sm:text-stats-number text-on-surface leading-none font-bold">
                  {currentUser.streakDays}
                </span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">
                  Day Streak
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-surface-container-high/60 flex flex-col items-center justify-center text-center gap-2 hover:-translate-y-1 transition-transform relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 text-tertiary-fixed opacity-20 pointer-events-none">
                  <span className="material-symbols-outlined text-6xl">target</span>
                </div>
                <span className="font-label-caps text-label-caps text-outline-variant">Rank</span>
                <span className="font-stats-number text-3xl sm:text-stats-number text-tertiary-container leading-none font-bold">
                  #{currentUser.rank}
                </span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">
                  In Cohort
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
