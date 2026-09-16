import React, { useState, useRef } from 'react';
import { SubmissionItem } from '../../types';

interface NewStakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (submission: Omit<SubmissionItem, 'id' | 'status' | 'timeAgo'>) => void;
  jockeyName: string;
  jockeyAvatar?: string;
}

export const NewStakeModal: React.FC<NewStakeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  jockeyName,
  jockeyAvatar,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Education' | 'Production' | 'Networking' | 'Mentorship'>('Education');
  const [points, setPoints] = useState<number>(20);
  const [note, setNote] = useState('');
  const [mlsNumber, setMlsNumber] = useState('');
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const tier: 'Tier 1' | 'Tier 2' | 'Tier 3' =
    points >= 50 ? 'Tier 3' : points >= 20 ? 'Tier 2' : 'Tier 1';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      jockeyName,
      jockeyAvatar,
      title: title.trim(),
      points: Number(points) || 10,
      verificationTier: tier,
      proofType: attachedFile ? 'file' : mlsNumber ? 'mls' : 'honor',
      proofFileName: attachedFile?.name,
      proofFileSize: attachedFile?.size,
      mlsNumber: mlsNumber.trim() || undefined,
      note: note.trim() ? note.trim() : undefined,
    });

    setTitle('');
    setNote('');
    setMlsNumber('');
    setAttachedFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-surface-container-high relative overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between pb-4 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-derby-red"></span>
            <div>
              <span className="text-[10px] font-label-caps uppercase tracking-wider text-outline font-bold block">
                Race Stewards Submission
              </span>
              <h2 className="font-headline-md text-xl text-primary font-bold">
                Submit New Race Stake
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-label-caps uppercase text-outline mb-1.5 font-bold">
              Stake Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Education', 'Production', 'Networking', 'Mentorship'] as const).map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-3 rounded-xl text-xs font-label-caps uppercase transition-all cursor-pointer ${
                    category === cat
                      ? 'bg-primary text-white shadow-sm font-bold'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-label-caps uppercase text-outline mb-1.5 font-bold">
              Activity Title / Milestone
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Attended Beverly Hills Broker Caravan"
              className="w-full px-4 py-2.5 rounded-xl border border-surface-container-high text-xs font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-label-caps uppercase text-outline font-bold">
                Point Value Claimed (+PTS)
              </label>
              <span className="text-[10px] font-label-caps font-bold text-secondary">
                {tier} Requirement
              </span>
            </div>
            <div className="flex items-center gap-2">
              {[10, 20, 50, 100].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setPoints(val)}
                  className={`flex-1 py-2 rounded-xl text-xs font-label-caps font-bold transition-all cursor-pointer ${
                    points === val
                      ? 'bg-secondary text-white shadow-sm'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  +{val} PTS
                </button>
              ))}
            </div>
          </div>

          {/* File upload & MLS details */}
          <div>
            <label className="block text-xs font-label-caps uppercase text-outline mb-1 font-bold">
              Proof Document or Receipt (Optional)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const f = e.target.files[0];
                  setAttachedFile({
                    name: f.name,
                    size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
                  });
                }
              }}
              className="hidden"
            />

            {!attachedFile ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2 px-3 rounded-xl border border-dashed border-surface-container-high hover:border-primary text-xs font-body-sm text-outline flex items-center justify-center gap-1.5 cursor-pointer bg-surface-container-low"
                >
                  <span className="material-symbols-outlined text-base text-primary">cloud_upload</span>
                  Upload File / PDF
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setAttachedFile({ name: 'Caravan_Proof_Sheet.pdf', size: '1.2 MB' })
                  }
                  className="px-3 py-2 rounded-xl bg-surface-container text-[10px] font-label-caps text-primary cursor-pointer hover:bg-surface-container-high"
                >
                  + Sample PDF
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center justify-between">
                <span className="text-xs font-medium text-primary flex items-center gap-1.5 truncate">
                  <span className="material-symbols-outlined text-sm text-secondary">attachment</span>
                  {attachedFile.name} ({attachedFile.size})
                </span>
                <button
                  type="button"
                  onClick={() => setAttachedFile(null)}
                  className="text-outline hover:text-derby-red"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>
            )}
          </div>

          {/* MLS Number */}
          {points >= 20 && (
            <div>
              <label className="block text-xs font-label-caps uppercase text-outline mb-1 font-bold">
                MLS # or Event Registration Code
              </label>
              <input
                type="text"
                value={mlsNumber}
                onChange={(e) => setMlsNumber(e.target.value)}
                placeholder="e.g. MLS #24-91823"
                className="w-full px-3.5 py-2 rounded-xl border border-surface-container-high text-xs font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-label-caps uppercase text-outline mb-1 font-bold">
              Verification Note / Attestation
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Provide context for the Stewards & Mentor..."
              className="w-full px-3.5 py-2 rounded-xl border border-surface-container-high text-xs font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            ></textarea>
          </div>

          <div className="pt-2 flex gap-3">
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
              Submit to Stewards Queue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
