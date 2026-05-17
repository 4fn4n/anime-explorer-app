"use client";

import { useEffect, useRef, useState } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSearchStore } from "@/store/searchStore";

export default function SearchBar() {
  const { query, setQuery } = useSearchStore();
  const [input, setInput] = useState(query);
  const pendingRef = useRef(false);

  useEffect(() => {
    if (!pendingRef.current) {
      setInput(query);
    }
  }, [query]);

  useEffect(() => {
    if (input === query) {
      pendingRef.current = false;
      return;
    }

    pendingRef.current = true;
    const timer = setTimeout(() => {
      pendingRef.current = false;
      setQuery(input);
    }, 500);

    return () => clearTimeout(timer);
  }, [input, query, setQuery]);

  return (
    <div className="relative">
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search anime..."
        className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-blue-400"
      />
      {input && (
        <button
          onClick={() => {
            setInput("");
            setQuery("");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Clear search"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
