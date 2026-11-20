'use client';

import { useState } from 'react';
import { cn } from '@/utils/cn';
import { HugeiconsIcon } from '@hugeicons/react';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark01Icon, CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';
import { saveEntry } from './db';

interface SaveButtonProps {
  text: string;
  translated: string;
  onSaved?: (newId: number) => void;
  className?: string;
}

export default function SaveButton({
  text,
  translated,
  onSaved,
  className
}: SaveButtonProps) {
  const [hover, setHover] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const canSave = text.trim().length > 0 && !isSaving;

  async function handleSave() {
    if (!canSave) return;
    try {
      setIsSaving(true);
      const newId = await saveEntry(text, translated);
      setSaved(true);
      if (onSaved) {
        onSaved(newId);
      }
      setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to save entry:', err);
    } finally {
      setIsSaving(false);
    }
  }

  const showText = hover || saved;

  return (
    <div className={cn("w-fit flex items-center justify-end relative", className)}>
      <motion.button
        layout
        className={cn(
          "flex items-center justify-center p-1.5 md:p-2 rounded-full border border-dashed transition-colors select-none text-white/90",
          saved
            ? "border-emerald-400/80 bg-emerald-950/70"
            : "border-white/60 bg-black/50 backdrop-blur-lg hover:bg-black/70",
          !canSave && !saved ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        )}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={handleSave}
        disabled={!canSave && !saved}
        type="button"
        title="Save this entry to your local journal"
      >
        <AnimatePresence mode="wait">
          {showText && (
            <motion.span
              key="showText"
              initial={{ width: 0, opacity: 0, filter: "blur(4px)" }}
              animate={{ width: 44, opacity: 1, filter: "blur(0px)" }}
              exit={{ width: 0, opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="hidden md:block overflow-hidden whitespace-nowrap text-xs font-sans font-medium"
            >
              {saved ? "Saved!" : "Save"}
            </motion.span>
          )}
        </AnimatePresence>

        <span className="flex items-center justify-center relative shrink-0">
          <AnimatePresence mode="wait" initial={false}>
            {saved ? (
              <motion.span
                key="saved"
                exit={{ scale: 0.7, opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex items-center justify-center text-emerald-400 mt-px ml-px"
              >
                <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} />
              </motion.span>
            ) : (
              <motion.span
                key="save"
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                exit={{ scale: 0.7, opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex items-center justify-center mt-px ml-px"
              >
                <HugeiconsIcon icon={Bookmark01Icon} size={18} />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </motion.button>
    </div>
  );
}
