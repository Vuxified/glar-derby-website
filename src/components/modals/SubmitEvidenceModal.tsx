import React, { useState, useRef } from 'react';
import { ActivityTask, SubmissionItem } from '../../types';

interface SubmitEvidenceModalProps {
  task: ActivityTask | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (submission: Omit<SubmissionItem, 'id' | 'status' | 'timeAgo'>, autoApprove?: boolean) => void;
  jockeyName: string;
  jockeyAvatar?: string;
}

export const SubmitEvidenceModal: React.FC<SubmitEvidenceModalProps> = ({
  task,
  isOpen,
  onClose,
  onSubmit,
  jockeyName,
  jockeyAvatar,
}) => {
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
    preview?: string;
  } | null>(null);
  const [mlsNumber, setMlsNumber] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [autoApprove, setAutoApprove] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !task) return null;

  // Determine verification tier based on task points / category
  const tier: 'Tier 1' | 'Tier 2' | 'Tier 3' =
    task.verificationTier ||
    (task.points >= 50 ? 'Tier 3' : task.points >= 20 ? 'Tier 2' : 'Tier 1');

  const handleFileSelect = (file: File) => {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    const isImage = file.type.startsWith('image/');
    setSelectedFile({
      name: file.name,
      size: `${sizeMb} MB`,
      preview: isImage ? URL.createObjectURL(file) : undefined,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUsePreset = (presetName: string, presetSize: string) => {
    setSelectedFile({
      name: presetName,
      size: presetSize,
      preview: undefined,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Compile note with MLS / Address if present
    const noteSegments: string[] = [];
    if (mlsNumber) noteSegments.push(`MLS #${mlsNumber}`);
    if (propertyAddress) noteSegments.push(propertyAddress);
    if (notes) noteSegments.push(notes);

    onSubmit(
      {
        jockeyName,
        jockeyAvatar,
        title: task.title,
        points: task.points,
        verificationTier: tier,
        proofType: selectedFile ? 'file' : mlsNumber ? 'mls' : 'honor',
        proofFileName: selectedFile?.name,
        proofFileSize: selectedFile?.size,
        mlsNumber: mlsNumber || undefined,
        note: noteSegments.length > 0 ? noteSegments.join(' • ') : undefined,
      },
      autoApprove
    );

    // Reset state
    setSelectedFile(null);
    setMlsNumber('');
    setPropertyAddress('');
    setNotes('');
    setAutoApprove(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-surface-container-high relative overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-derby-red animate-pulse"></span>
            <div>
              <span className="text-[10px] font-label-caps uppercase tracking-wider text-outline font-bold block">
                Proof of Verification
              </span>
              <h2 className="font-headline-md text-xl text-primary font-bold">
                Submit Activity Evidence
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

        {/* Task Summary Banner */}
        <div className="mt-4 p-4 rounded-2xl bg-surface-container-low border border-surface-container-high flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-xl">
                {task.category === 'Education'
                  ? 'school'
                  : task.category === 'Production'
                  ? 'real_estate_agent'
                  : task.category === 'Networking'
                  ? 'groups'
                  : 'handshake'}
              </span>
            </div>
            <div>
              <h3 className="font-headline-md text-sm text-primary font-bold">{task.title}</h3>
              <p className="font-body-sm text-xs text-outline">{task.category} Milestone</p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-stats-number text-xl text-derby-red font-black">
              +{task.points}
            </span>
            <span className="text-[10px] font-label-caps text-outline block">PTS PURSE</span>
          </div>
        </div>

        {/* Verification Tier Explanation Banner */}
        <div className="mt-4 p-3.5 rounded-xl border text-xs font-body-sm flex items-start gap-2.5 ${
          tier === 'Tier 3'
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-900'
            : tier === 'Tier 2'
            ? 'bg-secondary/10 border-secondary/30 text-secondary'
            : 'bg-surface-container border-surface-container-high text-on-surface-variant'
        }">
          <span className="material-symbols-outlined text-lg shrink-0 mt-0.5">
            {tier === 'Tier 3' ? 'verified_user' : tier === 'Tier 2' ? 'fact_check' : 'check_circle'}
          </span>
          <div className="flex-1">
            <span className="font-label-caps font-bold uppercase tracking-wide block">
              {tier}: {tier === 'Tier 3' ? 'Mandatory Production Audit' : tier === 'Tier 2' ? 'Educational / Attendance Verification' : 'Micro-Habit Honor Log'}
            </span>
            <p className="mt-0.5 opacity-90 text-[11px] leading-relaxed">
              {tier === 'Tier 3'
                ? 'High-stakes production points (50+ PTS) require an uploaded MLS closing document, settlement sheet, or contract verification reviewed by the Race Stewards.'
                : tier === 'Tier 2'
                ? 'Attach your course certificate, MLS Caravan link, or GLAR attendance receipt to credit your purse.'
                : 'Lightweight verification. You may submit an optional photo of stamped notes or write a brief confirmation note.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          {/* File Upload Area */}
          <div>
            <label className="block text-xs font-label-caps uppercase text-outline mb-2 font-bold">
              {tier === 'Tier 3' ? 'Upload Closing / Listing Document (Required)' : 'Upload Receipt or Certificate (Optional)'}
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              className="hidden"
            />

            {!selectedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                  isDragging
                    ? 'border-primary bg-primary/5 scale-[1.01]'
                    : 'border-surface-container-high hover:border-primary/50 hover:bg-surface-container-low'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-surface-container text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                </div>
                <div className="text-xs font-body-sm text-on-surface">
                  <span className="font-bold text-primary">Click to upload</span> or drag and drop
                </div>
                <p className="text-[10px] text-outline">
                  PDF, PNG, JPG, or DOCX (up to 10MB)
                </p>

                {/* Quick preset buttons for instant testing */}
                <div className="pt-2 flex flex-wrap gap-2 justify-center" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => handleUsePreset('GLAR_Ethics_Certificate_2024.pdf', '1.4 MB')}
                    className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-[10px] font-label-caps text-primary cursor-pointer transition-colors"
                  >
                    + Use Sample Certificate PDF
                  </button>
                  {tier === 'Tier 3' && (
                    <button
                      type="button"
                      onClick={() => handleUsePreset('MLS_Exclusive_Listing_Agreement.pdf', '3.8 MB')}
                      className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-[10px] font-label-caps text-primary cursor-pointer transition-colors"
                    >
                      + Use Sample MLS Agreement
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">description</span>
                  </div>
                  <div>
                    <span className="font-headline-md text-xs text-primary font-bold block truncate max-w-[200px]">
                      {selectedFile.name}
                    </span>
                    <span className="text-[10px] text-outline block">{selectedFile.size} • Attached</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="p-1 rounded-lg text-outline hover:text-derby-red hover:bg-white/60 transition-colors"
                  title="Remove attached file"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            )}
          </div>

          {/* Tier 2 & 3: MLS / Certificate Number */}
          {(tier === 'Tier 2' || tier === 'Tier 3') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-label-caps uppercase text-outline mb-1 font-bold">
                  {tier === 'Tier 3' ? 'MLS Listing #' : 'Cert / Confirmation #'}
                </label>
                <input
                  type="text"
                  value={mlsNumber}
                  onChange={(e) => setMlsNumber(e.target.value)}
                  placeholder={tier === 'Tier 3' ? 'e.g. #24-184920' : 'e.g. GLAR-8492'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-container-high text-xs font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {tier === 'Tier 3' && (
                <div>
                  <label className="block text-xs font-label-caps uppercase text-outline mb-1 font-bold">
                    Property Address
                  </label>
                  <input
                    type="text"
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                    placeholder="e.g. 742 Ocean Ave, Santa Monica"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-container-high text-xs font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              )}
            </div>
          )}

          {/* Verification Notes */}
          <div>
            <label className="block text-xs font-label-caps uppercase text-outline mb-1 font-bold">
              Verification Notes / Details
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Attended morning session with Broker caravan leader Mark..."
              className="w-full px-3.5 py-2 rounded-xl border border-surface-container-high text-xs font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            ></textarea>
          </div>

          {/* Trainer Approval Flow Toggle */}
          <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container-high flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-outline">tune</span>
              <div>
                <span className="text-xs font-bold text-primary block">Fast-Track Steward Mode</span>
                <span className="text-[10px] text-outline">Auto-approve & credit points immediately for testing</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoApprove}
              onChange={(e) => setAutoApprove(e.target.checked)}
              className="w-4 h-4 accent-secondary rounded cursor-pointer"
            />
          </div>

          {/* Action Buttons */}
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
              className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-container text-white font-label-caps text-xs uppercase font-bold shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">verified</span>
              {autoApprove ? 'Verify & Credit Points' : 'Submit for Trainer Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
