'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchSingleEntry, deleteEntry, formatEntryDate, Entry } from '@/app/components/save_data/db';
import Button from '@/app/components/ui/Button';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowLeft01Icon,
  PencilEdit01Icon,
  Bookmark01Icon,
  Delete02Icon,
  AlertCircleIcon
} from '@hugeicons/core-free-icons';

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default function SavedEntryDetailPage({ params }: PageProps) {
  // Support both Promise params (Next.js 15+) and direct object params
  const resolvedParams = 'then' in params ? use(params) : params;
  const rawId = resolvedParams.id;
  const router = useRouter();

  const [entry, setEntry] = useState<Entry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInvalidId, setIsInvalidId] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadEntry() {
      const numericId = parseInt(rawId, 10);
      if (isNaN(numericId) || numericId <= 0) {
        if (isMounted) {
          setIsInvalidId(true);
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        const data = await fetchSingleEntry(numericId);
        if (isMounted) {
          if (!data) {
            setEntry(null);
          } else {
            setEntry(data);
          }
        }
      } catch (err) {
        console.error('Failed to load entry:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadEntry();

    return () => {
      isMounted = false;
    };
  }, [rawId]);

  async function handleDelete() {
    if (!entry?.id || isDeleting) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this saved entry?");
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      await deleteEntry(entry.id);
      router.push('/saved');
    } catch (err) {
      console.error('Failed to delete entry:', err);
      setIsDeleting(false);
    }
  }

  // Invalid ID State
  if (isInvalidId) {
    return (
      <main className="w-full min-h-screen bg-gray-300 flex items-center justify-center p-3 md:p-6 select-none font-handlee">
        <div className="w-full max-w-xl bg-gray-200/60 rounded-xl p-8 border border-black/20 text-center shadow-md flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
            <HugeiconsIcon icon={AlertCircleIcon} size={26} />
          </div>
          <h1 className="font-merienda text-xl text-black/90 mb-2">Invalid Entry ID</h1>
          <p className="font-caveat text-xl text-black/60 mb-6">
            The entry ID &quot;{rawId}&quot; is not valid. Please select an entry from your saved list.
          </p>
          <Link
            href="/saved"
            className="px-4 py-2 rounded-lg bg-black/80 hover:bg-black text-white text-sm font-sans transition-colors"
          >
            Back to Saved Entries
          </Link>
        </div>
      </main>
    );
  }

  // Loading State
  if (isLoading) {
    return (
      <main className="w-full min-h-screen bg-gray-300 flex items-center justify-center p-3 md:p-6 select-none font-handlee">
        <div className="w-full max-w-5xl min-h-[70vh] bg-gray-200/60 rounded-xl p-6 border border-black/20 shadow-md flex flex-col justify-between animate-pulse">
          <div className="flex justify-between items-center pb-4 border-b border-black/10">
            <div className="h-8 w-32 bg-black/10 rounded-lg" />
            <div className="h-6 w-36 bg-black/10 rounded-full" />
            <div className="h-8 w-24 bg-black/10 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 flex-1">
            <div className="bg-white/40 rounded-xl p-6 h-80" />
            <div className="bg-white/40 rounded-xl p-6 h-80" />
          </div>
        </div>
      </main>
    );
  }

  // Not Found State
  if (!entry) {
    return (
      <main className="w-full min-h-screen bg-gray-300 flex items-center justify-center p-3 md:p-6 select-none font-handlee">
        <div className="w-full max-w-xl bg-gray-200/60 rounded-xl p-8 border border-black/20 text-center shadow-md flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
            <HugeiconsIcon icon={Bookmark01Icon} size={26} />
          </div>
          <h1 className="font-merienda text-xl text-black/90 mb-2">Entry Not Found</h1>
          <p className="font-caveat text-xl text-black/60 mb-6">
            Entry #{rawId} could not be found. It may have been deleted.
          </p>
          <div className="flex gap-3">
            <Link
              href="/saved"
              className="px-4 py-2 rounded-lg bg-black/80 hover:bg-black text-white text-sm font-sans transition-colors"
            >
              Back to Saved Entries
            </Link>
            <Link
              href="/"
              className="px-4 py-2 rounded-lg bg-black/20 hover:bg-black/30 text-black text-sm font-sans transition-colors"
            >
              Go to Editor
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Document-like Layout for Saved Entry
  return (
    <main className="w-full min-h-screen bg-gray-300 flex items-center justify-center p-3 md:p-6 select-none">
      <div
        id="container"
        className="w-full max-w-5xl min-h-[90vh] bg-gray-200/60 rounded-xl flex flex-col p-4 md:p-6 gap-4 md:gap-6 font-handlee shadow-md"
      >
        {/* Top Header / Navigation Bar */}
        <header className="flex flex-wrap gap-3 justify-between items-center pb-3 border-b border-black/10">
          <div className="flex items-center gap-2 md:gap-3">
            <Link
              href="/saved"
              className="px-2.5 py-1.5 rounded-lg bg-black/80 hover:bg-black text-white text-xs md:text-sm font-sans flex items-center gap-1.5 transition-colors shadow-xs"
              title="Back to all saved entries"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
              <span>Back</span>
            </Link>

            {/* Creation Date Badge */}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-sans font-medium bg-black/80 text-white shadow-xs">
              {formatEntryDate(entry.createdAt)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-2.5 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-xs md:text-sm font-sans flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              title="Delete this entry"
            >
              <HugeiconsIcon icon={Delete02Icon} size={16} />
              <span className="hidden sm:inline">{isDeleting ? "Deleting..." : "Delete"}</span>
            </button>

            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg bg-black/80 hover:bg-black text-white text-xs md:text-sm font-sans font-medium flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <HugeiconsIcon icon={PencilEdit01Icon} size={16} />
              <span>New</span>
            </Link>
          </div>
        </header>

        {/* Document-like side-by-side (50% each on md+, stacked on smaller screens) */}
        <div className="flex-1 w-full flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Left section: Original text */}
          <section className="w-full md:w-1/2 flex flex-col bg-white/70 rounded-xl border border-black/20 p-4 md:p-6 shadow-xs relative">
            <div className="flex items-center justify-between pb-3 border-b border-black/15">
              <h2 className="font-merienda text-base md:text-lg text-black/90 font-semibold">
                Original Text
              </h2>
              <span className="text-xs font-sans uppercase tracking-wider px-2 py-0.5 rounded bg-black/10 text-black/70">
                Original
              </span>
            </div>

            <div className="flex-1 pt-4 overflow-y-auto">
              <p className="font-caveat text-xl md:text-2xl text-black leading-relaxed whitespace-pre-wrap select-text">
                {entry.text}
              </p>
            </div>
          </section>

          {/* Right section: Translated text */}
          <section className="w-full md:w-1/2 flex flex-col bg-white/70 rounded-xl border border-black/20 p-4 md:p-6 shadow-xs relative">
            <div className="flex items-center justify-between pb-3 border-b border-black/15">
              <h2 className="font-merienda text-base md:text-lg text-black/90 font-semibold">
                Translated Text
              </h2>
              <div className="flex items-center gap-2">
                <Button textToCopy={entry.translated} />
              </div>
            </div>

            <div className="flex-1 pt-4 overflow-y-auto">
              <p className="font-caveat text-xl md:text-2xl text-black/80 leading-relaxed whitespace-pre-wrap select-text">
                {entry.translated || "(No translation recorded)"}
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
