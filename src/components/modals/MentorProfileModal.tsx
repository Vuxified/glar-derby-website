import React from 'react';
import { Mentor } from '../../types';

interface MentorProfileModalProps {
  mentor: Mentor | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestMentorship: (mentor: Mentor) => void;
  onSendMessage: (mentor: Mentor) => void;
}

export const MentorProfileModal: React.FC<MentorProfileModalProps> = ({
  mentor,
  isOpen,
  onClose,
  onRequestMentorship,
  onSendMessage,
}) => {
  if (!isOpen || !mentor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-surface-container-high relative overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-surface-container hover:bg-surface-container-high text-outline hover:text-primary transition-colors z-20 cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        {/* Header Hero */}
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start pb-6 border-b border-surface-container">
          <div className="relative">
            <img
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-xl border-2 border-tertiary-fixed"
              src={mentor.imageUrl}
              alt={mentor.name}
            />
            <span className="absolute -bottom-2 -right-2 bg-secondary text-white px-2 py-0.5 rounded-full text-[10px] font-label-caps font-bold">
              VERIFIED
            </span>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <span className="bg-tertiary-fixed/30 text-tertiary px-3 py-1 rounded-full text-xs font-label-caps uppercase font-bold inline-block mb-2">
              {mentor.seasonBadge}
            </span>
            <h2 className="font-headline-lg text-2xl sm:text-3xl text-primary font-bold">
              {mentor.name}
            </h2>
            <p className="font-body-md text-sm text-outline mt-1">{mentor.title}</p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-3">
              {mentor.specialties.map((s) => (
                <span
                  key={s}
                  className="bg-surface-container text-on-surface-variant px-2.5 py-0.5 rounded-md text-xs font-label-caps uppercase"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 my-6 bg-surface-container-low p-4 rounded-2xl border border-surface-container-high/60 text-center">
          <div>
            <span className="font-stats-number text-2xl text-primary font-black">
              {mentor.totalPurses || '$3.5M+'}
            </span>
            <p className="font-label-caps text-[10px] text-outline uppercase mt-1">Purses Won</p>
          </div>
          <div className="border-x border-surface-container-high">
            <span className="font-stats-number text-2xl text-secondary font-black">
              {mentor.menteesCount || 12}
            </span>
            <p className="font-label-caps text-[10px] text-outline uppercase mt-1">Mentees Guided</p>
          </div>
          <div>
            <span className="font-stats-number text-2xl text-tertiary-container font-black">
              {mentor.winRate}%
            </span>
            <p className="font-label-caps text-[10px] text-outline uppercase mt-1">Win Rate</p>
          </div>
        </div>

        {/* Biography */}
        <div className="space-y-4">
          <h3 className="font-headline-md text-base text-primary font-bold">Hall of Fame Record</h3>
          <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
            {mentor.bio}
          </p>

          {mentor.quote && (
            <blockquote className="border-l-4 border-tertiary-fixed pl-4 py-2 italic font-body-md text-primary bg-tertiary-fixed/10 rounded-r-xl text-sm">
              {mentor.quote}
            </blockquote>
          )}
        </div>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 pt-4 border-t border-surface-container">
          <button
            onClick={() => {
              onRequestMentorship(mentor);
              onClose();
            }}
            className="flex-1 py-3.5 bg-primary hover:bg-primary-container text-white rounded-xl font-label-caps text-xs uppercase font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">handshake</span>
            Request Mentorship Pairing
          </button>
          <button
            onClick={() => {
              onSendMessage(mentor);
              onClose();
            }}
            className="px-6 py-3.5 border border-outline-variant hover:bg-surface-container text-primary rounded-xl font-label-caps text-xs uppercase font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">chat</span>
            Send Inquiry
          </button>
        </div>
      </div>
    </div>
  );
};
