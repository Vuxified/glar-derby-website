import React from 'react';

interface ActivityRecord {
  id: string;
  title: string;
  category: string;
  points: number;
  date: string;
  status: 'verified' | 'pending';
}

interface ActivityLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userPoints: number;
}

export const ActivityLogDrawer: React.FC<ActivityLogDrawerProps> = ({
  isOpen,
  onClose,
  userPoints,
}) => {
  if (!isOpen) return null;

  const records: ActivityRecord[] = [
    {
      id: 'rec-1',
      title: 'Sent 3 Handwritten Notes (Batch 1)',
      category: 'Production',
      points: 10,
      date: 'Today at 10:20 AM',
      status: 'verified',
    },
    {
      id: 'rec-2',
      title: 'GLAR Committee Strategy Session',
      category: 'Networking',
      points: 20,
      date: 'Yesterday at 2:00 PM',
      status: 'verified',
    },
    {
      id: 'rec-3',
      title: 'Attended GLAR Legal Update Seminar',
      category: 'Education',
      points: 10,
      date: '3 days ago',
      status: 'verified',
    },
    {
      id: 'rec-4',
      title: 'Logged 50 Cold Outreach Calls',
      category: 'Production',
      points: 25,
      date: 'Last week',
      status: 'verified',
    },
    {
      id: 'rec-5',
      title: 'Shadowed Eleanor Vance at Brentwood Open House',
      category: 'Mentorship',
      points: 30,
      date: '2 weeks ago',
      status: 'verified',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 bg-primary text-white flex items-center justify-between border-b border-white/10">
            <div>
              <span className="text-[11px] font-label-caps uppercase tracking-widest text-tertiary-fixed font-bold">
                JOCKEY PURSE AUDIT
              </span>
              <h2 className="font-headline-md text-xl font-bold mt-0.5">Activity History</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Points summary ribbon */}
          <div className="p-5 bg-surface-container border-b border-surface-container-high flex items-center justify-between">
            <span className="text-xs font-label-caps text-on-surface-variant uppercase font-bold">
              Total Verified Purse:
            </span>
            <span className="font-stats-number text-2xl text-derby-red font-black">
              {userPoints} PTS
            </span>
          </div>

          {/* List of records */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
            {records.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high/60 shadow-sm flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-label-caps px-2 py-0.5 rounded bg-surface-container text-primary font-bold">
                      {rec.category}
                    </span>
                    <span className="text-[10px] text-secondary font-bold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[13px]">check_circle</span>
                      Verified
                    </span>
                  </div>
                  <h4 className="font-headline-md text-sm text-primary font-bold mt-1">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-outline font-body-sm mt-0.5">{rec.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-stats-number text-lg text-primary font-bold">
                    +{rec.points}
                  </span>
                  <span className="text-[10px] text-outline block">PTS</span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-surface-container bg-surface-container-low text-center">
            <p className="text-xs text-outline font-body-sm">
              Point verification signed by GLAR Board of Governors Stewards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
