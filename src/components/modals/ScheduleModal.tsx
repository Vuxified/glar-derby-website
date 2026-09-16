import React, { useState } from 'react';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBook: (details: { date: string; time: string; topic: string }) => void;
  mentorName: string;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  onBook,
  mentorName,
}) => {
  const [selectedDate, setSelectedDate] = useState('Tomorrow, 2:00 PM');
  const [topic, setTopic] = useState('Escrow & Disclosure Review');

  if (!isOpen) return null;

  const slots = [
    'Tomorrow, 2:00 PM',
    'Thursday, 10:30 AM',
    'Friday, 4:00 PM',
    'Next Monday, 11:00 AM',
  ];

  const topics = [
    'Escrow & Disclosure Review',
    'Luxury Listing Pitch Practice',
    'Quarterly Points Strategy (Reaching Q2)',
    'Client Negotiation Tactics',
  ];

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const parts = selectedDate.split(', ');
    onBook({
      date: parts[0] || 'Tomorrow',
      time: parts[1] || '2:00 PM',
      topic,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-surface-container-high relative overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-surface-container">
          <div>
            <span className="font-label-caps text-xs text-derby-red uppercase tracking-widest font-bold">
              1-ON-1 STRATEGY
            </span>
            <h2 className="font-headline-md text-xl text-primary font-bold">
              Schedule with {mentorName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleConfirm} className="mt-6 flex flex-col gap-5">
          <div>
            <label className="block text-xs font-label-caps uppercase text-outline mb-2 font-bold">
              Select Available Time Slot
            </label>
            <div className="space-y-2">
              {slots.map((slot) => (
                <div
                  key={slot}
                  onClick={() => setSelectedDate(slot)}
                  className={`p-3 rounded-xl border text-sm font-body-sm flex items-center justify-between cursor-pointer transition-all ${
                    selectedDate === slot
                      ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm'
                      : 'border-surface-container-high hover:bg-surface-container text-on-surface-variant'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    {slot}
                  </span>
                  {selectedDate === slot && (
                    <span className="material-symbols-outlined text-sm text-primary">
                      check_circle
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-label-caps uppercase text-outline mb-2 font-bold">
              Strategy Focus / Topic
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-3 rounded-xl border border-surface-container-high text-sm font-body-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {topics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-surface-container-high font-label-caps text-xs uppercase text-on-surface-variant hover:bg-surface-container transition-colors font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-container text-white font-label-caps text-xs uppercase font-bold shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
