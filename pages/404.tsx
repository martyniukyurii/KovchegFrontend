import { Button } from "@heroui/button";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { IconArrowLeft } from "@tabler/icons-react";

import { DefaultLayout } from "@/layouts/default";
import { useTranslation } from "@/hooks/useTranslation";

export default function Custom404() {
  const router = useRouter();
  const { translations } = useTranslation();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <DefaultLayout>
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full max-w-6xl">
          {/* Лівий блок з текстом та кнопкою */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-2">
                404
              </h1>
              <h2 className="text-2xl lg:text-3xl font-semibold text-foreground mb-4">
                {translations.notFound || "Сторінку не знайдено"}
              </h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-md">
                {translations.pageNotFoundDescription || 
                  "Вибачте, сторінка, яку ви шукаєте, не існує або була переміщена."}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Button 
                onPress={handleGoHome}
                startContent={<IconArrowLeft className="h-5 w-5" />}
                className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all duration-300 px-8 py-3 text-lg font-medium"
              >
                {translations.backToHome || "Повернутись на головну сторінку"}
              </Button>
            </motion.div>
          </div>

          {/* Правий блок з літаючим будиночком */}
          <div className="flex justify-center lg:justify-end items-center relative">
            <motion.div
              className="relative"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Основний будиночок емодзі */}
              <div className="text-[12rem] lg:text-[16rem] leading-none select-none">
                🏠
              </div>
              
              {/* Ефект тіні */}
              <motion.div
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-gray-300/30 dark:bg-gray-700/30 rounded-full blur-sm"
                animate={{
                  scaleX: [1, 0.8, 1],
                  opacity: [0.3, 0.1, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            {/* Декоративні плаваючі елементи */}
            <motion.div
              className="absolute top-8 right-8 text-4xl select-none"
              animate={{
                y: [0, -15, 0],
                x: [0, 5, 0],
                rotate: [0, 10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              ☁️
            </motion.div>

            <motion.div
              className="absolute bottom-16 left-8 text-3xl select-none"
              animate={{
                y: [0, -10, 0],
                x: [0, -3, 0],
                rotate: [0, -5, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            >
              ☁️
            </motion.div>

            <motion.div
              className="absolute top-1/2 -right-4 text-2xl select-none"
              animate={{
                y: [0, -8, 0],
                x: [0, 8, 0],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }}
            >
              🌤️
            </motion.div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
