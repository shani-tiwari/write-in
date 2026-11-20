'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Entry, fetchEntries, formatEntryDate } from './db';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon, NoteIcon } from '@hugeicons/core-free-icons';

interface FetchSavedProps {
  limit?: number;
}

export default function FetchSaved({ limit }: FetchSavedProps) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadEntries() {
      try {
        setIsLoading(true);
        const data = await fetchEntries();
        if (isMounted) {
          setEntries(limit ? data.slice(0, limit) : data);
        }
      } catch (err) {
        console.error('Failed to load saved entries:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadEntries();

    return () => {
      isMounted = false;
    };
  }, [limit]);

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse bg-white/40 border border-black/10 rounded-xl p-5 h-48 flex flex-col justify-between"
          >
            <div className="h-6 w-28 bg-black/10 rounded-full" />
            <div className="space-y-2.5 my-3">
              <div className="h-4 w-full bg-black/10 rounded" />
              <div className="h-4 w-5/6 bg-black/10 rounded" />
              <div className="h-4 w-3/4 bg-black/10 rounded" />
            </div>
            <div className="h-4 w-1/3 bg-black/10 rounded" />
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (entries.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-8 md:p-14 bg-white/40 border border-dashed border-black/20 rounded-xl text-center">
        <div className="w-14 h-14 rounded-full bg-black/10 flex items-center justify-center mb-4 text-black/70">
          <HugeiconsIcon icon={NoteIcon} size={28} />
        </div>
        <h3 className="font-merienda text-lg md:text-xl text-black/80 mb-2">
          No saved entries yet
        </h3>
        <p className="font-caveat text-xl text-black/60 max-w-md mb-6 leading-relaxed">
          Write down your thoughts on the home page and save them to build your personal language journal!
        </p>
        <Link
          href="/"
          className="px-4 py-2 rounded-lg bg-black/80 hover:bg-black text-white text-sm font-sans font-medium transition-colors shadow-sm"
        >
          Write your first entry
        </Link>
      </div>
    );
  }

  // Entries list
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {entries.map((entry) => (
        <Link
          key={entry.id}
          href={`/saved/${entry.id}`}
          className="group flex flex-col justify-between bg-white/80 hover:bg-white border border-black/20 hover:border-black/40 rounded-xl p-4 md:p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
        >
          <div>
            {/* Top row with Date Badge */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-sans font-medium bg-black/80 text-white shadow-xs">
                {formatEntryDate(entry.createdAt)}
              </span>
              <span className="text-xs font-sans text-black/40 group-hover:text-black/80 transition-colors">
                #{entry.id}
              </span>
            </div>

            {/* Preview of the first 3-4 lines of original text */}
            <div className="my-2">
              <p className="font-caveat text-lg md:text-xl text-black/90 line-clamp-4 whitespace-pre-wrap leading-snug">
                {entry.text}
              </p>
            </div>
          </div>

          {/* Bottom translated preview / footer */}
          <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between text-xs font-sans text-black/60">
            <span className="line-clamp-1 italic font-caveat text-base text-black/70 pr-2">
              {entry.translated || "(No translation)"}
            </span>
            <span className="shrink-0 flex items-center gap-1 font-medium text-black/70 group-hover:text-black transition-colors">
              <span>View</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
