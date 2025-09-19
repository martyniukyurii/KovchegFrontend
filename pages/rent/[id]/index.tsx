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
  utilities?: number; // Комунальні послуги
  deposit?: number; // Застава
  minRentPeriod?: string; // Мінімальний термін оренди
}

export default function RentPropertyDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Фейкові дані нерухомості для оренди
  const dummyProperties: Property[] = [
    {
      id: "1",
      title: "Затишна 2-кімнатна квартира в оренду",
      type: "apartment",
      status: "active",
      isFeatured: true,
      price: 450,
      currency: "EUR",
      address: "вул. Головна, 25, кв. 12, Чернівці",
      area: 62.5,
      rooms: 2,
      floor: 3,
      totalFloors: 9,
      utilities: 80,
      deposit: 450,
      minRentPeriod: "6 місяців",
      description:
        "Простора квартира з сучасним ремонтом для довгострокової оренди. Індивідуальне опалення та панорамні вікна. Розташована в новому житловому комплексі з закритою територією. \n\nПоруч з будинком є дитячий майданчик, супермаркет, аптека, школа та дитячий садок. Зручна транспортна розв'язка. \n\nВ квартирі виконаний якісний ремонт з використанням екологічно чистих матеріалів. Встановлені якісні металопластикові вікна з енергозберігаючим склопакетом. Утеплена лоджія з панорамними вікнами. \n\nКухня обладнана сучасною технікою: варильна поверхня, духова шафа, посудомийна машина, холодильник. Санвузол роздільний, оснащений якісною сантехнікою. \n\nВартість включає всі меблі та техніку. Комунальні послуги оплачуються окремо. Потрібна застава в розмірі місячної оплати.",
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
      title: "Комерційне приміщення під офіс",
      type: "commercial",
      status: "active",
      isFeatured: true,
      price: 800,
      currency: "EUR",
      address: "вул. Головна, 120, Чернівці",
      area: 85.0,
      floor: 1,
      totalFloors: 4,
      utilities: 150,
      deposit: 1600,
      minRentPeriod: "12 місяців",
      description:
        "Приміщення на першому поверсі з окремим входом та вітринними вікнами. Ідеальне розташування для офісу компанії в центрі міста. Центральна вулиця з високим пішохідним трафіком. \n\nПриміщення має два входи: центральний з фасаду будівлі та додатковий з двору. Простора зала площею 70 кв.м та додаткові підсобні приміщення.\n\nВиконаний якісний ремонт, встановлена сигналізація, кондиціонери, високошвидкісний інтернет. Є можливість розміщення рекламної вивіски на фасаді будівлі. \n\nМожливе використання як під офіс, салон краси, медичний центр тощо. Комунікації всі центральні, є санвузол. Договір оренди від 1 року.",
      images: [
        "/img/properties/commercial1.jpg",
        "/img/properties/commercial1_2.jpg",
      ],
      tags: ["центр", "окремий вхід", "вітрини", "офіс"],
      responsibleAgent: "Олександр Мельник",
      createdAt: new Date(new Date().setDate(new Date().getDate() - 25)),
      updatedAt: new Date(new Date().setDate(new Date().getDate() - 5)),
    },
    {
      id: "3",
      title: "Будинок з ділянкою в оренду",
      type: "house",
      status: "pending",
      isFeatured: false,
      price: 650,
      currency: "EUR",
      address: "вул. Садова, 42, с. Коровія, Чернівецький район",
      area: 140.0,
      rooms: 4,
      totalFloors: 2,
      utilities: 120,
      deposit: 650,
      minRentPeriod: "12 місяців",
      description:
        "Двоповерховий будинок з прибудинковою ділянкою 10 соток для сімейної оренди. Гараж, літня кухня, фруктовий сад. Будинок збудований з цегли, утеплений. \n\nНа першому поверсі розташовані кухня, вітальня, санвузол та технічне приміщення. На другому поверсі - три спальні кімнати та ванна кімната. \n\nНа території є гараж на два автомобілі, літня кухня з піччю, фруктовий сад (яблуні, груші, сливи, вишні), виноградник, теплиця. Ділянка повністю огороджена, встановлені автоматичні ворота. \n\nБудинок підключений до центрального водопостачання та каналізації. Опалення - газовий котел, є альтернативне опалення твердопаливним котлом. \n\nЗручне розташування - 15 хвилин до центру Чернівців. Поруч зупинка громадського транспорту, магазин, школа.",
      images: ["/img/properties/house1.jpg", "/img/properties/house1_2.jpg"],
      tags: ["окремий будинок", "гараж", "власна ділянка", "для сім'ї"],
      responsibleAgent: "Василь Коваль",
      createdAt: new Date(new Date().setDate(new Date().getDate() - 40)),
      updatedAt: new Date(new Date().setDate(new Date().getDate() - 8)),
    },
    {
      id: "4",
      title: "1-кімнатна квартира біля університету",
      type: "apartment",
      status: "active",
      isFeatured: false,
      price: 250,
      currency: "EUR",
      address: "вул. Університетська, 12, Чернівці",
      area: 38.0,
      rooms: 1,
      floor: 2,
      totalFloors: 5,
      utilities: 50,
      deposit: 250,
      minRentPeriod: "3 місяці",
      description:
        "Компактна квартира поруч з університетом, ідеально для студентів або молодих професіоналів. Квартира повністю мебльована та готова до заселення. \n\nВ квартирі є все необхідне для комфортного проживання: кухонний гарнітур з технікою, диван-ліжко, шафа, стіл для навчання, холодильник, пральна машина. \n\nПоруч розташовані магазини, кафе, аптека, зупинки громадського транспорту. До центру міста 10 хвилин транспортом. \n\nІдеально підходить для студентів, можливе проживання до 2 осіб. Тиха вулиця, спокійні сусіди.",
      images: [
        "/img/properties/apartment2.jpg",
        "/img/properties/apartment2_2.jpg"
      ],
      tags: ["студентський район", "ремонт", "меблі", "для студентів"],
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
    }).format(price) + "/міс";
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
        return t("rent.filters.apartment");
      case "house":
        return t("rent.filters.house");
      case "commercial":
        return t("rent.filters.commercial");
      case "land":
        return t("rent.filters.land");
      default:
        return type;
    }
  };

  const getStatusText = (status: PropertyStatus) => {
    switch (status) {
      case "active":
        return t("rent.status.active");
      case "pending":
        return t("rent.status.pending");
      case "sold":
        return t("rent.status.sold");
      case "reserved":
        return t("rent.status.reserved");
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
            <h1 className={title()}>{t("rent.propertyNotFound")}</h1>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {t("rent.propertyNotFoundDescription")}
            </p>
            <Link href="/rent">
              <Button
                size="lg"
                className="mt-8 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                startContent={<IconArrowLeft size={18} />}
              >
                {t("rent.backToSearch")}
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
          <Link href="/rent">
            <Button
              variant="light"
              startContent={<IconArrowLeft size={16} />}
              className="text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors p-0"
            >
              {t("rent.backToResults")}
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
                      aria-label={t("rent.prevImage")}
                    >
                        <IconArrowNarrowLeft size={20} className="text-white" />
                      </Button>
                      <Button
                        isIconOnly
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-sm border-white/20"
                        variant="bordered"
                        size="lg"
                      onClick={nextImage}
                      aria-label={t("rent.nextImage")}
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
                      ? "ring-3 ring-green-500 shadow-lg" 
                      : "ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-green-300"
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
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  {t("rent.details")}
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
                    className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl hover:shadow-lg transition-shadow duration-300"
                    whileHover={{ scale: 1.02, y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <IconRuler size={24} className="text-blue-600 mb-2" />
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

                {/* Умови оренди */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <IconCurrencyDollar size={20} className="text-green-600" />
                    Умови оренди
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {property.utilities && (
                      <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl">
                        <span className="text-sm text-gray-600 dark:text-gray-400 block">Комунальні</span>
                        <span className="font-semibold text-yellow-700 dark:text-yellow-400">
                          +{property.utilities} {property.currency}/міс
                        </span>
                      </div>
                    )}
                    {property.deposit && (
                      <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl">
                        <span className="text-sm text-gray-600 dark:text-gray-400 block">Застава</span>
                        <span className="font-semibold text-red-700 dark:text-red-400">
                          {property.deposit} {property.currency}
                        </span>
                      </div>
                    )}
                    {property.minRentPeriod && (
                      <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl">
                        <span className="text-sm text-gray-600 dark:text-gray-400 block">Мін. термін</span>
                        <span className="font-semibold text-indigo-700 dark:text-indigo-400">
                          {property.minRentPeriod}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <Divider />

                {/* Опис */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <IconPhoto size={20} className="text-green-600" />
                {t("rent.description")}
              </h3>
                  <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                {property.description}
                  </div>
              </div>

                {/* Теги/Особливості */}
              {property.tags.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <IconTag size={20} className="text-green-600" />
                    {t("rent.tags")}
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
                            color="success"
                            size="md"
                            className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 hover:shadow-md transition-shadow duration-200"
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
                        <IconCalendar size={16} className="text-green-600" />
                        <strong>{t("rent.addedOn")}:</strong> {formatDate(property.createdAt)}
                  </span>
                  {property.updatedAt && (
                        <span className="flex items-center gap-2">
                          <IconCalendar size={16} className="text-blue-600" />
                          <strong>{t("rent.updatedOn")}:</strong> {formatDate(property.updatedAt)}
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
                  {t("rent.contactInfo")}
                </h2>
              </CardHeader>
              <CardBody className="space-y-6">
                {/* Ціна */}
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800">
                  <p className="text-gray-600 dark:text-gray-400 mb-2 text-sm">
                    {t("rent.price")}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <IconCurrencyDollar size={28} className="text-green-600" />
                    <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
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
                      className="bg-gradient-to-r from-green-500 to-blue-500 text-white"
                    />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t("rent.responsibleAgent")}
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
                    className="w-full bg-gradient-to-r from-green-600 to-green-400 hover:from-green-500 hover:to-green-300 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    startContent={<IconPhone size={20} />}
                  >
                  {t("rent.callAgent")}
                  </Button>

                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    startContent={<IconMail size={20} />}
                  >
                  {t("rent.writeEmail")}
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
