import React, { useState } from 'react';
import { Mentor, ChatMessage, Jockey } from '../../types';
import { ELEANOR_VANCE_MENTOR, INITIAL_CHAT } from '../../data/mockData';

interface TrainerConnectViewProps {
  currentUser: Jockey;
  onOpenScheduleModal: () => void;
}

export const TrainerConnectView: React.FC<TrainerConnectViewProps> = ({
  currentUser,
  onOpenScheduleModal,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [inputText, setInputText] = useState('');
  const [checklist, setChecklist] = useState([
    { id: 'c1', text: 'Complete GLAR Ethics & Compliance seminar', done: true },
    { id: 'c2', text: 'Send 5 personalized handwritten notes to prospective buyers', done: false },
    { id: 'c3', text: 'Shadow Eleanor Vance during Brentwood luxury open house', done: false },
    { id: 'c4', text: 'Submit Comparative Market Analysis for Pacific Palisades listing', done: true },
  ]);

  const mentor = ELEANOR_VANCE_MENTOR;

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Mentor automatic reply simulation
    setTimeout(() => {
      let mentorReply = "Great update, Harrington! Keep this momentum through the starting gate.";
      const lower = text.toLowerCase();
      if (lower.includes('note') || lower.includes('handwritten')) {
        mentorReply = "Terrific. Handwritten notes have a 4x response rate in luxury neighborhoods. Make sure to log the activity!";
      } else if (lower.includes('escrow') || lower.includes('closing')) {
        mentorReply = "Congratulations! Submit the verification documents via 'New Stake' and I'll approve it right away.";
      } else if (lower.includes('listing') || lower.includes('presentation')) {
        mentorReply = "I have a proven slide deck template in our stable drive. Let's review it during our next scheduled 1-on-1.";
      }

      const replyMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: 'mentor',
        text: mentorReply,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 900);
  };

  const toggleCheck = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  return (
    <div className="flex flex-col w-full relative pb-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-margin-desktop py-10 lg:py-12 flex flex-col gap-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-surface-container-high/80 pb-6">
          <div>
            <span className="font-label-caps text-xs text-derby-red uppercase tracking-widest font-bold">
              1-ON-1 MENTORSHIP PADDOCK
            </span>
            <h1 className="font-display-xl text-3xl sm:text-4xl text-primary font-bold tracking-tight">
              Trainer Connect
            </h1>
          </div>
          <button
            onClick={onOpenScheduleModal}
            className="bg-primary hover:bg-primary-container text-white px-5 py-2.5 rounded-xl font-label-caps text-xs uppercase font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">calendar_month</span>
            Book Strategy Session
          </button>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Interactive Chat (Span 7) */}
          <div className="lg:col-span-7 flex flex-col bg-white rounded-3xl shadow-sm border border-surface-container-high/70 h-[640px] overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 sm:p-5 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    className="w-12 h-12 rounded-full object-cover border-2 border-tertiary-fixed"
                    src={mentor.imageUrl}
                    alt={mentor.name}
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-white"></span>
                </div>
                <div>
                  <h3 className="font-headline-md text-base text-primary font-bold">{mentor.name}</h3>
                  <p className="font-body-sm text-xs text-secondary font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Online • Active Trainer
                  </p>
                </div>
              </div>
              <span className="bg-primary/5 text-primary px-3 py-1 rounded-full text-xs font-label-caps uppercase font-bold">
                {mentor.seasonBadge}
              </span>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 custom-scrollbar bg-surface-container-lowest/50">
              {messages.map((msg) => {
                const isMe = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm font-body-sm ${
                        isMe
                          ? 'bg-primary text-white rounded-br-none shadow-sm'
                          : 'bg-surface-container text-on-surface rounded-bl-none border border-surface-container-high'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-outline mt-1 px-1">{msg.timestamp}</span>
                  </div>
                );
              })}
            </div>

            {/* Suggested Quick Replies */}
            <div className="px-4 py-2 bg-surface-container-low/60 border-t border-surface-container flex gap-2 overflow-x-auto custom-scrollbar">
              {[
                'Review my handwritten notes progress',
                'Question about Q2 listing threshold',
                'Need advice on upcoming luxury open house',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSendMessage(suggestion)}
                  className="px-3 py-1 bg-white hover:bg-surface-container text-xs text-on-surface-variant rounded-full border border-surface-container-high whitespace-nowrap cursor-pointer transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white border-t border-surface-container flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask Eleanor for coaching advice..."
                className="flex-1 px-4 py-2.5 bg-surface-container rounded-xl text-sm font-body-sm text-primary placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="w-10 h-10 rounded-xl bg-derby-red text-white flex items-center justify-center hover:bg-derby-red/90 disabled:opacity-40 transition-all cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-lg">send</span>
              </button>
            </form>
          </div>

          {/* Right Column: Mentor Profile & Action Items (Span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Trainer Profile Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-surface-container-high/70 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <img
                  className="w-16 h-16 rounded-2xl object-cover shadow-md border-2 border-tertiary-fixed"
                  src={mentor.imageUrl}
                  alt={mentor.name}
                />
                <div>
                  <h3 className="font-headline-md text-xl text-primary font-bold">{mentor.name}</h3>
                  <p className="font-body-sm text-xs text-outline">{mentor.title}</p>
                  <p className="font-label-caps text-xs text-secondary font-bold mt-1">
                    {mentor.menteesCount} Active Mentees
                  </p>
                </div>
              </div>

              <p className="font-body-sm text-sm text-on-surface-variant leading-relaxed">
                {mentor.bio}
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {mentor.specialties.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 bg-surface-container rounded-md text-[11px] font-label-caps uppercase text-primary font-semibold"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Assigned Action Items Checklist */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-surface-container-high/70 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-headline-md text-lg text-primary font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary-container">
                    checklist
                  </span>
                  Assigned Action Items
                </h3>
                <span className="text-xs font-label-caps text-outline uppercase">
                  {checklist.filter((c) => c.done).length} / {checklist.length} Completed
                </span>
              </div>

              <div className="space-y-2.5">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-container cursor-pointer transition-colors border border-surface-container-high/40"
                  >
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 transition-all ${
                        item.done
                          ? 'bg-secondary border-secondary text-white'
                          : 'border-outline-variant bg-white'
                      }`}
                    >
                      {item.done && (
                        <span className="material-symbols-outlined text-sm font-bold">check</span>
                      )}
                    </div>
                    <span
                      className={`text-sm font-body-sm leading-snug ${
                        item.done ? 'line-through text-outline' : 'text-on-surface'
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
