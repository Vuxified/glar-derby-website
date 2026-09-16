import React, { useState } from 'react';
import { ActivityTask, Jockey } from '../../types';

interface ThePaddockViewProps {
  tasks: ActivityTask[];
  onLogTask: (task: ActivityTask) => void;
  onRequestSubmitEvidence?: (task: ActivityTask) => void;
  onOpenNewStake: () => void;
  currentUser: Jockey;
}

export const ThePaddockView: React.FC<ThePaddockViewProps> = ({
  tasks,
  onLogTask,
  onRequestSubmitEvidence,
  onOpenNewStake,
  currentUser,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const categories = ['All', 'Education', 'Production', 'Networking', 'Mentorship'];

  const filteredTasks = tasks.filter((task) => {
    const matchesCategory = activeCategory === 'All' || task.category === activeCategory;
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full max-w-full relative pb-16 overflow-x-hidden">
      <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-10 flex flex-col gap-6 sm:gap-10">
        {/* Header Banner */}
        <div className="bg-primary text-on-primary rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 relative overflow-hidden shadow-xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-primary-container/40 to-transparent pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 sm:gap-6">
            <div className="min-w-0">
              <span className="font-label-caps text-[10px] sm:text-xs uppercase text-tertiary-fixed tracking-widest font-bold mb-1 sm:mb-2 inline-block">
                THE PREPARATION GROUNDS
              </span>
              <h1 className="font-display-xl text-2xl sm:text-3xl md:text-4xl text-white font-bold tracking-tight">
                The Paddock Catalog
              </h1>
              <p className="font-body-md text-sm sm:text-base text-white/70 max-w-xl mt-2 leading-relaxed">
                Every championship is forged before race day. Complete verified educational,
                production, and networking stakes to advance your horse along the track.
              </p>
            </div>
            <button
              onClick={onOpenNewStake}
              className="bg-derby-red hover:bg-derby-red/90 text-white font-label-caps text-xs uppercase tracking-wider px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all w-full md:w-auto shrink-0 cursor-pointer font-bold"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              <span>SUBMIT CUSTOM STAKE</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 sm:gap-4 bg-surface-container p-2.5 sm:p-3 rounded-2xl border border-surface-container-high/60 w-full max-w-full">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full md:w-auto pb-1.5 md:pb-0 custom-scrollbar overscroll-x-contain shrink min-w-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-label-caps uppercase transition-all whitespace-nowrap shrink-0 cursor-pointer font-bold ${
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72 shrink-0">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stakes & tasks..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-surface-container-high text-xs font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Task Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-full">
          {filteredTasks.map((task) => {
            // Check dynamic unlocking for Q2 Solo Listing
            const isLocked =
              task.locked && (task.id === 'task-4' ? currentUser.points < 500 : true);

            const tier =
              task.verificationTier ||
              (task.points >= 50 ? 'Tier 3' : task.points >= 20 ? 'Tier 2' : 'Tier 1');

            return (
              <div
                key={task.id}
                className={`bg-surface rounded-2xl p-5 sm:p-6 shadow-sm border flex flex-col justify-between transition-all group relative overflow-hidden min-w-0 w-full ${
                  isLocked
                    ? 'opacity-60 grayscale border-surface-container-high'
                    : 'border-surface-container-high/60 hover:shadow-md hover:border-primary/40'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-label-caps uppercase font-bold tracking-wider shrink-0 ${
                        task.category === 'Education'
                          ? 'bg-secondary/10 text-secondary'
                          : task.category === 'Production'
                          ? 'bg-tertiary/15 text-on-surface'
                          : task.category === 'Networking'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-derby-red/10 text-derby-red'
                      }`}
                    >
                      {task.category} • {tier}
                    </span>
                    <span className="font-stats-number text-base sm:text-lg font-bold text-primary shrink-0">
                      +{task.points} PTS
                    </span>
                  </div>

                  <h3 className="font-headline-md text-base sm:text-lg text-primary font-bold mb-2 group-hover:text-derby-red transition-colors break-words">
                    {task.title}
                  </h3>
                  <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-4 break-words">
                    {task.description}
                  </p>

                  {task.progressTotal && (
                    <div className="bg-surface-container-low p-3 rounded-xl mb-4">
                      <div className="flex justify-between text-xs font-body-sm mb-1.5">
                        <span className="text-outline">Weekly Progress</span>
                        <span className="font-bold text-primary">
                          {task.progressCurrent || 0} of {task.progressTotal}
                        </span>
                      </div>
                      <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-derby-red h-full rounded-full transition-all"
                          style={{
                            width: `${((task.progressCurrent || 0) / task.progressTotal) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {task.nextDate && (
                    <div className="flex items-center gap-1.5 text-xs text-secondary font-medium mb-4">
                      <span className="material-symbols-outlined text-sm">calendar_month</span>
                      <span className="break-words">Next: {task.nextDate}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-surface-container flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5">
                  {isLocked ? (
                    <span className="text-xs font-label-caps text-outline flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">lock</span>
                      <span>{task.id === 'task-4' ? 'Reach 500 PTS (Q2)' : task.lockReason || 'Locked'}</span>
                    </span>
                  ) : (
                    <>
                      <span className="text-xs text-outline font-body-sm">
                        {tier === 'Tier 1' ? 'Honor Verify' : 'Requires Proof'}
                      </span>
                      <button
                        onClick={() => {
                          if (onRequestSubmitEvidence) {
                            onRequestSubmitEvidence(task);
                          } else {
                            onLogTask(task);
                          }
                        }}
                        className="bg-primary hover:bg-primary-container text-white px-3.5 sm:px-4 py-2 rounded-xl text-xs font-label-caps uppercase font-bold transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                      >
                        <span className="material-symbols-outlined text-sm">
                          {tier === 'Tier 1' ? 'check' : 'upload_file'}
                        </span>
                        <span>{tier === 'Tier 1' ? 'LOG TASK' : 'SUBMIT PROOF'}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
