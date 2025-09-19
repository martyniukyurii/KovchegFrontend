import { FC, ReactNode } from "react";

import { Head } from "./head";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/home/footer";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useTranslation } from "@/hooks/useTranslation";

interface DefaultLayoutProps {
  children: ReactNode;
}

export const DefaultLayout: FC<DefaultLayoutProps> = ({ children }) => {
  const { translations } = useTranslation();
  const translationsLoaded = Object.keys(translations).length > 0;

  return (
    <div className="h-screen flex flex-col">
      <Head />
      <Navbar />
      <main className="flex-1 pt-24 w-full">
        {!translationsLoaded ? (
          <LoadingSpinner />
        ) : (
          <div className="container mx-auto max-w-7xl px-6">{children}</div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default DefaultLayout;
