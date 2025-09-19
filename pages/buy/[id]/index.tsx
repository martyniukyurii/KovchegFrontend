"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  IconArrowLeft,
  IconMapPin,
  IconRuler,
  IconHome,
  IconBuilding,
  IconCurrencyDollar,
  IconTag,
  IconPhone,
  IconMail,
  IconBrandTelegram,
  IconBrandWhatsapp,
  IconCalendar,
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconPhoto,
  IconLoader2,
} from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Image } from "@heroui/image";
import { Badge } from "@heroui/badge";
import { Divider } from "@heroui/divider";
import { Avatar } from "@heroui/avatar";

import DefaultLayout from "@/layouts/default";
import { useTranslation } from "@/hooks/useTranslation";
import { title } from "@/components/primitives";

// Типи для нерухомості
type PropertyType = "apartment" | "house" | "commercial" | "land";
type PropertyStatus = "active" | "pending" | "sold" | "reserved";

// Інтерфейс для об'єкта нерухомості
interface Property {
  id: string;
  title: string;
  type: PropertyType;
  status: PropertyStatus;
  isFeatured: boolean;
  price: number;
  currency: string;
  address: string;
  area: number;
  rooms?: number;
  floor?: number;
  totalFloors?: number;
  description?: string;
  images: string[];
  tags: string[];
  responsibleAgent?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function PropertyDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Фейкові дані нерухомості
  const dummyProperties: Property[] = [
    {
      id: "1",
      title: "Затишна 2-кімнатна квартира",
      type: "apartment",
      status: "active",
      isFeatured: true,
      price: 85000,
      currency: "EUR",
      address: "вул. Головна, 25, кв. 12, Чернівці",
      area: 62.5,
      rooms: 2,
      floor: 3,
      totalFloors: 9,
      description:
        "Простора квартира з сучасним ремонтом, індивідуальним опаленням та панорамними вікнами. Розташована в новому житловому комплексі з закритою територією. Поруч з будинком є дитячий майданчик, супермаркет, аптека, школа та дитячий садок. Зручна транспортна розв'язка. \n\nВ квартирі виконаний якісний ремонт з використанням екологічно чистих матеріалів. Встановлені якісні металопластикові вікна з енергозберігаючим склопакетом. Утеплена лоджія з панорамними вікнами. \n\nКухня обладнана сучасною технікою: варильна поверхня, духова шафа, посудомийна машина, холодильник. Санвузол роздільний, оснащений якісною сантехнікою. \n\nВартість включає всі меблі та техніку. Документи в порядку, можливий торг.",
      images: [
        "/img/properties/apartment1.jpg",
        "/img/properties/apartment1_2.jpg",
      ],
      tags: ["індивідуальне опалення", "новобудова", "панорамні вікна", "з меблями", "паркінг"],
      responsibleAgent: "Олена Петренко",
      createdAt: new Date(new Date().setDate(new Date().getDate() - 15)),
      updatedAt: new Date(new Date().setDate(new Date().getDate() - 2)),
    },
    {
      id: "2",
      title: "Комерційне приміщення в центрі міста",
      type: "commercial",
      status: "active",
      isFeatured: true,
      price: 150000,
      currency: "EUR",
      address: "вул. Головна, 120, Чернівці",
      area: 85.0,
      floor: 1,
      totalFloors: 4,
      description:
        "Приміщення на першому поверсі з окремим входом та вітринними вікнами. Ідеальне розташування для магазину чи офісу компанії. Центральна вулиця міста з високим пішохідним трафіком. \n\nПриміщення має два входи: центральний з фасаду будівлі та додатковий з двору. Простора зала площею 70 кв.м та додаткові підсобні приміщення.\n\nВиконаний якісний ремонт, встановлена сигналізація, кондиціонери, високошвидкісний інтернет. Є можливість розміщення рекламної вивіски на фасаді будівлі. \n\nМожливе використання як під магазин, так і під офіс, салон краси, медичний центр тощо. Комунікації всі центральні, є санвузол.",
      images: [
        "/img/properties/commercial1.jpg",
        "/img/properties/commercial1_2.jpg",
      ],
      tags: ["центр", "окремий вхід", "вітрини"],
      responsibleAgent: "Олександр Мельник",
      createdAt: new Date(new Date().setDate(new Date().getDate() - 25)),
      updatedAt: new Date(new Date().setDate(new Date().getDate() - 5)),
    },
    {
      id: "3",
      title: "Будинок з ділянкою на околиці",
      type: "house",
      status: "pending",
      isFeatured: false,
      price: 120000,
      currency: "EUR",
      address: "вул. Садова, 42, с. Коровія, Чернівецький район",
      area: 140.0,
      rooms: 4,
      totalFloors: 2,
      description:
        "Двоповерховий будинок з прибудинковою ділянкою 10 соток. Гараж, літня кухня, фруктовий сад. Будинок збудований з цегли, утеплений. На першому поверсі розташовані кухня, вітальня, санвузол та технічне приміщення. На другому поверсі - три спальні кімнати та ванна кімната. \n\nНа території є гараж на два автомобілі, літня кухня з піччю, фруктовий сад (яблуні, груші, сливи, вишні), виноградник, теплиця. Ділянка повністю огороджена, встановлені автоматичні ворота. \n\nБудинок підключений до центрального водопостачання та каналізації. Опалення - газовий котел, є альтернативне опалення твердопаливним котлом. \n\nЗручне розташування - 15 хвилин до центру Чернівців. Поруч зупинка громадського транспорту, магазин, школа.",
      images: ["/img/properties/house1.jpg", "/img/properties/house1_2.jpg"],
      tags: ["окремий будинок", "гараж", "власна ділянка"],
      responsibleAgent: "Василь Коваль",
      createdAt: new Date(new Date().setDate(new Date().getDate() - 40)),
      updatedAt: new Date(new Date().setDate(new Date().getDate() - 8)),
    },
    {
      id: "4",
      title: "Земельна ділянка під будівництво",
      type: "land",
      status: "active",
      isFeatured: false,
      price: 30000,
      currency: "EUR",
      address: "с. Мамаївці, Чернівецький район",
      area: 1200.0,
      description:
        "Ділянка правильної форми з підведеними комунікаціями. Хороший під'їзд, мальовнича місцевість. Ділянка розташована в затишному районі села Мамаївці, всього в 10 км від Чернівців. \n\nРівна ділянка правильної прямокутної форми, площею 12 соток. До ділянки підведені всі необхідні комунікації: електрика, газ, вода. \n\nПоруч з ділянкою розташовані нові приватні будинки, гарні сусіди. Зручний під'їзд - асфальтована дорога. З ділянки відкривається чудовий краєвид на мальовничі пагорби та ліс. \n\nВсі документи оформлені належним чином, є кадастровий номер, цільове призначення - для індивідуального житлового будівництва. Можлива розстрочка платежу.",
      images: ["/img/properties/land1.jpg", "/img/properties/land1_2.jpg"],
      tags: ["будівництво", "з комунікаціями"],
      responsibleAgent: "Ірина Коваленко",
      createdAt: new Date(new Date().setDate(new Date().getDate() - 60)),
      updatedAt: new Date(new Date().setDate(new Date().getDate() - 10)),
    },
  ];

