"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string | null) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [menuStyle, setMenuStyle] = React.useState<React.CSSProperties>({});

  React.useEffect(() => {
    if (menuRef.current && active === item) {
      const rect = menuRef.current.getBoundingClientRect();
      setMenuStyle({
        position: 'fixed',
        left: rect.left + (rect.width / 2) - 350, // 700px (ширина меню) / 2 = 350px
        top: rect.bottom,
        transform: 'none'
      });
    }
  }, [active, item]);

  return (
    <div className="relative" ref={menuRef}>
      <div 
        className={`px-4 py-2 cursor-pointer ${
          active === item 
            ? "text-primary-500 font-semibold border-b-2 border-primary-500" 
            : "text-foreground hover:text-primary-500 hover:border-b-2 hover:border-primary-500"
        } transition-all duration-200`}
        onMouseEnter={() => setActive(item)}
      >
        {item}
      </div>
      {active === item && (
        <div 
          className="fixed z-50"
          style={menuStyle}
          onMouseEnter={() => setActive(item)}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}
            className="bg-background border-small border-default-200 shadow-medium rounded-medium overflow-hidden"
          >
            <div 
              className="w-[700px] p-4"
              style={{
                marginTop: '8px',
                position: 'relative'
              }}
            >
              <div 
                className="absolute top-[-20px] left-0 w-full h-[20px] bg-transparent"
                onMouseEnter={() => setActive(item)}
              />
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <nav 
      className="relative flex bg-transparent"
      onMouseLeave={() => setActive(null)}
    >
      {children}
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <Link href={href} className="flex items-center space-x-4 group py-1.5">
      <div className="relative w-[120px] h-[75px] flex-shrink-0 overflow-hidden rounded-medium">
        <Image
          src={src}
          alt={title}
          fill
          className="object-cover object-center transition-transform group-hover:scale-105"
          sizes="120px"
          priority
        />
      </div>
      <div className="flex flex-col flex-1 max-w-[200px]">
        <span className="text-xs font-medium group-hover:text-primary transition-colors truncate">
          {title}
        </span>
        <span className="text-[11px] text-default-500 mt-1 line-clamp-2">
          {description}
        </span>
      </div>
    </Link>
  );
};

export const HoveredLink = ({ children, ...props }: any) => {
  return (
    <Link
      {...props}
      className="text-sm text-default-500 hover:text-primary transition-colors"
    >
      {children}
    </Link>
  );
};
