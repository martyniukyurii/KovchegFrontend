import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import NextLink from "next/link";
import { useState } from "react";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Accordion, AccordionItem } from "@heroui/accordion";

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
            <MenuItem setActive={setActive} active={active} item={t("nav.buy")} href="/buy">
              <div className="grid grid-cols-2 gap-8 p-4">
                <ProductItem
                  title={t("submenu.buy.apartments.title")}
                  href="/buy?type=apartment"
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=160&h=100&q=80"
                  description={t("submenu.buy.apartments.description")}
                />
                <ProductItem
                  title={t("submenu.buy.houses.title")}
                  href="/buy?type=house"
                  src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=160&h=100&q=80"
                  description={t("submenu.buy.houses.description")}
                />
                <ProductItem
                  title={t("submenu.buy.new.title")}
                  href="/buy?category=new"
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=160&h=100&q=80"
                  description={t("submenu.buy.new.description")}
                />
                <ProductItem
                  title={t("submenu.buy.commercial.title")}
                  href="/buy?type=commercial"
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=160&h=100&q=80"
                  description={t("submenu.buy.commercial.description")}
                />
              </div>
            </MenuItem>
            <MenuItem
              setActive={setActive}
              active={active}
              item={t("nav.rent")}
              href="/rent"
            >
              <div className="grid grid-cols-2 gap-8 p-4">
                <ProductItem
                  title={t("submenu.rent.daily.title")}
                  href="/rent?category=daily"
                  src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=320&h=200&fit=crop"
                  description={t("submenu.rent.daily.description")}
                />
                <ProductItem
                  title={t("submenu.rent.longterm.title")}
                  href="/rent?category=longterm"
                  src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=320&h=200&fit=crop"
                  description={t("submenu.rent.longterm.description")}
                />
                <ProductItem
                  title={t("submenu.rent.commercial.title")}
                  href="/rent?type=commercial"
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=320&h=200&fit=crop"
                  description={t("submenu.rent.commercial.description")}
                />
                <ProductItem
                  title={t("submenu.rent.premium.title")}
                  href="/rent?category=premium"
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=320&h=200&fit=crop"
                  description={t("submenu.rent.premium.description")}
                />

              </div>
            </MenuItem>
            <MenuItem
              setActive={setActive}
              active={active}
              item={t("nav.sell")}
              href="/sell"
            >
              <div className="grid grid-cols-2 gap-8 p-4">
                <ProductItem
                  title={t("submenu.sell.evaluation.title")}
                  href="/sell?service=evaluation"
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=320&h=200&fit=crop"
                  description={t("submenu.sell.evaluation.description")}
                />
                <ProductItem
                  title={t("submenu.sell.list.title")}
                  href="/sell?service=list"
                  src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=320&h=200&fit=crop"
                  description={t("submenu.sell.list.description")}
                />
                <ProductItem
                  title={t("submenu.sell.consultation.title")}
                  href="/sell?service=consultation"
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=320&h=200&fit=crop"
                  description={t("submenu.sell.consultation.description")}
                />
                <ProductItem
                  title={t("submenu.sell.fast.title")}
                  href="/sell?service=fast"
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=320&h=200&fit=crop"
                  description={t("submenu.sell.fast.description")}
                />
              </div>
            </MenuItem>
            {/* Тимчасово приховано - сторінка агентів */}
            {/* <MenuItem
              setActive={setActive}
              active={active}
              item={t("nav.agents")}
              href="/agents"
            >
              <div className="grid grid-cols-2 gap-8 p-4">
                <ProductItem
                  title={t("submenu.agents.list.title")}
                  href="/agents?section=list"
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=320&h=200&fit=crop"
                  description={t("submenu.agents.list.description")}
                />
                <ProductItem
                  title={t("submenu.agents.join.title")}
                  href="/agents?section=join"
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=320&h=200&fit=crop"
                  description={t("submenu.agents.join.description")}
                />
                <ProductItem
                  title={t("submenu.agents.reviews.title")}
                  href="/agents?section=reviews"
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=320&h=200&fit=crop"
                  description={t("submenu.agents.reviews.description")}
                />
                <ProductItem
                  title={t("submenu.agents.training.title")}
                  href="/agents?section=training"
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=320&h=200&fit=crop"
                  description={t("submenu.agents.training.description")}
                />
              </div>
            </MenuItem> */}
            <MenuItem
              setActive={setActive}
              active={active}
              item={t("nav.about")}
              href="/about"
            >
              <div className="grid grid-cols-2 gap-8 p-4">
                <ProductItem
                  title={t("submenu.about.company.title")}
                  href="/about?section=company"
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=320&h=200&fit=crop"
                  description={t("submenu.about.company.description")}
                />
                <ProductItem
                  title={t("submenu.about.news.title")}
                  href="/about?section=news"
                  src="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=320&h=200&fit=crop"
                  description={t("submenu.about.news.description")}
                />
                <ProductItem
                  title={t("submenu.about.contacts.title")}
                  href="/about?section=contacts"
                  src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=320&h=200&fit=crop"
                  description={t("submenu.about.contacts.description")}
                />
                <ProductItem
                  title={t("submenu.about.careers.title")}
                  href="/about?section=careers"
                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=320&h=200&fit=crop"
                  description={t("submenu.about.careers.description")}
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

      <NavbarMenu className="bg-background/95 backdrop-blur-md backdrop-saturate-150 border-none">
        <div className="mx-4 mt-4 flex flex-col gap-2">
          {/* Головні пункти меню з підменю */}
          <Accordion 
            variant="light"
            className="px-0"
            itemClasses={{
              base: "py-2 w-full",
              title: "font-medium text-default-500 text-base",
              trigger: "px-0 py-2 data-[hover=true]:bg-transparent",
              content: "text-small px-0 pb-2",
            }}
          >
            {/* Купити */}
            <AccordionItem key="buy" aria-label={t("nav.buy")} title={t("nav.buy")}>
              <div className="flex flex-col gap-2 pl-4">
                <Link
                  href="/buy?type=apartment"
                  className="py-2 text-default-600"
                  size="sm"
                >
                  {t("submenu.buy.apartments.title")}
                </Link>
                <Link
                  href="/buy?type=house"
                  className="py-2 text-default-600"
                  size="sm"
                >
                  {t("submenu.buy.houses.title")}
                </Link>
                <Link
                  href="/buy?type=new"
                  className="py-2 text-default-600"
                  size="sm"
                >
                  {t("submenu.buy.new.title")}
                </Link>
                <Link
                  href="/buy?type=commercial"
                  className="py-2 text-default-600"
                  size="sm"
                >
                  {t("submenu.buy.commercial.title")}
                </Link>
              </div>
            </AccordionItem>

            {/* Орендувати */}
            <AccordionItem key="rent" aria-label={t("nav.rent")} title={t("nav.rent")}>
              <div className="flex flex-col gap-2 pl-4">
                <Link
                  href="/rent?category=daily"
                  className="py-2 text-default-600"
                  size="sm"
                >
                  {t("submenu.rent.daily.title")}
                </Link>
                <Link
                  href="/rent?category=longterm"
                  className="py-2 text-default-600"
                  size="sm"
                >
                  {t("submenu.rent.longterm.title")}
                </Link>
                <Link
                  href="/rent?type=commercial"
                  className="py-2 text-default-600"
                  size="sm"
                >
                  {t("submenu.rent.commercial.title")}
                </Link>
                <Link
                  href="/rent?category=premium"
                  className="py-2 text-default-600"
                  size="sm"
                >
                  {t("submenu.rent.premium.title")}
                </Link>
              </div>
            </AccordionItem>

            {/* Продати */}
            <AccordionItem key="sell" aria-label={t("nav.sell")} title={t("nav.sell")}>
              <div className="flex flex-col gap-2 pl-4">
                <Link
                  href="/sell?service=evaluation"
                  className="py-2 text-default-600"
                  size="sm"
                >
                  {t("submenu.sell.evaluation.title")}
                </Link>
                <Link
                  href="/sell?service=list"
                  className="py-2 text-default-600"
                  size="sm"
                >
                  {t("submenu.sell.list.title")}
                </Link>
                <Link
                  href="/sell?service=consultation"
                  className="py-2 text-default-600"
                  size="sm"
                >
                  {t("submenu.sell.consultation.title")}
                </Link>
                <Link
                  href="/sell?service=fast"
                  className="py-2 text-default-600"
                  size="sm"
                >
                  {t("submenu.sell.fast.title")}
                </Link>
              </div>
            </AccordionItem>

            {/* Тимчасово приховано - сторінка агентів */}
            {/* <AccordionItem key="agents" aria-label={t("nav.agents")} title={t("nav.agents")}>
              <div className="flex flex-col gap-2 pl-4">
                <Link
                  href="/agents?section=list"
                  className="py-2 text-default-600"
                  size="sm"
                >
                  {t("submenu.agents.list.title")}
                </Link>
                <Link
                  href="/agents?section=join"
                  className="py-2 text-default-600"
                  size="sm"
                >
                  {t("submenu.agents.join.title")}
                </Link>
                <Link
                  href="/agents?section=reviews"
                  className="py-2 text-default-600"
                  size="sm"
                >
                  {t("submenu.agents.reviews.title")}
                </Link>
                <Link
                  href="/agents?section=training"
                  className="py-2 text-default-600"
                  size="sm"
                >
                  {t("submenu.agents.training.title")}
                </Link>
              </div>
            </AccordionItem> */}

            {/* Про нас */}
            <AccordionItem key="about" aria-label={t("nav.about")} title={t("nav.about")}>
              <div className="flex flex-col gap-2 pl-4">
                <Link
                  href="/about?section=company"
                  className="py-2 text-default-600"
                  size="sm"
                >
                  {t("submenu.about.company.title")}
                </Link>
                <Link
                  href="/about?section=news"
                  className="py-2 text-default-600"
                  size="sm"
                >
                  {t("submenu.about.news.title")}
                </Link>
                <Link
                  href="/about?section=contacts"
                  className="py-2 text-default-600"
                  size="sm"
                >
                  {t("submenu.about.contacts.title")}
                </Link>
              <Link
                  href="/about?section=careers"
                  className="py-2 text-default-600"
                  size="sm"
                >
                  {t("submenu.about.careers.title")}
              </Link>
              </div>
            </AccordionItem>
          </Accordion>

          <Divider className="my-4" />

          {/* Кнопка авторизації */}
          <div className="px-0">
            <AuthModal />
          </div>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
