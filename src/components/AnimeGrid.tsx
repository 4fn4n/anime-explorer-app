"use client";

import { motion } from "framer-motion";
import type { Anime } from "@/types/anime";
import AnimeCard from "./AnimeCard";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AnimeGrid({ anime }: { anime: Anime[] }) {
  if (anime) {
    return (
      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {anime.map((a,index) => (
          <motion.div key={index} variants={item}>
            <AnimeCard anime={a} />
          </motion.div>
        ))}
      </motion.div>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg text-gray-500 dark:text-gray-400">
          No anime found.
        </p>
      </div>
    );
  }
}
