export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Ваш Ковчег - агентство нерухомості",
  description:
    "Агентство нерухомості Ваш Ковчег - ваш надійний партнер у світі нерухомості",
  navItems: [
    {
      label: "Buy",
      href: "/buy",
    },
    {
      label: "Rent",
      href: "/rent",
    },
    {
      label: "Sell",
      href: "/sell",
    },
    {
      label: "Agents",
      href: "/agents",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Login",
      href: "/login",
    },
    {
      label: "Register",
      href: "/register",
    },
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    website: "https://vashkovcheg.com",
  },
};
