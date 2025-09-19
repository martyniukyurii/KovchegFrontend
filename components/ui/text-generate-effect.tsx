"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TextGenerateEffectProps {
  words: string;
  gradientWords?: string[];
}

export const TextGenerateEffect = ({
  words,
  gradientWords = [],
}: TextGenerateEffectProps) => {
  const [wordArray, setWordArray] = useState<string[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setWordArray(words.split(" "));
    }, 800);

    return () => clearTimeout(timeout);
  }, [words]);

  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      {wordArray.map((word, idx) => {
        const isGradient = gradientWords.includes(word);

        return (
          <motion.span
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: idx * 0.2,
            }}
            className={
              isGradient
                ? "bg-gradient-to-br from-sky-400 to-blue-600 inline-block text-transparent bg-clip-text font-black"
                : "text-white"
            }
          >
            {word}
          </motion.span>
        );
      })}
    </span>
  );
};
