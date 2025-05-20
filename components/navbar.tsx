import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { useState } from "react";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { LanguageSwitch } from "@/components/language-switch";
import { useTranslation } from "@/hooks/useTranslation";
import { Menu, MenuItem, ProductItem } from "@/components/ui/navbar-menu";
import { AuthModal } from "@/components/auth/auth-modal";

export const Navbar = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState<string | null>(null);

  return (
    <HeroUINavbar 
      maxWidth="xl" 
      className="bg-background border-b border-divider w-full fixed top-0 z-50"
    >
      <NavbarContent className="basis-1/6" justify="start">
        <NavbarBrand as="li" className="gap-2 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <img src="/logo.png" alt="Ваш Ковчег" width={32} height={32} />
            <p className="font-bold text-inherit text-sm">Ваш Ковчег</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden lg:flex basis-2/3" justify="center">
        <div className="flex gap-4">
          <Menu setActive={setActive}>
            <MenuItem setActive={setActive} active={active} item={t('nav.buy')}>
              <div className="grid grid-cols-2 gap-8 p-4">
                <ProductItem
                  title={t('submenu.buy.apartments.title')}
                  href="/buy/apartments"
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=160&h=100&q=80"
                  description={t('submenu.buy.apartments.description')}
                />
                <ProductItem
                  title={t('submenu.buy.houses.title')}
                  href="/buy/houses"
                  src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=160&h=100&q=80"
                  description={t('submenu.buy.houses.description')}
                />
                <ProductItem
                  title={t('submenu.buy.new.title')}
                  href="/buy/new"
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=160&h=100&q=80"
                  description={t('submenu.buy.new.description')}
                />
                <ProductItem
                  title={t('submenu.buy.commercial.title')}
                  href="/buy/commercial"
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=160&h=100&q=80"
                  description={t('submenu.buy.commercial.description')}
                />
              </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item={t('nav.rent')}>
              <div className="grid grid-cols-2 gap-8 p-4">
                <ProductItem
                  title={t('submenu.rent.daily.title')}
                  href="/rent/daily"
                  src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=320&h=200&fit=crop"
                  description={t('submenu.rent.daily.description')}
                />
                <ProductItem
                  title={t('submenu.rent.long_term.title')}
                  href="/rent/long-term"
                  src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=320&h=200&fit=crop"
                  description={t('submenu.rent.long_term.description')}
                />
                <ProductItem
                  title={t('submenu.rent.commercial.title')}
                  href="/rent/commercial"
                  src="https://images.unsplash.com/photo-1497366672149-e5e4b4d34eb3?w=320&h=200&fit=crop"
                  description={t('submenu.rent.commercial.description')}
                />
                <ProductItem
                  title={t('submenu.rent.premium.title')}
                  href="/rent/premium"
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=320&h=200&fit=crop"
                  description={t('submenu.rent.premium.description')}
                />
              </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item={t('nav.sell')}>
              <div className="grid grid-cols-2 gap-8 p-4">
                <ProductItem
                  title={t('submenu.sell.evaluation.title')}
                  href="/sell/evaluation"
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=320&h=200&fit=crop"
                  description={t('submenu.sell.evaluation.description')}
                />
                <ProductItem
                  title={t('submenu.sell.list.title')}
                  href="/sell/list"
                  src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=320&h=200&fit=crop"
                  description={t('submenu.sell.list.description')}
                />
                <ProductItem
                  title={t('submenu.sell.consultation.title')}
                  href="/sell/consultation"
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=320&h=200&fit=crop"
                  description={t('submenu.sell.consultation.description')}
                />
                <ProductItem
                  title={t('submenu.sell.fast.title')}
                  href="/sell/fast"
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=320&h=200&fit=crop"
                  description={t('submenu.sell.fast.description')}
                />
              </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item={t('nav.agents')}>
              <div className="grid grid-cols-2 gap-8 p-4">
                <ProductItem
                  title={t('submenu.agents.list.title')}
                  href="/agents"
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=320&h=200&fit=crop"
                  description={t('submenu.agents.list.description')}
                />
                <ProductItem
                  title={t('submenu.agents.join.title')}
                  href="/agents/join"
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=320&h=200&fit=crop"
                  description={t('submenu.agents.join.description')}
                />
                <ProductItem
                  title={t('submenu.agents.reviews.title')}
                  href="/agents/reviews"
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=320&h=200&fit=crop"
                  description={t('submenu.agents.reviews.description')}
                />
                <ProductItem
                  title={t('submenu.agents.training.title')}
                  href="/agents/training"
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=320&h=200&fit=crop"
                  description={t('submenu.agents.training.description')}
                />
              </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item={t('nav.about')}>
              <div className="grid grid-cols-2 gap-8 p-4">
                <ProductItem
                  title={t('submenu.about.company.title')}
                  href="/about"
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=320&h=200&fit=crop"
                  description={t('submenu.about.company.description')}
                />
                <ProductItem
                  title={t('submenu.about.news.title')}
                  href="/about/news"
                  src="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=320&h=200&fit=crop"
                  description={t('submenu.about.news.description')}
                />
                <ProductItem
                  title={t('submenu.about.contacts.title')}
                  href="/about/contacts"
                  src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=320&h=200&fit=crop"
                  description={t('submenu.about.contacts.description')}
                />
                <ProductItem
                  title={t('submenu.about.careers.title')}
                  href="/about/careers"
                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=320&h=200&fit=crop"
                  description={t('submenu.about.careers.description')}
                />
              </div>
            </MenuItem>
          </Menu>
        </div>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex basis-1/6" justify="end">
        <NavbarItem className="hidden sm:flex">
          <AuthModal />
        </NavbarItem>
        <NavbarItem className="hidden sm:flex gap-1">
          <LanguageSwitch />
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-2" justify="end">
        <LanguageSwitch />
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu className="bg-background/70 backdrop-blur-md backdrop-saturate-150">
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href={item.href}
                size="lg"
              >
                {t(`menu.${item.label.toLowerCase()}`)}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
