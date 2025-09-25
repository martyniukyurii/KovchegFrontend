import { FC, useState, useEffect } from "react";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { SwitchProps, useSwitch } from "@heroui/switch";
import { useTheme } from "next-themes";
import clsx from "clsx";

import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";

export interface ThemeSwitchProps {
  className?: string;
  classNames?: SwitchProps["classNames"];
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({
  className,
  classNames,
}) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const onChange = () => {
    // Якщо поточна тема system, перемикаємо на протилежну до resolvedTheme
    if (theme === "system") {
      setTheme(resolvedTheme === "light" ? "dark" : "light");
    } else {
      setTheme(theme === "light" ? "dark" : "light");
    }
  };

  // Визначаємо чи показувати світлий режим (сонце чи місяць)
  const isLightMode = theme === "light" || (theme === "system" && resolvedTheme === "light");

  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch({
    isSelected: isLightMode,
    onChange,
  });

  if (!mounted) {
    return <div className="w-6 h-6" />;
  }

  return (
    <Component
      aria-label={
        isLightMode ? "Switch to dark mode" : "Switch to light mode"
      }
      {...getBaseProps({
        className: clsx(
          "px-px transition-opacity hover:opacity-80 cursor-pointer",
          className,
          classNames?.base,
        ),
      })}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div
        {...getWrapperProps()}
        className={slots.wrapper({
          class: clsx(
            [
              "w-auto h-auto",
              "bg-transparent",
              "rounded-lg",
              "flex items-center justify-center",
              "group-data-[selected=true]:bg-transparent",
              "!text-default-500",
              "pt-px",
              "px-0",
              "mx-0",
            ],
            classNames?.wrapper,
          ),
        })}
      >
        {isLightMode ? (
          <MoonFilledIcon size={22} />
        ) : (
          <SunFilledIcon size={22} />
        )}
      </div>
    </Component>
  );
};
