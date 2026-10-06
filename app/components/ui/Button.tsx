'use client';
import { useState } from "react";
import { cn } from "@/utils/cn";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, AnimatePresence } from "motion/react";
import { Copy01Icon, CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';

interface ButtonProps {
  textToCopy?: string;
};



export default function Button({ textToCopy }: ButtonProps) {

  const [hover, setHover] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    if (textToCopy) {
      try {
        await navigator.clipboard.writeText(textToCopy);
      } catch (err) {
        console.error("Failed to copy text:", err);
      }
    };
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const showText = hover || copied;

  return (
    <div className="w-fit flex items-center justify-end relative">
      <motion.button
        layout
        // transition={{ layout: { duration: 0.25, ease: "easeOut" } }}
        className={cn(
          "flex items-center justify-center p-1.5 md:p-2 rounded-full border border-dashed border-white/60 bg-black/50 backdrop-blur-lg hover:bg-black/70 transition-colors cursor-pointer select-none text-white/90",
        )}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={handleClick}
        type="button"
      >
        <AnimatePresence mode="wait" >
          {showText && (
            <motion.span
              key="showText"
              initial={{ width: 0, opacity: 0, filter: "blur(4px)" }}
              animate={{ width: 44, opacity: 1, filter: "blur(0px)" }} 
              exit={{ width: 0, opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="hidden md:block overflow-hidden whitespace-nowrap text-xs font-sans font-medium "  // had padding - making glitch effect
            >
              {copied ? "Copied" : "Copy..."}
            </motion.span>
          )}
        </AnimatePresence>

        <span className={cn("flex items-center justify-center relative shrink-0")}>
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="checked"
                // initial={{ scale: 0.5, opacity: 0, filter: "blur(4px)" }}
                // animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                exit={{ scale: 0.7, opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex items-center justify-center text-emerald-400 mt-px ml-px"
              >
                <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} />
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                // initial={{ scale: 0.5, opacity: 0, filter: "blur(4px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }} 
                exit={{ scale: 0.7, opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex items-center justify-center mt-px ml-px"
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