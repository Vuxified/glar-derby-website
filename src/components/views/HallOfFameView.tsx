import React, { useState } from 'react';
import { Mentor } from '../../types';
import { FEATURED_MENTOR, PADDOCK_LEGENDS } from '../../data/mockData';

interface HallOfFameViewProps {
  onSelectMentor: (mentor: Mentor) => void;
  onRequestMentorship: (mentor: Mentor) => void;
  onWatchSpeech: () => void;
}

export const HallOfFameView: React.FC<HallOfFameViewProps> = ({
  onSelectMentor,
  onRequestMentorship,
  onWatchSpeech,
}) => {
  const [filterSeason, setFilterSeason] = useState<string>('All Seasons');
  const [orbitPaused, setOrbitPaused] = useState(false);

  const filteredLegends = PADDOCK_LEGENDS.filter((mentor) => {
    if (filterSeason === 'All Seasons') return true;
    if (filterSeason === '2023 Season') return mentor.seasonYear === '2023';
    if (filterSeason === '2022 Season') return mentor.seasonYear === '2022';
    if (filterSeason === '2021 Season') return mentor.seasonYear === '2021';
    return true;
  });

  return (
    <div className="flex flex-col w-full relative pb-16">
      {/* Decorative Track Texture Lines */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern height="40" id="track-lines" patternUnits="userSpaceOnUse" width="40">
              <path
                d="M 0 20 L 40 20 M 20 0 L 20 40"
                fill="none"
                stroke="#00112a"
                strokeWidth="0.5"
              ></path>
            </pattern>
          </defs>
          <rect fill="url(#track-lines)" height="100%" width="100%"></rect>
        </svg>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-margin-desktop py-10 lg:py-12 flex flex-col gap-16">
        {/* Header / Hero Section */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-surface-container-high/80 pb-10">
          <div className="flex flex-col max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-derby-red inline-block animate-pulse"></span>
              <span className="font-label-caps text-label-caps text-derby-red uppercase tracking-widest">
                The Winner's Circle
              </span>
            </div>
            <h1 className="font-display-xl text-3xl sm:text-5xl lg:text-display-xl text-primary tracking-tight leading-tight">
              Hall of Fame &amp; <br />
              <span className="text-secondary">Legacy Mentors</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-4 leading-relaxed">
              Celebrating the jockeys who mastered the track, reached the Winner's Circle, and
              returned to the paddock as Master Trainers to shepherd the next generation of real estate
              champions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="bg-surface-container rounded-2xl p-5 border border-surface-container-high/60 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-tertiary-fixed/30 flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined text-2xl">workspace_premium</span>
              </div>
              <div className="flex flex-col">
                <span className="font-stats-number text-2xl text-primary font-bold leading-none">
                  124
                </span>
                <span className="font-label-caps text-[11px] text-on-surface-variant uppercase mt-1">
                  Inducted Champions
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Hall of Famer: Elena Rostova */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-surface-container-high/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Left: Champion Photo Card */}
            <div className="lg:col-span-5 relative group">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl bg-surface-container">
                <img
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  src={FEATURED_MENTOR.imageUrl}
                  alt={FEATURED_MENTOR.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent"></div>

                {/* Badge Overlay */}
                <div className="absolute top-4 left-4 bg-tertiary-fixed text-primary px-3.5 py-1.5 rounded-full font-label-caps text-xs font-bold shadow-md flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">military_tech</span>
                  {FEATURED_MENTOR.seasonBadge}
                </div>

                {/* Play Video Induction Speech Button */}
                <button
                  onClick={onWatchSpeech}
                  className="absolute bottom-6 left-6 right-6 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-xl py-3 px-4 flex items-center justify-between transition-all group-hover:bg-derby-red group-hover:text-white shadow-lg cursor-pointer"
                >
                  <span className="font-label-caps text-xs tracking-wider uppercase font-bold">
                    Watch Induction Speech
                  </span>
                  <span className="material-symbols-outlined text-xl">play_circle</span>
                </button>
              </div>
            </div>

            {/* Right: Champion Stats & Bio */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex flex-col">
                <span className="font-label-caps text-xs uppercase text-secondary font-bold tracking-widest mb-1">
                  FEATURED HALL OF FAMER
                </span>
                <h2 className="font-headline-lg text-3xl sm:text-4xl text-primary font-bold tracking-tight">
                  {FEATURED_MENTOR.name}
                </h2>
                <p className="font-headline-md text-lg sm:text-xl text-outline mt-1">
                  {FEATURED_MENTOR.title}
                </p>
              </div>

              {/* Stats Ribbon */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 bg-surface-container rounded-2xl p-4 border border-surface-container-high/60">
                <div className="flex flex-col items-center justify-center p-2 text-center">
                  <span className="font-stats-number text-2xl sm:text-3xl text-primary font-extrabold">
                    {FEATURED_MENTOR.totalPurses}
                  </span>
                  <span className="font-label-caps text-[10px] sm:text-xs text-outline uppercase mt-1">
                    Career Purses
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 text-center border-x border-outline-variant/40">
                  <span className="font-stats-number text-2xl sm:text-3xl text-secondary font-extrabold">
                    {FEATURED_MENTOR.menteesCount}
                  </span>
                  <span className="font-label-caps text-[10px] sm:text-xs text-outline uppercase mt-1">
                    Jockeys Mentored
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 text-center">
                  <div className="flex items-center gap-1">
                    <span className="font-stats-number text-2xl sm:text-3xl text-tertiary-container font-extrabold">
                      {FEATURED_MENTOR.winRate}%
                    </span>
                  </div>
                  <span className="font-label-caps text-[10px] sm:text-xs text-outline uppercase mt-1">
                    Win Rate
                  </span>
                </div>
              </div>

              {/* Bio & Quote */}
              <div className="space-y-3">
                <p className="font-body-md text-on-surface-variant leading-relaxed">
                  {FEATURED_MENTOR.bio}
                </p>
                {FEATURED_MENTOR.quote && (
                  <blockquote className="border-l-4 border-tertiary-fixed pl-4 py-1 italic font-body-md text-primary font-medium bg-tertiary-fixed/10 rounded-r-xl">
                    {FEATURED_MENTOR.quote}
                  </blockquote>
                )}
              </div>

              {/* Specialties Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                {FEATURED_MENTOR.specialties.map((spec) => (
                  <span
                    key={spec}
                    className="px-3 py-1 bg-surface-container-high rounded-full font-label-caps text-xs text-primary uppercase font-medium"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => onRequestMentorship(FEATURED_MENTOR)}
                  className="flex-1 bg-primary text-white py-3.5 px-6 rounded-xl font-label-caps text-xs uppercase tracking-wider hover:bg-primary-container transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer font-bold"
                >
                  <span className="material-symbols-outlined text-sm">handshake</span>
                  Request 1-on-1 Mentorship
                </button>
                <button
                  onClick={() => onSelectMentor(FEATURED_MENTOR)}
                  className="px-6 py-3.5 rounded-xl border border-outline-variant text-primary font-label-caps text-xs uppercase tracking-wider hover:bg-surface-container transition-all flex items-center justify-center gap-2 cursor-pointer font-bold"
                >
                  <span className="material-symbols-outlined text-sm">person</span>
                  View Full Legacy File
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* The Sustainability Loop: Interactive Graphic */}
        <section className="bg-primary text-on-primary rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-container via-primary to-primary opacity-80 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
            <span className="font-label-caps text-xs uppercase text-tertiary-fixed tracking-widest mb-2 font-bold">
              THE SUSTAINABILITY LOOP
            </span>
            <h2 className="font-headline-lg text-3xl sm:text-4xl text-white font-bold tracking-tight">
              From Champion Jockey to Master Trainer
            </h2>
            <p className="font-body-md text-white/70 mt-3">
              The Derby is not just a seasonal sprint. It is a virtuous cycle where champions pay
              their success forward, elevating the entire Greater Los Angeles real estate ecosystem.
            </p>
          </div>

          {/* Interactive Orbiting Cycle Visual */}
          <div
            className="relative z-10 max-w-4xl mx-auto py-8"
            onMouseEnter={() => setOrbitPaused(true)}
            onMouseLeave={() => setOrbitPaused(false)}
          >
            {/* Desktop 3-Step Flow */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connector line on desktop */}
              <div className="hidden md:block absolute top-1/2 left-16 right-16 h-0.5 border-t-2 border-dashed border-white/20 -translate-y-6 z-0"></div>

              {/* Step 1 */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center relative z-10 hover:bg-white/10 transition-all group">
                <div className="w-14 h-14 rounded-full bg-tertiary-fixed text-primary flex items-center justify-center font-stats-number text-xl font-black mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  1
                </div>
                <h3 className="font-headline-md text-lg text-white font-bold mb-2">
                  Prove Your Paddock Grit
                </h3>
                <p className="font-body-sm text-white/70 text-xs leading-relaxed">
                  Log handwritten notes, close transactions, and earn verified points on the track as an
                  active jockey.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center relative z-10 hover:bg-white/10 transition-all group">
                <div className="w-14 h-14 rounded-full bg-derby-red text-white flex items-center justify-center font-stats-number text-xl font-black mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  2
                </div>
                <h3 className="font-headline-md text-lg text-white font-bold mb-2">
                  Cross the Winner's Circle
                </h3>
                <p className="font-body-sm text-white/70 text-xs leading-relaxed">
                  Achieve Triple Crown or Champion status, earning your place in the GLAR Hall of Fame.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center relative z-10 hover:bg-white/10 transition-all group">
                <div className="w-14 h-14 rounded-full bg-secondary text-white flex items-center justify-center font-stats-number text-xl font-black mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  3
                </div>
                <h3 className="font-headline-md text-lg text-white font-bold mb-2">
                  Return as Master Trainer
                </h3>
                <p className="font-body-sm text-white/70 text-xs leading-relaxed">
                  Take the reins to mentor upcoming rookies, preserving the prestige and standards of the
                  stable.
                </p>
              </div>
            </div>

            {/* Orbiting Carousel Badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <span className="text-xs text-white/60 font-label-caps uppercase tracking-wider mr-2">
                Active Master Trainers:
              </span>
              {PADDOCK_LEGENDS.map((legend) => (
                <button
                  key={legend.id}
                  onClick={() => onSelectMentor(legend)}
                  className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-full transition-all cursor-pointer group"
                >
                  <img
                    className="w-7 h-7 rounded-full object-cover border border-tertiary-fixed"
                    src={legend.imageUrl}
                    alt={legend.name}
                  />
                  <span className="text-xs font-bold text-white group-hover:text-tertiary-fixed transition-colors">
                    {legend.name}
                  </span>
                  <span className="text-[10px] text-white/50 bg-white/10 px-1.5 py-0.5 rounded">
                    {legend.seasonYear}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* The Paddock Legends: Roster Grid */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="font-label-caps text-xs text-derby-red uppercase tracking-widest font-bold">
                CHAMPIONS DIRECTORY
              </span>
              <h2 className="font-headline-lg text-2xl sm:text-3xl text-primary font-bold">
                The Paddock Legends
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 bg-surface-container p-1 rounded-xl">
              {['All Seasons', '2023 Season', '2022 Season', '2021 Season'].map((pill) => (
                <button
                  key={pill}
                  onClick={() => setFilterSeason(pill)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-label-caps uppercase transition-all cursor-pointer ${
                    filterSeason === pill
                      ? 'bg-primary text-white shadow-sm font-bold'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'
                  }`}
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredLegends.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-surface-container-high/60 flex flex-col group"
              >
                <div className="relative rounded-xl overflow-hidden aspect-[4/4] mb-4 bg-surface-container">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={mentor.imageUrl}
                    alt={mentor.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>
                  <span className="absolute bottom-3 left-3 bg-white/90 text-primary px-2.5 py-1 rounded-md text-[11px] font-label-caps font-bold">
                    {mentor.seasonBadge}
                  </span>
                </div>

                <div className="flex-1 flex flex-col">
                  <h3 className="font-headline-md text-lg text-primary font-bold">{mentor.name}</h3>
                  <p className="font-body-sm text-xs text-outline mt-0.5">{mentor.title}</p>
                  <p className="font-body-sm text-xs text-on-surface-variant mt-2 line-clamp-3 leading-relaxed">
                    {mentor.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {mentor.specialties.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] bg-surface-container px-2 py-0.5 rounded font-label-caps uppercase text-outline"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-4 border-t border-surface-container flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs font-bold text-secondary">
                      <span className="material-symbols-outlined text-sm">award_star</span>
                      <span>{mentor.winRate}% Win Rate</span>
                    </div>
                    <button
                      onClick={() => onSelectMentor(mentor)}
                      className="text-xs font-label-caps uppercase text-primary hover:text-derby-red font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Profile</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Join the Roster Card */}
            <div className="bg-surface-container-low rounded-2xl p-6 border-2 border-dashed border-outline-variant flex flex-col items-center justify-center text-center group hover:border-primary hover:bg-surface-container transition-all cursor-pointer">
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">person_add</span>
              </div>
              <h3 className="font-headline-md text-lg text-primary font-bold">Join the Roster</h3>
              <p className="font-body-sm text-xs text-on-surface-variant mt-2 max-w-[200px] leading-relaxed">
                Are you a top GLAR producer ready to guide jockeys to the finish line?
              </p>
              <button
                onClick={() =>
                  alert('Thank you for your interest! The 2025 Master Trainer application window opens in November.')
                }
                className="mt-5 px-4 py-2 bg-primary text-white rounded-xl text-xs font-label-caps uppercase font-bold hover:bg-primary-container transition-colors shadow-sm"
              >
                Apply as Mentor
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
