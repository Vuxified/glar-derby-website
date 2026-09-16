import React from 'react';
import { FEATURED_MENTOR } from '../../data/mockData';

interface SpeechModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpeechModal: React.FC<SpeechModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-finish-line-black text-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-white/10 relative overflow-hidden animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer z-10"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        <div className="flex items-center gap-2 mb-4">
          <span className="w-2.5 h-2.5 rounded-full bg-derby-red animate-ping"></span>
          <span className="font-label-caps text-xs text-tertiary-fixed uppercase tracking-widest font-bold">
            ARCHIVE REPLAY • 2023 INDUCTION CEREMONY
          </span>
        </div>

        <h2 className="font-headline-lg text-2xl text-white font-bold mb-4">
          Elena Rostova: "The Power of the Collective Stable"
        </h2>

        {/* Video Player Mockup Container */}
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-primary/40 border border-white/20 mb-6 group flex items-center justify-center">
          <img
            className="w-full h-full object-cover opacity-60 filter brightness-75"
            src={FEATURED_MENTOR.imageUrl}
            alt="Elena Rostova Induction"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-finish-line-black via-transparent to-transparent"></div>

          {/* Glowing Play Icon */}
          <div className="relative z-10 w-20 h-20 rounded-full bg-derby-red/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform cursor-pointer">
            <span className="material-symbols-outlined text-4xl ml-1">play_arrow</span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-xs font-label-caps text-white/80">
            <span>Duration: 04:32</span>
            <span>Recorded at The Beverly Hills Hotel Grand Ballroom</span>
          </div>
        </div>

        {/* Quote Transcript Highlight */}
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-sm font-body-md text-white/80 leading-relaxed italic">
          "When you run on this track, individual talent gets you out of the starting gate. But
          stamina, grit, and the guidance of those who ran the dirt before you are what carry you
          across the Winner's Circle."
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white text-primary rounded-xl text-xs font-label-caps uppercase font-bold hover:bg-white/90 transition-colors cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
