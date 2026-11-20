'use client';

import Link from 'next/link';
import FetchSaved from '@/app/components/save_data/FetchSaved';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, PencilEdit01Icon, Bookmark01Icon } from '@hugeicons/core-free-icons';

export default function SavedPage() {
  return (
    <main className="w-full min-h-screen bg-gray-300 flex items-center justify-center p-3 md:p-6 select-none">
      <div
        id="container"
        className="w-full max-w-6xl min-h-[90vh] bg-gray-200/60 rounded-xl flex flex-col p-4 md:p-6 gap-4 md:gap-6 font-handlee shadow-md"
      >
        {/* Navigation / Header */}
        <header className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center pb-2 border-b border-black/10">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1.5 md:p-2 rounded-lg bg-black/80 hover:bg-black text-white transition-colors flex items-center gap-1.5 text-xs md:text-sm font-sans"
              title="Back to Editor"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
              <span className="hidden sm:inline">Editor</span>
            </Link>

            <div>
              <h1 className="font-merienda text-lg md:text-2xl text-black/90 flex items-center gap-2">
                <HugeiconsIcon icon={Bookmark01Icon} size={22} className="text-black/80" />
                <span>Saved Entries</span>
              </h1>
              <p className="font-caveat text-base md:text-lg text-black/60 hidden sm:block">
                All your written thoughts and translations stored locally.
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-lg bg-black/80 hover:bg-black text-white text-xs md:text-sm font-sans font-medium flex items-center gap-1.5 transition-colors self-end sm:self-auto shadow-sm"
          >
            <HugeiconsIcon icon={PencilEdit01Icon} size={16} />
            <span>Write New</span>
          </Link>
        </header>

        {/* Content Section: Saved Entries List */}
        <section className="flex-1 w-full">
          <FetchSaved />
        </section>
      </div>
    </main>
  );
}
