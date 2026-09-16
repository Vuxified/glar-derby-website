import React, { useState, useRef, useEffect } from 'react';

interface RaceHeaderProps {
  onOpenNewStake: () => void;
  onOpenMobileNav: () => void;
  unreadCount?: number;
}

export const RaceHeader: React.FC<RaceHeaderProps> = ({
  onOpenNewStake,
  onOpenMobileNav,
  unreadCount = 2,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activeUnread, setActiveUnread] = useState(unreadCount);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const alerts = [
    {
      id: 'a1',
      title: 'Point Submission Approved!',
      desc: 'Your handwritten note batch (+10 PTS) was verified by Eleanor Vance.',
      time: '15m ago',
      unread: true,
      icon: 'check_circle',
      color: 'text-secondary',
    },
    {
      id: 'a2',
      title: 'Stable Standings Update',
      desc: 'Apex Partners gained 850 PTS. Your stable is currently ranked #2.',
      time: '1h ago',
      unread: true,
      icon: 'military_tech',
      color: 'text-tertiary-container',
    },
    {
      id: 'a3',
      title: 'Quarter 1 Starting Gate',
      desc: '14 days remaining before the Education Classic cutoff.',
      time: '3h ago',
      unread: false,
      icon: 'flag',
      color: 'text-sky-blue',
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenAlerts = () => {
    setNotificationsOpen(!notificationsOpen);
    if (!notificationsOpen) {
      setActiveUnread(0);
    }
  };

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 sm:h-20 bg-surface/95 backdrop-blur-md z-40 px-3 sm:px-6 lg:px-8 flex items-center justify-between border-b border-surface-container-high/60 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Left side */}
      <div className="flex items-center gap-2 sm:gap-3 text-on-surface-variant min-w-0 flex-1 mr-2">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-1.5 -ml-1 rounded-lg text-primary hover:bg-surface-container shrink-0 cursor-pointer"
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>

        <span className="material-symbols-outlined text-xl sm:text-2xl text-primary shrink-0 hidden sm:inline-block">stadium</span>
        <div className="h-4 w-[1px] bg-outline-variant hidden sm:block"></div>
        <span className="font-headline-md text-sm sm:text-base lg:text-headline-md text-primary uppercase tracking-tight font-bold truncate">
          Race Operations
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleOpenAlerts}
            className="relative p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container cursor-pointer shrink-0"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-xl sm:text-2xl">notifications</span>
            {activeUnread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-derby-red rounded-full ring-2 ring-white animate-pulse"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-[calc(100vw-1.5rem)] sm:w-96 max-w-sm bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container-high py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between px-5 py-2 border-b border-surface-container">
                <span className="font-headline-md text-sm text-primary">Racetrack Bulletins</span>
                <span className="font-label-caps text-[10px] text-outline uppercase">3 items</span>
              </div>
              <div className="divide-y divide-surface-container max-h-80 overflow-y-auto custom-scrollbar">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`px-5 py-3 hover:bg-surface-container-low transition-colors flex gap-3 items-start ${
                      alert.unread ? 'bg-surface-container/30' : ''
                    }`}
                  >
                    <span className={`material-symbols-outlined text-xl shrink-0 mt-0.5 ${alert.color}`}>
                      {alert.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-headline-md text-xs font-bold text-primary">{alert.title}</p>
                        <span className="text-[10px] text-outline">{alert.time}</span>
                      </div>
                      <p className="font-body-sm text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                        {alert.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-5 py-2 border-t border-surface-container text-center">
                <span className="text-xs text-derby-red font-label-caps uppercase tracking-wider cursor-pointer hover:underline">
                  Clear all alerts
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 sm:h-8 w-[1px] bg-outline-variant hidden sm:block"></div>

        {/* New Stake Action Button */}
        <button
          onClick={onOpenNewStake}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2.5 bg-primary text-on-primary rounded-xl font-label-caps text-[11px] sm:text-xs hover:bg-primary-container transition-all shadow-md active:scale-95 cursor-pointer hover:shadow-lg shrink-0 whitespace-nowrap font-bold"
        >
          <span className="material-symbols-outlined text-sm sm:text-base font-bold">add</span>
          <span>NEW STAKE</span>
        </button>
      </div>
    </header>
  );
};
