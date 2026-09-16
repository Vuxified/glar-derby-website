import React from 'react';
import { TabType, Jockey } from '../types';
import { LOGO_URL } from '../data/mockData';

interface NavigationSidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  currentUser: Jockey;
  onOpenProfile: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  onOpenProfile,
  mobileOpen,
  onCloseMobile,
}) => {
  const navItems: { id: TabType; label: string; icon: string }[] = [
    { id: 'track-tracker', label: 'Track Tracker', icon: 'speed' },
    { id: 'the-paddock', label: 'The Paddock', icon: 'edit_note' },
    { id: 'the-stable', label: 'The Stable', icon: 'leaderboard' },
    { id: 'trainer-connect', label: 'Trainer Connect', icon: 'chat' },
    { id: 'hall-of-fame', label: 'Hall of Fame', icon: 'military_tech' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-primary text-on-primary z-50 flex flex-col shadow-2xl transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header / Brand */}
        <div className="flex items-center justify-between px-8 py-10 border-b border-white/10">
          <button
            onClick={() => {
              onSelectTab('track-tracker');
              onCloseMobile();
            }}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
          >
            <img
              alt="Road to the Derby Logo"
              className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
              src={LOGO_URL}
            />
            <span className="font-headline-md text-headline-md tracking-tight text-white group-hover:text-primary-fixed transition-colors">
              GLAR Derby
            </span>
          </button>
          <button
            onClick={onCloseMobile}
            className="lg:hidden text-white/70 hover:text-white p-1 rounded-lg"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all group font-label-caps text-label-caps tracking-wider cursor-pointer ${
                  isActive
                    ? 'bg-derby-red text-white shadow-lg'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined mr-4 text-xl">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User profile widget at bottom */}
        <div className="px-6 py-6 border-t border-white/10">
          <button
            onClick={onOpenProfile}
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all text-left group"
          >
            <div className="relative">
              <img
                alt={currentUser.name}
                className="w-10 h-10 rounded-full border-2 border-tertiary-fixed shadow-md object-cover group-hover:scale-105 transition-transform"
                src={currentUser.avatar}
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-secondary rounded-full border-2 border-primary" />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-bold text-white truncate group-hover:text-tertiary-fixed transition-colors">
                {currentUser.name}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase tracking-widest text-white/60">
                  {currentUser.role}
                </span>
                <span className="text-[10px] text-tertiary-fixed font-bold">
                  • {currentUser.points} PTS
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-white/40 text-sm group-hover:text-white group-hover:translate-x-0.5 transition-all">
              chevron_right
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};