  useEffect(() => {
    if (id) {
      // Імітація завантаження даних з API
      setLoading(true);
      setTimeout(() => {
        const foundProperty = dummyProperties.find((p) => p.id === id);

        setProperty(foundProperty || null);
        setLoading(false);
      }, 500);
    }
  }, [id]);

  // Допоміжна функція для форматування ціни
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("uk-UA", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Функція для форматування дати
  const formatDate = (date?: Date) => {
    if (!date) return "";

    return new Intl.DateTimeFormat("uk-UA", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const getPropertyTypeText = (type: PropertyType) => {
    switch (type) {
      case "apartment":
        return t("buy.filters.apartment");
      case "house":
        return t("buy.filters.house");
      case "commercial":
        return t("buy.filters.commercial");
      case "land":
        return t("buy.filters.land");
      default:
        return type;
    }
  };

  const getStatusText = (status: PropertyStatus) => {
    switch (status) {
      case "active":
        return t("buy.status.active");
      case "pending":
        return t("buy.status.pending");
      case "sold":
        return t("buy.status.sold");
      case "reserved":
        return t("buy.status.reserved");
      default:
        return status;
    }
  };

  const getStatusColor = (status: PropertyStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "sold":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "reserved":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "";
    }
  };

  // Навігація по галереї
  const nextImage = () => {
    if (property) {
      setSelectedImageIndex((prevIndex) =>
        prevIndex === property.images.length - 1 ? 0 : prevIndex + 1,
      );
    }
  };

  const prevImage = () => {
    if (property) {
      setSelectedImageIndex((prevIndex) =>
        prevIndex === 0 ? property.images.length - 1 : prevIndex - 1,
      );
    }
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="container mx-auto px-4 py-8 md:py-12">
          <motion.div 
            className="flex justify-center items-center min-h-[50vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center gap-4">
              <IconLoader2 size={48} className="animate-spin text-blue-500" />
              <p className="text-gray-600 dark:text-gray-400">Завантажуємо дані...</p>
          </div>
          </motion.div>
        </div>
      </DefaultLayout>
    );
  }

  if (!property) {
    return (
      <DefaultLayout>
        <div className="container mx-auto px-4 py-8 md:py-12">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className={title()}>{t("buy.propertyNotFound")}</h1>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {t("buy.propertyNotFoundDescription")}
            </p>
            <Link href="/buy">
              <Button
                size="lg"
                className="mt-8 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                startContent={<IconArrowLeft size={18} />}
              >
                {t("buy.backToSearch")}
              </Button>
            </Link>
          </motion.div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <motion.section 
        className="container mx-auto px-4 py-8 md:py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Навігація назад */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link href="/buy">
            <Button
              variant="light"
              startContent={<IconArrowLeft size={16} />}
              className="text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors p-0"
            >
              {t("buy.backToResults")}
            </Button>
          </Link>
        </motion.div>

        {/* Заголовок та статус */}
        <motion.div 
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex-1 w-full lg:w-auto">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
              <h1 className={`${title({ size: "sm" })} text-xl sm:text-2xl lg:text-3xl`}>{property.title}</h1>
              {property.isFeatured && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  <Chip size="sm" color="warning" variant="solid" className="self-start">
                    ⭐ Рекомендовано
                  </Chip>
                </motion.div>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400 flex items-start sm:items-center gap-2">
              <IconMapPin size={18} className="mt-0.5 sm:mt-0 flex-shrink-0" />
              <span className="text-sm sm:text-base">{property.address}</span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row w-full lg:w-auto items-stretch sm:items-center gap-3">
            <Chip
              color={property.status === 'active' ? 'success' : property.status === 'pending' ? 'warning' : property.status === 'reserved' ? 'primary' : 'danger'}
              variant="solid"
              size="lg"
              className="self-start sm:self-center"
            >
              {getStatusText(property.status)}
            </Chip>
            <motion.div 
              className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 sm:px-6 py-3 rounded-xl text-lg sm:text-xl font-bold shadow-lg text-center"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              {formatPrice(property.price, property.currency)}
            </motion.div>
          </div>
        </motion.div>

        {/* Галерея зображень */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="relative overflow-hidden shadow-xl">
            <div className="relative w-full h-[300px] md:h-[500px]">
            {property.images.length > 0 ? (
              <>
                <Image
                  src={property.images[selectedImageIndex]}
                  alt={property.title}
                    className="object-cover w-full h-full"
                    classNames={{
                      wrapper: "w-full h-full",
                      img: "w-full h-full object-cover"
                    }}
                />
                {property.images.length > 1 && (
                  <>
                      <Button
                        isIconOnly
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-sm border-white/20"
                        variant="bordered"
                        size="lg"
                      onClick={prevImage}
                      aria-label={t("buy.prevImage")}
                    >
                        <IconArrowNarrowLeft size={20} className="text-white" />
                      </Button>
                      <Button
                        isIconOnly
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-sm border-white/20"
                        variant="bordered"
                        size="lg"
                      onClick={nextImage}
                      aria-label={t("buy.nextImage")}
                    >
                        <IconArrowNarrowRight size={20} className="text-white" />
                      </Button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/30 backdrop-blur-sm py-2 px-4 rounded-full text-white border border-white/20">
                        <span className="flex items-center gap-2 text-sm font-medium">
                          <IconPhoto size={16} />
                        {selectedImageIndex + 1} / {property.images.length}
                      </span>
                    </div>
                  </>
                )}
              </>
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <IconPhoto size={60} className="text-gray-400" />
              </div>
            )}
          </div>
          </Card>

          {/* Мініатюри */}
          {property.images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {property.images.map((image, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-xl overflow-hidden cursor-pointer ${
                    selectedImageIndex === index 
                      ? "ring-3 ring-blue-500 shadow-lg" 
                      : "ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-blue-300"
                  } transition-all duration-200`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <Image
                    src={image}
                    alt={`${property.title} - зображення ${index + 1}`}
                    className="object-cover w-full h-full"
                    classNames={{
                      wrapper: "w-full h-full",
                      img: "w-full h-full object-cover"
                    }}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Основна інформація */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 mb-8">
          <motion.div 
            className="xl:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="shadow-xl">
              <CardHeader className="pb-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t("buy.details")}
                </h2>
              </CardHeader>
              <CardBody className="space-y-6">
                {/* Основні характеристики */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <motion.div 
                    className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl hover:shadow-lg transition-shadow duration-300"
                    whileHover={{ scale: 1.02, y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <IconHome size={24} className="text-blue-600 mb-2" />
                    </motion.div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Тип</span>
                    <span className="font-semibold">{getPropertyTypeText(property.type)}</span>
                  </motion.div>

                  <motion.div 
                    className="flex flex-col items-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl hover:shadow-lg transition-shadow duration-300"
                    whileHover={{ scale: 1.02, y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <IconRuler size={24} className="text-green-600 mb-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Площа</span>
                    <span className="font-semibold">{property.area} м²</span>
                  </motion.div>

                {property.rooms && (
                    <motion.div 
                      className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl hover:shadow-lg transition-shadow duration-300"
                      whileHover={{ scale: 1.02, y: -2 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <IconBuilding size={24} className="text-purple-600 mb-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Кімнати</span>
                      <span className="font-semibold">{property.rooms}</span>
                    </motion.div>
                )}

                {property.floor && property.totalFloors && (
                    <motion.div 
                      className="flex flex-col items-center p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl hover:shadow-lg transition-shadow duration-300"
                      whileHover={{ scale: 1.02, y: -2 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      <IconBuilding size={24} className="text-orange-600 mb-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Поверх</span>
                      <span className="font-semibold">{property.floor}/{property.totalFloors}</span>
                    </motion.div>
                )}
              </div>

                <Divider />

                {/* Опис */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <IconPhoto size={20} className="text-blue-600" />
                {t("buy.description")}
              </h3>
                  <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                {property.description}
                  </div>
              </div>

                {/* Теги/Особливості */}
              {property.tags.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <IconTag size={20} className="text-blue-600" />
                    {t("buy.tags")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {property.tags.map((tag, index) => (
                        <motion.div
                        key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Chip
                            variant="flat"
                            color="primary"
                            size="md"
                            className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 hover:shadow-md transition-shadow duration-200"
                      >
                        {tag}
                          </Chip>
                        </motion.div>
                    ))}
                  </div>
                </div>
              )}

                {/* Дати */}
              {property.createdAt && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-2">
                        <IconCalendar size={16} className="text-blue-600" />
                        <strong>{t("buy.addedOn")}:</strong> {formatDate(property.createdAt)}
                  </span>
                  {property.updatedAt && (
                        <span className="flex items-center gap-2">
                          <IconCalendar size={16} className="text-green-600" />
                          <strong>{t("buy.updatedOn")}:</strong> {formatDate(property.updatedAt)}
                    </span>
                  )}
                    </div>
                </div>
              )}
              </CardBody>
            </Card>
          </motion.div>

          {/* Контактна інформація */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="shadow-xl xl:sticky xl:top-8">
              <CardHeader className="pb-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  {t("buy.contactInfo")}
                </h2>
              </CardHeader>
              <CardBody className="space-y-6">
                {/* Ціна */}
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                  <p className="text-gray-600 dark:text-gray-400 mb-2 text-sm">
                    {t("buy.price")}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <IconCurrencyDollar size={28} className="text-blue-600" />
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  {formatPrice(property.price, property.currency)}
                    </span>
                  </div>
              </div>

                {/* Агент */}
              {property.responsibleAgent && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <Avatar 
                      size="md"
                      name={property.responsibleAgent}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t("buy.responsibleAgent")}
                      </p>
                      <p className="font-semibold">{property.responsibleAgent}</p>
                    </div>
                </div>
              )}

                <Divider />

                {/* Кнопки контактів */}
              <div className="space-y-3">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    startContent={<IconPhone size={20} />}
                  >
                  {t("buy.callAgent")}
                  </Button>

                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-green-600 to-green-400 hover:from-green-500 hover:to-green-300 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    startContent={<IconMail size={20} />}
                  >
                  {t("buy.writeEmail")}
                  </Button>

                                    <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      size="lg"
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-300 text-white shadow-md hover:shadow-lg transition-all duration-300"
                      startContent={<IconBrandTelegram size={20} />}
                    >
                    Telegram
                    </Button>

                    <Button
                      size="lg"
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-400 hover:from-green-400 hover:to-green-300 text-white shadow-md hover:shadow-lg transition-all duration-300"
                      startContent={<IconBrandWhatsapp size={20} />}
                    >
                    WhatsApp
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </motion.section>
    </DefaultLayout>
  );
}
