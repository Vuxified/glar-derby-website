import React from 'react';
import { Jockey } from '../../types';

interface UserProfileModalProps {
  user: Jockey;
  isOpen: boolean;
  onClose: () => void;
  onSetPoints?: (points: number) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onSetPoints,
}) => {
  if (!isOpen) return null;

  // Determine current active quarter
  const stage =
    user.points >= 1200
      ? "Winner's Circle (Q4)"
      : user.points >= 800
      ? 'Leadership Stakes (Q3)'
      : user.points >= 500
      ? 'Education Classic (Q2)'
      : 'Starting Gate (Q1)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-surface-container-high relative overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-surface-container hover:bg-surface-container-high text-outline hover:text-primary transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        <div className="flex flex-col items-center text-center pb-6 border-b border-surface-container">
          <div className="relative mb-3">
            <img
              className="w-24 h-24 rounded-full object-cover border-4 border-tertiary-fixed shadow-xl"
              src={user.avatar}
              alt={user.name}
            />
            <span className="absolute bottom-1 right-1 w-5 h-5 bg-secondary rounded-full border-2 border-white flex items-center justify-center">
              <span className="w-2 h-2 bg-white rounded-full"></span>
            </span>
          </div>

          <h3 className="font-headline-md text-2xl text-primary font-bold">{user.name}</h3>
          <p className="font-label-caps text-xs uppercase text-outline tracking-wider mt-0.5">
            {user.role} • Crescent Realty Stable
          </p>
          <span className="mt-2 bg-tertiary-fixed/30 text-tertiary px-3 py-1 rounded-full text-xs font-label-caps font-bold">
            Cohort Rank #{user.rank}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 my-6 text-center bg-surface-container-low p-4 rounded-2xl border border-surface-container-high">
          <div>
            <span className="font-stats-number text-2xl text-derby-red font-black">
              {user.points}
            </span>
            <p className="text-[10px] font-label-caps text-outline uppercase mt-1">Purse PTS</p>
          </div>
          <div className="border-x border-surface-container-high">
            <span className="font-stats-number text-2xl text-secondary font-black">
              {user.streakDays}
            </span>
            <p className="text-[10px] font-label-caps text-outline uppercase mt-1">Day Streak</p>
          </div>
          <div>
            <span className="font-stats-number text-2xl text-primary font-black">
              {user.progressPercent}%
            </span>
            <p className="text-[10px] font-label-caps text-outline uppercase mt-1">Track Done</p>
          </div>
        </div>

        {/* Stable assignment info */}
        <div className="space-y-3 text-sm font-body-sm text-on-surface-variant">
          <div className="flex justify-between py-1 border-b border-surface-container">
            <span className="text-outline">Active Quarter:</span>
            <span className="font-bold text-primary">{stage}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-surface-container">
            <span className="text-outline">Assigned Mentor:</span>
            <span className="font-bold text-primary">{user.mentorName}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-surface-container">
            <span className="text-outline">Race Silks:</span>
            <span className="font-bold text-primary">Crimson & Navy Stripes</span>
          </div>
        </div>

        {/* Quick Testing: Stage Jumper */}
        {onSetPoints && (
          <div className="mt-6 p-4 rounded-2xl bg-surface-container border border-surface-container-high">
            <span className="text-[10px] font-label-caps uppercase text-outline font-bold block mb-2">
              Fast-Track Testing (Jump Race Stages)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onSetPoints(350)}
                className={`py-1.5 px-2 rounded-xl text-xs font-label-caps font-bold transition-all cursor-pointer ${
                  user.points < 500
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white hover:bg-surface-container-high text-primary'
                }`}
              >
                Q1 (350 PTS)
              </button>
              <button
                onClick={() => onSetPoints(550)}
                className={`py-1.5 px-2 rounded-xl text-xs font-label-caps font-bold transition-all cursor-pointer ${
                  user.points >= 500 && user.points < 800
                    ? 'bg-secondary text-white shadow-sm'
                    : 'bg-white hover:bg-surface-container-high text-secondary'
                }`}
              >
                Q2 (550 PTS)
              </button>
              <button
                onClick={() => onSetPoints(850)}
                className={`py-1.5 px-2 rounded-xl text-xs font-label-caps font-bold transition-all cursor-pointer ${
                  user.points >= 800 && user.points < 1200
                    ? 'bg-tertiary text-white shadow-sm'
                    : 'bg-white hover:bg-surface-container-high text-tertiary'
                }`}
              >
                Q3 (850 PTS)
              </button>
              <button
                onClick={() => onSetPoints(1250)}
                className={`py-1.5 px-2 rounded-xl text-xs font-label-caps font-bold transition-all cursor-pointer ${
                  user.points >= 1200
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-white hover:bg-surface-container-high text-amber-600'
                }`}
              >
                Q4 (1250 PTS)
              </button>
            </div>
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-3 bg-primary text-white rounded-xl text-xs font-label-caps uppercase font-bold hover:bg-primary-container transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
