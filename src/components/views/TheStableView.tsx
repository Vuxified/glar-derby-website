import React, { useState } from 'react';
import { StableRanking, Jockey, SubmissionItem } from '../../types';

interface TheStableViewProps {
  stables: StableRanking[];
  jockeys: Jockey[];
  queueItems: SubmissionItem[];
  onApproveQueueItem: (id: string) => void;
  onDenyQueueItem: (id: string) => void;
  onApproveAll: () => void;
  onOpenJockeyDetail?: (jockey: Jockey) => void;
}

export const TheStableView: React.FC<TheStableViewProps> = ({
  stables,
  jockeys,
  queueItems,
  onApproveQueueItem,
  onDenyQueueItem,
  onApproveAll,
  onOpenJockeyDetail,
}) => {
  // Sub-tab: 'standings' | 'overview'
  const [subTab, setSubTab] = useState<'standings' | 'overview'>('standings');
  const [isNormalized, setIsNormalized] = useState(true);
  const [periodFilter, setPeriodFilter] = useState<'SEASON TO DATE' | 'Q3 2024' | 'Q2 2024'>('SEASON TO DATE');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);
  const [approvingIds, setApprovingIds] = useState<{ [key: string]: 'approved' | 'denied' }>({});

  const handleApprove = (id: string) => {
    setApprovingIds((prev) => ({ ...prev, [id]: 'approved' }));
    setTimeout(() => {
      onApproveQueueItem(id);
      setApprovingIds((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }, 700);
  };

  const handleDeny = (id: string) => {
    setApprovingIds((prev) => ({ ...prev, [id]: 'denied' }));
    setTimeout(() => {
      onDenyQueueItem(id);
      setApprovingIds((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }, 700);
  };

  // Top 3 Podium
  const gold = stables[0];
  const silver = stables[1];
  const bronze = stables[2];

  // Filtered lower ranks
  const lowerRanks = stables.slice(3).filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.tier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedLowerRanks = lowerRanks.slice(0, visibleCount);

  return (
    <div className="flex flex-col w-full relative pb-12">
      {/* Top Sub-Navigation Pill Bar */}
      <div className="px-4 sm:px-8 lg:px-margin-desktop pt-6 pb-2 flex items-center justify-between border-b border-surface-container-high/60 bg-surface">
        <div className="flex items-center gap-2 bg-surface-container p-1 rounded-2xl">
          <button
            onClick={() => setSubTab('standings')}
            className={`px-5 py-2 rounded-xl font-label-caps text-label-caps transition-all cursor-pointer ${
              subTab === 'standings'
                ? 'bg-primary text-white shadow-md'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-variant/50'
            }`}
          >
            THE STABLE STANDINGS
          </button>
          <button
            onClick={() => setSubTab('overview')}
            className={`px-5 py-2 rounded-xl font-label-caps text-label-caps transition-all flex items-center gap-2 cursor-pointer ${
              subTab === 'overview'
                ? 'bg-primary text-white shadow-md'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-variant/50'
            }`}
          >
            <span>TRAINER COMMAND CENTER</span>
            {queueItems.length > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  subTab === 'overview' ? 'bg-derby-red text-white' : 'bg-derby-red/20 text-derby-red'
                }`}
              >
                {queueItems.length}
              </span>
            )}
          </button>
        </div>

        <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-outline">
          <span className="material-symbols-outlined text-sm">flag</span>
          GLAR Derby Circuit 2024
        </span>
      </div>

      {subTab === 'standings' ? (
        /* ==================== VIEW 1: THE STABLE STANDINGS ==================== */
        <div className="flex flex-col w-full relative">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-3/4 h-96 bg-gradient-to-bl from-tertiary-fixed/20 to-transparent -z-10 rounded-bl-[120px] pointer-events-none"></div>
          <div className="absolute top-40 left-0 w-1/2 h-full bg-gradient-to-tr from-primary-fixed/10 to-transparent -z-10 pointer-events-none"></div>

          {/* Header Section */}
          <div className="px-4 sm:px-8 lg:px-margin-desktop py-10 lg:py-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
            <div className="flex flex-col max-w-2xl z-10 relative">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-4 py-1 bg-surface-container-high rounded-full font-label-caps text-label-caps text-on-surface-variant tracking-widest uppercase">
                  SEASON 2024
                </span>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  <span className="font-body-sm text-body-sm">Last updated: 2h ago</span>
                </div>
              </div>
              <h1 className="font-display-xl text-4xl sm:text-5xl lg:text-display-xl text-primary mb-4 leading-tight">
                The Stable <br />
                <span className="text-tertiary-container relative inline-block">
                  Standings
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-tertiary-fixed-dim pointer-events-none"
                    fill="currentColor"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 10"
                  >
                    <path d="M0 8 Q 25 0 50 5 T 100 2 L 100 10 L 0 10 Z"></path>
                  </svg>
                </span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Tracking the top-performing brokerages on the track. Stables are ranked by normalized
                points, ensuring fair competition across firm sizes.
              </p>
            </div>

            {/* Normalized Score Toggle / Info Box */}
            <div className="bg-surface-container rounded-2xl p-6 md:w-80 flex-shrink-0 relative overflow-hidden shadow-sm z-10 transform md:translate-y-8 border border-surface-container-high/60">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <span className="material-symbols-outlined text-primary text-3xl">balance</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNormalized}
                    onChange={(e) => setIsNormalized(e.target.checked)}
                    className="sr-only peer"
                    id="normalize-toggle"
                  />
                  <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-derby-red"></div>
                </label>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2 relative z-10">
                Normalized Scoring
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant relative z-10">
                {isNormalized
                  ? 'Currently viewing weighted scores based on agent count and participation rate. Toggle to view raw volume points.'
                  : 'Currently viewing raw volume points without brokerage headcount weighting.'}
              </p>
            </div>
          </div>

          {/* Podium Section (Top 3) */}
          <div className="px-4 sm:px-8 lg:px-margin-desktop py-12 bg-surface z-10 relative mt-4 md:-mt-8">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-end justify-center gap-8 md:gap-4 lg:gap-8">
              {/* Silver (2nd) */}
              {silver && (
                <div className="w-full md:w-1/3 flex flex-col items-center justify-end group cursor-pointer order-2 md:order-1 transition-transform duration-500 hover:-translate-y-3">
                  <div className="relative w-full aspect-square md:aspect-auto md:h-64 rounded-t-3xl overflow-hidden mb-[-24px] z-10 shadow-md">
                    <img
                      className="w-full h-full object-cover grayscale opacity-85 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 mix-blend-multiply"
                      data-alt="Crescent Realty team"
                      src={silver.logoUrl}
                      alt={silver.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
                    <div className="absolute bottom-10 left-0 w-full text-center z-20">
                      <div className="w-12 h-12 rounded-full bg-outline-variant text-white flex items-center justify-center mx-auto mb-2 shadow-lg border-2 border-white font-stats-number text-2xl font-bold leading-none">
                        2
                      </div>
                    </div>
                  </div>
                  <div className="bg-surface-container w-full rounded-2xl p-6 text-center shadow-md relative z-20 border border-surface-container-high/60 before:absolute before:inset-0 before:bg-gradient-to-b before:from-outline-variant/20 before:to-transparent before:rounded-2xl before:pointer-events-none">
                    <h2 className="font-headline-md text-headline-md text-on-surface mb-1">
                      {silver.name}
                    </h2>
                    <p className="font-label-caps text-label-caps text-outline mb-4">
                      {silver.tier}
                    </p>
                    <div className="font-stats-number text-stats-number text-on-surface transition-all">
                      {(isNormalized ? silver.normalizedPoints : silver.rawPoints).toLocaleString()}{' '}
                      <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">
                        pts
                      </span>
                    </div>
                    <div className="mt-4 flex justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span>
                      <span className="w-2 h-2 rounded-full bg-secondary"></span>
                      <span className="w-2 h-2 rounded-full bg-surface-variant"></span>
                    </div>
                  </div>
                </div>
              )}

              {/* Gold (1st) */}
              {gold && (
                <div className="w-full md:w-1/3 flex flex-col items-center justify-end group cursor-pointer order-1 md:order-2 transform md:-translate-y-8 transition-transform duration-500 hover:-translate-y-12 z-30">
                  {/* Crown SVG */}
                  <div className="text-tertiary-fixed mb-2 animate-bounce">
                    <svg
                      fill="currentColor"
                      height="32"
                      viewBox="0 0 40 32"
                      width="40"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M20 0L30.5 12H9.5L20 0Z"></path>
                      <path d="M38 4L28 20H40L38 4Z"></path>
                      <path d="M2 4L12 20H0L2 4Z"></path>
                      <path d="M4 22H36V32H4V22Z"></path>
                    </svg>
                  </div>
                  <div className="relative w-full aspect-square md:aspect-auto md:h-80 rounded-t-3xl overflow-hidden mb-[-24px] z-10 shadow-2xl shadow-tertiary-container/30">
                    <img
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      data-alt="Apex Partners celebrating"
                      src={gold.logoUrl}
                      alt={gold.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-tertiary-container/90 via-tertiary-container/40 to-transparent mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-90"></div>
                    <div className="absolute bottom-10 left-0 w-full text-center z-20">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-tertiary-fixed to-tertiary text-on-tertiary-fixed flex items-center justify-center mx-auto mb-2 shadow-xl border-4 border-white font-stats-number text-stats-number text-[38px] font-bold leading-none">
                        1
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-b from-tertiary-container to-surface-container w-full rounded-2xl p-8 text-center shadow-xl relative z-20 border-[1px] border-tertiary-fixed/30">
                    <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-tertiary-container mb-1">
                      {gold.name}
                    </h2>
                    <p className="font-label-caps text-label-caps text-on-tertiary-container/70 mb-4">
                      {gold.tier}
                    </p>
                    <div className="font-stats-number text-stats-number text-[40px] text-on-tertiary-container transition-all font-black">
                      {(isNormalized ? gold.normalizedPoints : gold.rawPoints).toLocaleString()}{' '}
                      <span className="font-body-sm text-body-sm text-on-tertiary-container/80 font-normal">
                        pts
                      </span>
                    </div>
                    <div className="mt-4 flex justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-derby-red"></span>
                      <span className="w-2 h-2 rounded-full bg-derby-red"></span>
                      <span className="w-2 h-2 rounded-full bg-derby-red"></span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bronze (3rd) */}
              {bronze && (
                <div className="w-full md:w-1/3 flex flex-col items-center justify-end group cursor-pointer order-3 transition-transform duration-500 hover:-translate-y-3">
                  <div className="relative w-full aspect-square md:aspect-auto md:h-56 rounded-t-3xl overflow-hidden mb-[-24px] z-10 shadow-md">
                    <img
                      className="w-full h-full object-cover grayscale opacity-85 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 mix-blend-multiply"
                      data-alt="Vanguard Group team"
                      src={bronze.logoUrl}
                      alt={bronze.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
                    <div className="absolute bottom-10 left-0 w-full text-center z-20">
                      <div className="w-12 h-12 rounded-full bg-[#CD7F32] text-white flex items-center justify-center mx-auto mb-2 shadow-lg border-2 border-white font-stats-number text-2xl font-bold leading-none">
                        3
                      </div>
                    </div>
                  </div>
                  <div className="bg-surface-container w-full rounded-2xl p-6 text-center shadow-md relative z-20 border border-surface-container-high/60 before:absolute before:inset-0 before:bg-gradient-to-b before:from-[#CD7F32]/20 before:to-transparent before:rounded-2xl before:pointer-events-none">
                    <h2 className="font-headline-md text-headline-md text-on-surface mb-1">
                      {bronze.name}
                    </h2>
                    <p className="font-label-caps text-label-caps text-outline mb-4">
                      {bronze.tier}
                    </p>
                    <div className="font-stats-number text-stats-number text-on-surface transition-all">
                      {(isNormalized ? bronze.normalizedPoints : bronze.rawPoints).toLocaleString()}{' '}
                      <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">
                        pts
                      </span>
                    </div>
                    <div className="mt-4 flex justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span>
                      <span className="w-2 h-2 rounded-full bg-surface-variant"></span>
                      <span className="w-2 h-2 rounded-full bg-surface-variant"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Table / Leaderboard Section */}
          <div className="px-4 sm:px-8 lg:px-margin-desktop py-12 flex-1 flex flex-col items-center">
            <div className="w-full max-w-6xl">
              {/* Filters & Search */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-surface-container-low p-2 rounded-2xl border border-surface-container-high/50">
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto custom-scrollbar">
                  {(['SEASON TO DATE', 'Q3 2024', 'Q2 2024'] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => setPeriodFilter(period)}
                      className={`px-5 py-2.5 rounded-xl font-label-caps text-label-caps whitespace-nowrap transition-all cursor-pointer ${
                        periodFilter === period
                          ? 'bg-primary text-on-primary shadow-md'
                          : 'bg-transparent text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
                <div className="relative w-full md:w-72">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Stables..."
                    className="w-full pl-10 pr-4 py-2.5 bg-surface rounded-xl font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow border border-surface-container-high"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary text-xs"
                    >
                      clear
                    </button>
                  )}
                </div>
              </div>

              {/* Stables List Rows */}
              <div className="flex flex-col gap-3">
                {displayedLowerRanks.map((stable) => {
                  const points = isNormalized ? stable.normalizedPoints : stable.rawPoints;
                  return (
                    <div
                      key={stable.name}
                      className="flex items-center gap-4 sm:gap-6 bg-surface p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer relative overflow-hidden border border-surface-container-high/60"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-surface-dim group-hover:bg-primary transition-colors"></div>
                      <div className="w-10 sm:w-12 text-center font-stats-number text-2xl sm:text-headline-lg text-outline-variant group-hover:text-primary transition-colors font-bold">
                        {stable.rank}
                      </div>

                      {stable.logoUrl ? (
                        <div
                          className="w-12 h-12 rounded-full bg-cover bg-center border-2 border-surface-variant shrink-0"
                          style={{ backgroundImage: `url('${stable.logoUrl}')` }}
                        ></div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm shrink-0">
                          {stable.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h4 className="font-headline-md text-lg sm:text-[20px] text-on-surface truncate">
                          {stable.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 mt-1">
                          <span className="font-label-caps text-[10px] text-outline px-2 py-0.5 bg-surface-container rounded-sm uppercase">
                            {stable.tier}
                          </span>
                          <span className="font-body-sm text-[12px] text-on-surface-variant flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">group</span>{' '}
                            {stable.agentCount} Agents
                          </span>
                        </div>
                      </div>

                      {/* Progress Track Mini */}
                      <div className="hidden lg:flex items-center gap-3 w-48 mx-4">
                        <div className="h-2 w-full bg-track-sand rounded-full overflow-hidden relative">
                          <div
                            className="h-full bg-secondary rounded-full"
                            style={{ width: `${stable.trackProgressPercent}%` }}
                          ></div>
                        </div>
                        <span className="font-body-sm text-[12px] text-secondary font-bold">
                          {stable.trackProgressPercent}%
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-stats-number text-xl sm:text-headline-lg-mobile text-on-surface font-bold">
                          {points.toLocaleString()}
                        </div>
                        <div
                          className={`font-body-sm text-[12px] flex items-center justify-end gap-1 ${
                            stable.weeklyChangeType === 'up'
                              ? 'text-secondary'
                              : stable.weeklyChangeType === 'down'
                              ? 'text-derby-red'
                              : 'text-outline'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {stable.weeklyChangeType === 'up'
                              ? 'trending_up'
                              : stable.weeklyChangeType === 'down'
                              ? 'trending_down'
                              : 'trending_flat'}
                          </span>
                          <span>{stable.weeklyChange}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Load More Stables */}
              {visibleCount < lowerRanks.length && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 4)}
                    className="px-8 py-3 rounded-xl border-2 border-primary text-primary font-label-caps text-label-caps hover:bg-primary hover:text-white transition-all cursor-pointer font-bold"
                  >
                    LOAD MORE STABLES
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ==================== VIEW 2: TRAINER COMMAND CENTER / STABLE OVERVIEW ==================== */
        <div className="flex flex-col w-full">
          <div className="px-4 sm:px-8 lg:px-margin-desktop py-10 lg:py-12">
            {/* Command Center Title & Ranking */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-12">
              <div className="col-span-1 lg:col-span-8 space-y-3">
                <div className="flex items-center gap-3 text-derby-red uppercase tracking-widest text-xs font-bold font-label-caps">
                  <span className="w-8 h-[2px] bg-derby-red inline-block"></span>
                  Trainer Command Center
                </div>
                <h1 className="font-display-xl text-3xl sm:text-4xl lg:text-display-xl text-primary tracking-tight leading-tight">
                  Stable Overview
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-4">
                  Monitor your jockeys' performance on the track, approve incoming point submissions,
                  and guide your stable to the Winner's Circle.
                </p>
              </div>
              <div className="col-span-1 lg:col-span-4 flex flex-col justify-end gap-3 mt-6 lg:mt-0">
                <div className="bg-surface-container rounded-2xl p-6 relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow border border-surface-container-high/60">
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-tertiary-fixed rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-md">
                      <span className="material-symbols-outlined text-2xl text-tertiary-fixed">
                        trophy
                      </span>
                    </div>
                    <div>
                      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">
                        Stable Ranking
                      </p>
                      <p className="font-stats-number text-3xl sm:text-stats-number text-primary leading-none font-extrabold">
                        #2{' '}
                        <span className="text-sm font-body-md text-on-surface-variant align-middle ml-2 font-normal">
                          of 14 Stables
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Metric Summary Bento Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-12">
              <div className="bg-surface-container rounded-2xl p-6 relative overflow-hidden shadow-sm border border-surface-container-high/60">
                <div className="absolute -bottom-4 -right-4 text-primary opacity-5 pointer-events-none">
                  <span className="material-symbols-outlined" style={{ fontSize: '120px' }}>
                    speed
                  </span>
                </div>
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2 relative z-10">
                  Total Stable Points
                </p>
                <p className="font-stats-number text-3xl sm:text-stats-number text-primary mb-4 relative z-10 font-bold">
                  4,850
                </p>
                <div className="flex items-center gap-2 text-sm text-secondary relative z-10 font-body-md font-semibold">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  <span>+320 this week</span>
                </div>
              </div>

              <div className="bg-surface-container rounded-2xl p-6 relative overflow-hidden shadow-sm border border-surface-container-high/60">
                <div className="absolute -bottom-4 -right-4 text-primary opacity-5 pointer-events-none">
                  <span className="material-symbols-outlined" style={{ fontSize: '120px' }}>
                    group
                  </span>
                </div>
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2 relative z-10">
                  Active Jockeys
                </p>
                <p className="font-stats-number text-3xl sm:text-stats-number text-primary mb-4 relative z-10 font-bold">
                  8{' '}
                  <span className="text-lg font-body-md text-on-surface-variant align-baseline font-normal">
                    / 10
                  </span>
                </p>
                <div className="flex items-center gap-2 text-sm text-secondary relative z-10 font-body-md font-semibold">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>2 ready for promotion</span>
                </div>
              </div>

              <div className="bg-surface-container rounded-2xl p-6 relative overflow-hidden shadow-sm border border-surface-container-high/60">
                <div className="absolute -bottom-4 -right-4 text-primary opacity-5 pointer-events-none">
                  <span className="material-symbols-outlined" style={{ fontSize: '120px' }}>
                    pending_actions
                  </span>
                </div>
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2 relative z-10">
                  Pending Approvals
                </p>
                <p className="font-stats-number text-3xl sm:text-stats-number text-derby-red mb-4 relative z-10 font-bold">
                  {queueItems.length}
                </p>
                <div className="flex items-center gap-2 text-sm text-on-surface-variant relative z-10 font-body-md">
                  <span className="material-symbols-outlined text-sm text-derby-red">
                    hourglass_empty
                  </span>
                  <span>Requires attention today</span>
                </div>
              </div>
            </div>

            {/* Stable Management (Left) + Approval Queue (Right) */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter">
              {/* Left Column: Stable Management */}
              <div className="xl:col-span-8 space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-headline-lg text-2xl sm:text-headline-lg text-primary font-bold">
                    Stable Management
                  </h2>
                  <button
                    onClick={() => setSubTab('standings')}
                    className="text-sm font-label-caps text-label-caps text-primary hover:text-derby-red transition-colors flex items-center gap-1 uppercase cursor-pointer"
                  >
                    <span>View Full Report</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {jockeys.map((jockey, idx) => (
                    <div
                      key={jockey.id}
                      onClick={() => onOpenJockeyDetail && onOpenJockeyDetail(jockey)}
                      className="bg-surface-container rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group cursor-pointer border border-surface-container-high/60"
                    >
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                          idx === 0
                            ? 'bg-tertiary-fixed'
                            : idx === 1
                            ? 'bg-outline-variant'
                            : 'bg-primary/20'
                        }`}
                      ></div>

                      <div className="flex items-center gap-4 w-full md:w-1/3 shrink-0">
                        {jockey.avatar ? (
                          <img
                            className="w-16 h-16 rounded-full object-cover shadow-sm ring-2 ring-tertiary-fixed ring-offset-2 ring-offset-surface-container shrink-0"
                            src={jockey.avatar}
                            alt={jockey.name}
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-display-xl text-[24px] font-bold shadow-sm shrink-0">
                            {jockey.initials || jockey.name.slice(0, 2)}
                          </div>
                        )}
                        <div>
                          <h3 className="font-headline-md text-headline-md text-primary text-[20px] leading-tight font-bold">
                            {jockey.name}
                          </h3>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                            {jockey.role}
                          </p>
                        </div>
                      </div>

                      <div className="w-full flex-1">
                        <div className="flex justify-between items-end mb-2">
                          <div className="font-body-sm text-body-sm text-on-surface-variant">
                            Track Progress
                          </div>
                          <div className="font-label-caps text-label-caps text-primary font-bold">
                            {jockey.points.toLocaleString()} PTS
                          </div>
                        </div>
                        <div className="h-4 bg-track-sand rounded-full overflow-hidden relative shadow-inner">
                          <div
                            className="absolute top-0 left-0 h-full bg-secondary rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-1000 ease-out"
                            style={{ width: `${jockey.progressPercent}%` }}
                          ></div>
                          {idx === 0 && (
                            <div
                              className="absolute top-0 w-4 h-full bg-white/30 skew-x-[-20deg] animate-shine"
                              style={{ left: '80%' }}
                            ></div>
                          )}
                        </div>
                        <div className="flex justify-between mt-2 text-xs font-body-sm text-outline">
                          <span>Start</span>
                          <span>Finish Line</span>
                        </div>
                      </div>

                      <div className="w-full md:w-auto shrink-0 flex justify-end">
                        <button
                          aria-label="View Jockey Profile"
                          className="w-10 h-10 rounded-full bg-surface-variant text-on-surface-variant hover:bg-primary hover:text-white transition-colors flex items-center justify-center shadow-sm cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Approval Queue */}
              <div className="xl:col-span-4 space-y-6 mt-10 xl:mt-0">
                <h2 className="font-headline-lg text-2xl sm:text-headline-lg text-primary flex items-center gap-3 font-bold">
                  <span>Approval Queue</span>
                  <span className="bg-derby-red text-white text-xs font-label-caps px-2.5 py-1 rounded-full align-middle mb-1">
                    {queueItems.length}
                  </span>
                </h2>

                <div className="bg-surface-container rounded-2xl shadow-sm overflow-hidden flex flex-col border border-surface-container-high/60">
                  <div className="p-4 bg-surface-variant border-b border-surface-dim/50 flex justify-between items-center z-10 shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                      Recent Submissions
                    </span>
                    {queueItems.length > 0 && (
                      <button
                        onClick={onApproveAll}
                        className="text-xs text-primary font-bold hover:text-derby-red hover:underline cursor-pointer"
                      >
                        Approve All
                      </button>
                    )}
                  </div>

                  <div className="flex-1 p-3 space-y-3 max-h-[580px] overflow-y-auto custom-scrollbar">
                    {queueItems.length === 0 ? (
                      <div className="p-8 text-center flex flex-col items-center justify-center text-outline">
                        <span className="material-symbols-outlined text-4xl mb-2 text-secondary">
                          task_alt
                        </span>
                        <p className="font-headline-md text-sm text-primary font-bold">
                          Queue Cleared!
                        </p>
                        <p className="font-body-sm text-xs mt-1">
                          All incoming jockey points have been verified.
                        </p>
                      </div>
                    ) : (
                      queueItems.map((item) => {
                        const status = approvingIds[item.id];
                        return (
                          <div
                            key={item.id}
                            className={`bg-surface p-4 rounded-xl shadow-sm hover:shadow-md transition-all group relative overflow-hidden border border-surface-container-high/40 ${
                              status ? 'scale-95 opacity-80' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {item.jockeyAvatar ? (
                                <img
                                  className="w-10 h-10 rounded-full object-cover shrink-0 mt-1"
                                  src={item.jockeyAvatar}
                                  alt={item.jockeyName}
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-display-xl text-[15px] font-bold shrink-0 mt-1">
                                  {item.jockeyInitials || 'JK'}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                  <h4 className="font-body-md font-bold text-primary truncate">
                                    {item.jockeyName}
                                  </h4>
                                  <span className="text-xs font-label-caps font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-md shrink-0">
                                    +{item.points} PTS
                                  </span>
                                </div>
                                <p className="font-body-sm text-sm text-on-surface-variant mt-1 line-clamp-2">
                                  {item.title}
                                </p>
                                {(item.verificationTier || item.proofFileName || item.mlsNumber) && (
                                  <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                                    {item.verificationTier && (
                                      <span className="text-[10px] font-label-caps px-2 py-0.5 rounded-md bg-primary/10 text-primary font-bold">
                                        {item.verificationTier}
                                      </span>
                                    )}
                                    {item.proofFileName && (
                                      <span className="text-[10px] text-secondary font-medium flex items-center gap-1 bg-secondary/10 px-2 py-0.5 rounded-md">
                                        <span className="material-symbols-outlined text-[13px]">attachment</span>
                                        <span className="truncate max-w-[140px]">{item.proofFileName}</span>
                                      </span>
                                    )}
                                    {item.mlsNumber && (
                                      <span className="text-[10px] text-outline font-medium bg-surface-container px-1.5 py-0.5 rounded">
                                        MLS #{item.mlsNumber}
                                      </span>
                                    )}
                                  </div>
                                )}
                                {item.note && (
                                  <div className="mt-2 bg-surface-variant rounded p-2 text-xs text-on-surface-variant font-body-sm border-l-2 border-primary italic">
                                    {item.note}
                                  </div>
                                )}
                                <p className="text-xs text-outline mt-2 font-body-sm flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[14px]">
                                    schedule
                                  </span>{' '}
                                  {item.timeAgo}
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 flex gap-2">
                              <button
                                onClick={() => handleApprove(item.id)}
                                disabled={Boolean(status)}
                                className="flex-1 bg-primary text-on-primary py-2 rounded-xl font-label-caps text-label-caps hover:bg-primary-container transition-colors flex items-center justify-center gap-1 shadow-sm cursor-pointer active:scale-95 disabled:opacity-50"
                              >
                                <span className="material-symbols-outlined text-[16px]">check</span>{' '}
                                Approve
                              </button>
                              <button
                                onClick={() => handleDeny(item.id)}
                                disabled={Boolean(status)}
                                className="px-4 bg-surface-variant text-on-surface-variant py-2 rounded-xl font-label-caps text-label-caps hover:bg-error hover:text-white transition-colors shadow-sm cursor-pointer active:scale-95 disabled:opacity-50"
                              >
                                Deny
                              </button>
                            </div>

                            {/* Action Overlay */}
                            {status && (
                              <div
                                className={`absolute inset-0 flex flex-col items-center justify-center text-white backdrop-blur-sm z-20 animate-in fade-in duration-200 ${
                                  status === 'approved' ? 'bg-secondary/95' : 'bg-error/95'
                                }`}
                              >
                                <span className="material-symbols-outlined text-4xl mb-1">
                                  {status === 'approved' ? 'check_circle' : 'cancel'}
                                </span>
                                <span className="font-label-caps font-bold tracking-widest text-xs">
                                  {status === 'approved' ? 'APPROVED' : 'DENIED'}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="p-4 bg-surface-variant border-t border-surface-dim/50 text-center">
                    <button
                      onClick={() => alert('All older submissions from previous seasons are archived in Race Operations Records.')}
                      className="text-xs font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors uppercase cursor-pointer"
                    >
                      View Archived Submissions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
