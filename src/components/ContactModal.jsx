import { useState, useEffect, useMemo } from 'react';
import { Mail, X, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import { contact } from '../data/portfolio.js';

const MAX_SUBJECT_LENGTH = 80;
const MAX_BODY_LENGTH = 650;
const SAFE_URL_BUDGET = 1800;

export default function ContactModal({ isOpen, onClose }) {
  const [selectedTemplate, setSelectedTemplate] = useState(contact.templates[0].id);
  const [selectedAvatar, setSelectedAvatar] = useState(contact.avatars[0].id);
  const [subject, setSubject] = useState(contact.templates[0].subject);
  const [body, setBody] = useState(contact.templates[0].body);
  const [copied, setCopied] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Handle template selection
  const handleSelectTemplate = (tplId) => {
    const tpl = contact.templates.find((t) => t.id === tplId);
    if (tpl) {
      setSelectedTemplate(tplId);
      setSubject(tpl.subject);
      setBody(tpl.body);
    }
  };

  // Compute active avatar stamp
  const activeAvatarObj = useMemo(
    () => contact.avatars.find((a) => a.id === selectedAvatar),
    [selectedAvatar]
  );

  // Format full email body including the optional avatar stamp
  const fullBody = useMemo(() => {
    if (!activeAvatarObj || !activeAvatarObj.stamp) {
      return body;
    }
    return `${activeAvatarObj.stamp}\n\n${body}`;
  }, [body, activeAvatarObj]);

  // Generate safe RFC 6068 mailto URI
  const mailtoUri = useMemo(() => {
    const encSubject = encodeURIComponent(subject.trim());
    const encBody = encodeURIComponent(fullBody.trim());
    return `mailto:${contact.email}?subject=${encSubject}&body=${encBody}`;
  }, [subject, fullBody]);

  // Monitor total encoded character length for mail client budget
  const encodedLength = mailtoUri.length;
  const isBudgetSafe = encodedLength <= SAFE_URL_BUDGET;
  const budgetRatio = Math.min(100, Math.round((encodedLength / SAFE_URL_BUDGET) * 100));

  // Copy whole email template to clipboard
  const handleCopy = async () => {
    const textToCopy = `To: ${contact.email}\nSubject: ${subject}\n\n${fullBody}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-mail-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-5"
    >
      {/* Dimmed Retro Backdrop */}
      <div
        className="fixed inset-0 bg-[#141512]/80 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Modal Window */}
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-[620px] flex-col border border-line bg-[#1e1f1c] shadow-[6px_6px_0_rgba(0,0,0,0.5)]">
        
        {/* Title Bar */}
        <div className="flex min-h-[44px] shrink-0 items-center justify-between border-b border-line bg-[#282924] px-3 sm:px-4">
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-pink" />
            <span id="modal-mail-title" className="font-mono text-[10.5px] sm:text-xs tracking-wide text-ink truncate">
              new_message.eml <span className="text-muted">// DISPATCH COMPOSER</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="hidden gap-1 sm:flex">
              <i className="h-2 w-2 border border-[#55564b] bg-focus" />
              <i className="h-2 w-2 border border-[#55564b] bg-focus" />
              <i className="h-2 w-2 border border-[#55564b] bg-focus" />
            </span>
            {/* Enlarged touch target (min 44x44px) */}
            <button
              onClick={onClose}
              type="button"
              aria-label="Close dialog"
              className="grid h-11 w-11 min-h-[44px] min-w-[44px] place-items-center text-muted transition-colors hover:bg-pink hover:text-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow -mr-1"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-3.5 sm:p-5">
          
          {/* Step 1: Preset Templates */}
          <div className="mb-4">
            <label className="mb-1.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted">
              <span>01. CHOOSE TEMPLATE</span>
              <span className="text-[9.5px] text-muted">PRE-FILLED TOPIC</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {contact.templates.map((tpl) => {
                const active = selectedTemplate === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleSelectTemplate(tpl.id)}
                    className={`min-h-[36px] border px-2.5 py-1.5 font-mono text-[10px] tracking-tight transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow ${
                      active
                        ? 'border-pink bg-pink/15 text-pink font-semibold'
                        : 'border-[#45463e] bg-surface text-muted hover:border-line hover:text-ink'
                    }`}
                  >
                    {tpl.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Avatar / Stamp Picker */}
          <div className="mb-4 border-t border-dashed border-[#35362e] pt-3">
            <label className="mb-1.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted">
              <span className="flex items-center gap-1.5">
                <Sparkles size={11} className="text-muted-dim" /> 02. SENDER COMPANION / STAMP (OPTIONAL)
              </span>
              <span className="text-[9.5px] text-muted">INJECTED INTO BODY</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
              {contact.avatars.map((avatar) => {
                const active = selectedAvatar === avatar.id;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar.id)}
                    className={`flex min-h-[40px] items-center gap-1.5 border px-2.5 py-2 text-left font-mono text-[10px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow ${
                      active
                        ? 'border-pink bg-pink/15 text-pink font-medium'
                        : 'border-[#3f4037] bg-[#22231e] text-muted hover:border-line hover:text-[#d6d4c5]'
                    }`}
                  >
                    <span className="text-sm">{avatar.icon}</span>
                    <span className="truncate">{avatar.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Message Editor & Constraints */}
          <div className="space-y-3.5 border-t border-[#35362e] pt-3">
            
            {/* Recipient */}
            <div>
              <div className="flex justify-between font-mono text-[10px] text-muted">
                <span>TO:</span>
                <span className="text-lime">VERIFIED INBOX</span>
              </div>
              <div className="mt-1 border border-[#3e4037] bg-[#171815] px-3 py-2 font-mono text-xs text-ink">
                {contact.email}
              </div>
            </div>

            {/* Subject */}
            <div>
              <div className="flex justify-between font-mono text-[10px]">
                <span className="text-[#cac7b6]">SUBJECT:</span>
                <span className={`font-mono text-[9.5px] ${subject.length >= MAX_SUBJECT_LENGTH ? 'text-pink' : 'text-muted'}`}>
                  {subject.length} / {MAX_SUBJECT_LENGTH}
                </span>
              </div>
              <input
                type="text"
                value={subject}
                maxLength={MAX_SUBJECT_LENGTH}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject line..."
                className="mt-1 w-full border border-line bg-[#161714] px-3 py-2 font-mono text-[16px] sm:text-sm text-ink placeholder:text-[#6a685b] focus:border-yellow focus:bg-[#1f201b] focus:outline-none"
              />
            </div>

            {/* Body */}
            <div>
              <div className="flex justify-between font-mono text-[10px]">
                <span className="text-[#cac7b6]">MESSAGE BODY:</span>
                <span className={`font-mono text-[9.5px] ${body.length >= MAX_BODY_LENGTH ? 'text-pink' : 'text-muted'}`}>
                  {body.length} / {MAX_BODY_LENGTH}
                </span>
              </div>
              <textarea
                rows={5}
                value={body}
                maxLength={MAX_BODY_LENGTH}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your note here..."
                className="mt-1 w-full resize-none border border-line bg-[#161714] p-3 font-mono text-[16px] sm:text-sm leading-relaxed text-ink placeholder:text-[#6a685b] focus:border-yellow focus:bg-[#1f201b] focus:outline-none"
              />
            </div>
          </div>

          {/* Live Mailto Budget Meter */}
          <div className="mt-3 border border-[#32332c] bg-[#181916] p-2.5">
            <div className="flex items-center justify-between font-mono text-[9.5px]">
              <span className="flex items-center gap-1 text-muted">
                URL ENCODED BUDGET:
              </span>
              <span className={`font-medium ${budgetRatio > 90 ? 'text-pink' : budgetRatio > 70 ? 'text-yellow' : 'text-lime'}`}>
                {encodedLength} / {SAFE_URL_BUDGET} BYTES ({budgetRatio}%)
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full bg-[#272822] overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  budgetRatio > 90 ? 'bg-pink' : budgetRatio > 70 ? 'bg-yellow' : 'bg-lime'
                }`}
                style={{ width: `${budgetRatio}%` }}
              />
            </div>
            <p className="mt-1.5 m-0 font-mono text-[9px] text-[#8e8c7c]">
              Strictly budgeted within browser mailto limits to prevent truncation on mobile and desktop email clients.
            </p>
          </div>

        </div>

        {/* Bottom Actions Bar: wrap and stack nicely on mobile */}
        <div className="flex flex-col gap-2.5 border-t border-line bg-[#252621] px-3.5 py-3 min-[440px]:flex-row min-[440px]:items-center min-[440px]:justify-between">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 border border-line bg-surface px-3 py-2 font-mono text-[10px] text-[#dedccd] transition-colors hover:border-[#66675b] hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow min-[440px]:w-auto"
          >
            {copied ? (
              <>
                <Check size={12} className="text-lime" />
                <span className="text-lime">COPIED TO CLIPBOARD!</span>
              </>
            ) : (
              <>
                <Copy size={12} className="text-muted" />
                <span>COPY TEXT & ADDRESS</span>
              </>
            )}
          </button>

          <a
            href={isBudgetSafe ? mailtoUri : undefined}
            onClick={() => {
              // Delay close slightly so browser registers link click
              setTimeout(onClose, 400);
            }}
            className={`inline-flex min-h-[44px] w-full items-center justify-center gap-2 border px-3.5 py-2 font-mono text-[10px] font-medium tracking-wide transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-yellow min-[440px]:w-auto ${
              isBudgetSafe
                ? 'border-pink bg-pink text-surface hover:shadow-[2px_2px_0_#f9267270]'
                : 'pointer-events-none opacity-50 border-line bg-focus text-muted'
            }`}
          >
            <span>► LAUNCH MAIL CLIENT</span>
            <ExternalLink size={12} />
          </a>
        </div>

      </div>
    </div>
  );
}
