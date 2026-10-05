'use client';
import { useState } from "react";
import { cn } from "@/utils/cn";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, AnimatePresence } from "motion/react";
import { Copy01Icon, CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';

interface ButtonProps {
  textToCopy?: string;
  onClick?: () => void;
  className?: string;
}

export default function Button({ textToCopy, onClick, className }: ButtonProps) {
  const [hover, setHover] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    if (onClick) {
      onClick();
    }
    if (textToCopy) {
      try {
        await navigator.clipboard.writeText(textToCopy);
      } catch (err) {
        console.error("Failed to copy text:", err);
      }
    }
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  const showText = hover || copied;

  return (
    <div className="w-fit flex items-center justify-end relative">
      <motion.button
        layout
        transition={{ layout: { duration: 0.25, ease: "easeOut" } }}
        className={cn(
          "flex items-center justify-center px-2.5 py-2 rounded-full border border-white/30 bg-black/50 hover:bg-black/70 transition-colors backdrop-blur-sm cursor-pointer select-none text-white/90",
          className
        )}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={handleClick}
        type="button"
      >
        <AnimatePresence mode="wait">
          {showText && (
            <motion.span
              key={copied ? "copied" : "copy"}
              initial={{ width: 0, opacity: 0, filter: "blur(2px)" }}
              animate={{ width: "auto", opacity: 1, filter: "blur(0px)" }}
              exit={{ width: 0, opacity: 0, filter: "blur(2px)" }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="overflow-hidden whitespace-nowrap text-xs font-sans font-medium pr-1.5"
            >
              {copied ? "Copied" : "Copy"}
            </motion.span>
          )}
        </AnimatePresence>

        <span className="flex items-center justify-center w-5 h-5 relative shrink-0">
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="checked"
                initial={{ scale: 0.5, opacity: 0, filter: "blur(4px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                exit={{ scale: 0.5, opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex items-center justify-center text-emerald-400"
              >
                <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} />
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ scale: 0.5, opacity: 0, filter: "blur(4px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                exit={{ scale: 0.5, opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex items-center justify-center"
              >
                <HugeiconsIcon icon={Copy01Icon} size={18} />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </motion.button>
    </div>
  );
};


// function Icon({icon, color})