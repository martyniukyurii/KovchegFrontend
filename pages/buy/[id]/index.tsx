"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconArrowLeft,
  IconMapPin,
  IconHome,
  IconPhone,
  IconMail,
  IconBrandTelegram,
  IconBrandWhatsapp,
  IconCalendar,
  IconX,
  IconChevronLeft,
  IconChevronRight,
  IconPhoto,
  IconLoader2,
  IconZoomIn,
  IconZoomOut,
  IconShare,
  IconLink,
  IconMapSearch,
  IconEye,
  IconSend,
  IconCoffee,
  IconShoppingCart,
  IconBus,
  IconSchool,
  IconRoad,
  IconBuildingBank,
  IconHospital,
  IconPill,
  IconTree,
  IconBarbell,
  IconBike,
  IconCurrencyDollar,
} from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Image } from "@heroui/image";
import { Divider } from "@heroui/divider";
import { Avatar } from "@heroui/avatar";
import { Input, Textarea } from "@heroui/input";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Snippet } from "@heroui/snippet";
import { DatePicker } from "@heroui/date-picker";
import { Select, SelectItem } from "@heroui/select";

// Currency options
const currencies = [
  { key: "EUR", label: "EUR" },
  { key: "USD", label: "USD" },
  { key: "UAH", label: "UAH" },
];

import DefaultLayout from "@/layouts/default";
import { useTranslation } from "@/hooks/useTranslation";
import { title } from "@/components/primitives";
import { OpenStreetMap } from "@/components/maps/openstreet-map";

// Типи для нерухомості
type PropertyType = "apartment" | "house" | "commercial" | "land";
type PropertyStatus = "active" | "pending" | "sold" | "reserved";
type Currency = "EUR" | "USD" | "UAH";

// Інтерфейс для об'єкта нерухомості
interface Property {
  id: string;
  title: string;
  type: PropertyType;
  status: PropertyStatus;
  isFeatured: boolean;
  price: number;
  currency: Currency;
  address: string;
  area: number;
  rooms?: number;
  floor?: number;
  totalFloors?: number;
  description?: string;
  images: string[];
  tags: string[];
  responsibleAgent?: string;
  realtorPhone?: string; // Телефон рієлтора
  realtorName?: string; // Ім'я рієлтора
  coordinates?: { lat: number; lng: number };
  panoeeUrl?: string; // URL для 3D туру
  utilities?: number; // Комунальні послуги
  deposit?: number; // Застава
  minRentPeriod?: string; // Мінімальний термін оренди
  createdAt?: Date;
  updatedAt?: Date;
}

export default function PropertyDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"gallery" | "interior" | "street">("gallery");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [subscribeMethod, setSubscribeMethod] = useState<"email" | "telegram">("email");
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("EUR");
  const [offerPrice, setOfferPrice] = useState<number>(0);
  const [nearbyPlaces, setNearbyPlaces] = useState({
    cafes: 0,
    shops: 0,
    busStops: 0,
    schools: 0,
    parks: 0,
    hospitals: 0,
    pharmacies: 0,
    banks: 0,
    gyms: 0,
    bikeRoads: 0,
  });
  const [contactMessage, setContactMessage] = useState("");

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
      coordinates: { lat: 48.2920, lng: 25.9350 },
      panoeeUrl: "https://momento360.com/e/uc/22442f3e0cb44b449a19e5d0d95d77e5?utm_campaign=embed&utm_source=other&reset-heading=true&size=medium&display-plan=true&upload-key=48cb6e86866945d1be78a14d3194ab87",
      utilities: 80,
      deposit: 450,
      minRentPeriod: "6 місяців",
      description:
        "Простора квартира з сучасним ремонтом для довгострокової оренди. Індивідуальне опалення та панорамні вікна. Розташована в новому житловому комплексі з закритою територією. \n\nПоруч з будинком є дитячий майданчик, супермаркет, аптека, школа та дитячий садок. Зручна транспортна розв'язка. \n\nВ квартирі виконаний якісний ремонт з використанням екологічно чистих матеріалів. Встановлені якісні металопластикові вікна з енергозберігаючим склопакетом. Утеплена лоджія з панорамними вікнами. \n\nКухня обладнана сучасною технікою: варильна поверхня, духова шафа, посудомийна машина, холодильник. Санвузол роздільний, оснащений якісною сантехнікою. \n\nВартість включає всі меблі та техніку. Комунальні послуги оплачуються окремо. Потрібна застава в розмірі місячної оплати.",
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=800&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=1200&h=800&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=1200&h=800&fit=crop&crop=center",
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
      coordinates: { lat: 48.2910, lng: 25.9320 },
      description:
        "Приміщення на першому поверсі з окремим входом та вітринними вікнами.",
      images: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=800&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&h=800&fit=crop&crop=center",
      ],
      tags: ["центр", "окремий вхід", "вітрини"],
      responsibleAgent: "Олександр Мельник",
      createdAt: new Date(new Date().setDate(new Date().getDate() - 25)),
    },
    {
      id: "3",
      title: "Будинок з ділянкою на околиці",
      type: "house",
      status: "pending",
      isFeatured: false,
      price: 120000,
      currency: "EUR",
      address: "вул. Садова, 42, с. Коровія",
      area: 140.0,
      rooms: 4,
      totalFloors: 2,
      coordinates: { lat: 48.3050, lng: 25.9200 },
      description: "Двоповерховий будинок з прибудинковою ділянкою.",
      images: [
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&h=800&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop&crop=center",
      ],
      tags: ["окремий будинок", "гараж", "власна ділянка"],
      responsibleAgent: "Василь Коваль",
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
      coordinates: { lat: 48.2800, lng: 25.9500 },
      description: "Ділянка правильної форми з підведеними комунікаціями.",
      images: [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=800&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1574263867128-9c5c7a5b8c4f?w=1200&h=800&fit=crop&crop=center",
      ],
      tags: ["будівництво", "з комунікаціями"],
      responsibleAgent: "Ірина Коваленко",
    },
  ];

  const getSimilarProperties = (currentPropertyId: string): Property[] => {
    return dummyProperties.filter((p) => p.id !== currentPropertyId).slice(0, 12);
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      
      // Завантажуємо дані з API
      fetch(`/api/properties/${id}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // Трансформуємо дані з API до формату Property
            const prop = data.data;
            const transformedProperty: Property = {
              id: prop.id,
              title: prop.title,
              type: prop.type,
              status: prop.status || 'active',
              isFeatured: prop.isFeatured,
              price: prop.price,
              currency: prop.currency as Currency,
              address: prop.fullAddress,
              area: prop.area,
              rooms: prop.rooms,
              floor: prop.floor,
              totalFloors: prop.totalFloors,
              description: prop.description,
              images: prop.images,
              tags: prop.features || [],
              coordinates: prop.coordinates,
              // Додаємо інформацію про рієлтора
              responsibleAgent: prop.created_by 
                ? `${prop.created_by.first_name} ${prop.created_by.last_name}`.trim() 
                : undefined,
              realtorPhone: prop.realtor_phone || undefined,
              realtorName: prop.created_by 
                ? `${prop.created_by.first_name} ${prop.created_by.last_name || ''}`.trim() 
                : undefined,
              createdAt: prop.createdAt ? new Date(prop.createdAt) : undefined,
              updatedAt: prop.updatedAt ? new Date(prop.updatedAt) : undefined,
            };
            
            setProperty(transformedProperty);
            setSelectedCurrency(transformedProperty.currency);
            setOfferPrice(transformedProperty.price);
            
            // Реєструємо перегляд
            fetch(`/api/properties/${id}/view`, {
              method: 'POST',
            }).catch(err => console.error('View tracking error:', err));
            
            // Завантажити дані про місця поблизу
            if (transformedProperty.coordinates) {
              fetchNearbyPlaces(transformedProperty.coordinates);
            }
          } else {
            // Об'єкт не знайдено
            setProperty(null);
          }
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching property:', error);
          setProperty(null);
          setLoading(false);
        });
    }
  }, [id]);

  const fetchNearbyPlaces = async (coordinates: { lat: number; lng: number }) => {
    try {
      const response = await fetch(
        `/api/nearby-places?lat=${coordinates.lat}&lng=${coordinates.lng}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setNearbyPlaces(data);
      } else {
        console.error("Failed to fetch nearby places");
        // Fallback до дефолтних значень
        setNearbyPlaces({
          cafes: 12,
          shops: 8,
          busStops: 5,
          schools: 3,
          parks: 4,
          hospitals: 2,
          pharmacies: 6,
          banks: 4,
          gyms: 3,
          bikeRoads: 2,
        });
      }
    } catch (error) {
      console.error("Error fetching nearby places:", error);
      // Fallback до дефолтних значень
      setNearbyPlaces({
        cafes: 12,
        shops: 8,
        busStops: 5,
        schools: 3,
        parks: 4,
        hospitals: 2,
        pharmacies: 6,
        banks: 4,
        gyms: 3,
        bikeRoads: 2,
      });
    }
  };

  const formatPrice = (price: number, currency: Currency) => {
    return new Intl.NumberFormat("uk-UA", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price) + "/міс";
  };

  const convertCurrency = (amount: number, fromCurrency: Currency, toCurrency: Currency): number => {
    const rates: { [key in Currency]: number } = {
      EUR: 1,
      USD: 1.09,
      UAH: 41.35,
    };
    const inEUR = amount / rates[fromCurrency];
    return inEUR * rates[toCurrency];
  };

  const formatPriceDetailed = (price: number, currency: Currency, area: number) => {
    const usdPrice = convertCurrency(price, currency, "USD");
    const uahPrice = convertCurrency(price, currency, "UAH");
    const pricePerSqm = usdPrice / area;

    return `${Math.round(usdPrice).toLocaleString("uk-UA")} $ за об'єкт  ·  ${Math.round(uahPrice).toLocaleString("uk-UA")} грн  ·  ${Math.round(pricePerSqm).toLocaleString("uk-UA")} $ за м²`;
  };

  const Lightbox = ({
    images,
    currentIndex,
    onClose,
  }: {
    images: string[];
    currentIndex: number;
    onClose: () => void;
  }) => {
    const [activeIndex, setActiveIndex] = useState(currentIndex);
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
      setActiveIndex(currentIndex);
    }, [currentIndex]);

    const goToPrevious = () => {
      setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      setZoom(1);
    };

    const goToNext = () => {
      setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      setZoom(1);
    };

    const handleZoomIn = () => {
      setZoom((prev) => Math.min(prev + 0.5, 3));
    };

    const handleZoomOut = () => {
      setZoom((prev) => Math.max(prev - 0.5, 1));
    };

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
        if (e.key === "ArrowLeft") goToPrevious();
        if (e.key === "ArrowRight") goToNext();
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
      <div className="fixed inset-0 z-50 bg-black">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
        >
          <IconX size={24} className="text-white" />
        </button>

        <div className="absolute top-4 left-4 z-50 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm">
          {activeIndex + 1} / {images.length}
        </div>

        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex gap-2">
          <button
            onClick={handleZoomIn}
            disabled={zoom >= 3}
            className="px-4 py-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <IconZoomIn size={20} />
            <span className="text-sm">{t("rent.zoomIn")}</span>
          </button>
          <button
            onClick={handleZoomOut}
            disabled={zoom <= 1}
            className="px-4 py-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <IconZoomOut size={20} />
            <span className="text-sm">{t("rent.zoomOut")}</span>
          </button>
        </div>

        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
        >
          <IconChevronLeft size={32} className="text-white" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
        >
          <IconChevronRight size={32} className="text-white" />
        </button>

        <div className="w-full h-full flex items-center justify-center p-4 overflow-auto">
          <img
            src={images[activeIndex]}
            alt={`Фото ${activeIndex + 1}`}
            className="object-contain transition-transform duration-300"
            style={{
              transform: `scale(${zoom})`,
              maxWidth: zoom === 1 ? "100%" : "none",
              maxHeight: zoom === 1 ? "100%" : "none",
              width: zoom > 1 ? "100%" : "auto",
              height: zoom > 1 ? "100%" : "auto",
            }}
          />
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 px-4 py-3 rounded-full bg-black/50 backdrop-blur-sm max-w-full overflow-x-auto">
          {images.map((image, index) => (
            <div
              key={index}
              onClick={() => {
                setActiveIndex(index);
                setZoom(1);
              }}
              className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                activeIndex === index ? "border-blue-500 scale-110" : "border-transparent opacity-60"
              }`}
            >
              <img src={image} alt={`Мініатюра ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    );
  };

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
      case "apartment": return t("rent.filters.apartment");
      case "house": return t("rent.filters.house");
      case "commercial": return t("rent.filters.commercial");
      case "land": return t("rent.filters.land");
      default: return type;
    }
  };

  const handleShare = (platform: "copy" | "viber" | "telegram" | "whatsapp" | "email") => {
    const url = window.location.href;
    const propertyInfo = property ? `${property.title} - ${formatPrice(property.price, property.currency)}` : "";
    const shareText = "Дивіться яку пропозицію знайшов на сайті Ваш Ковчег! " + propertyInfo;

    switch (platform) {
      case "copy":
        navigator.clipboard.writeText(url);
        alert(t("rent.linkCopied"));
        break;
      case "viber":
        window.open(`viber://forward?text=${encodeURIComponent(shareText + " " + url)}`);
        break;
      case "telegram":
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`);
        break;
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + url)}`);
        break;
      case "email":
        window.location.href = `mailto:?subject=${encodeURIComponent(propertyInfo)}&body=${encodeURIComponent(shareText + "\n\n" + url)}`;
        break;
    }
    setIsShareModalOpen(false);
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? (property?.images.length || 1) - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev === (property?.images.length || 1) - 1 ? 0 : prev + 1));
  };

  const addQuickReply = (text: string) => {
    setContactMessage(text);
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
            <p className="mt-4 text-gray-600 dark:text-gray-400">{t("rent.propertyNotFoundDescription")}</p>
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

  const similarProperties = getSimilarProperties(property.id);
  const currentPrice = convertCurrency(property.price, property.currency, selectedCurrency);

  return (
    <DefaultLayout>
      {isLightboxOpen && property && (
        <Lightbox images={property.images} currentIndex={currentImageIndex} onClose={() => setIsLightboxOpen(false)} />
      )}

      {/* Модальне вікно "Поділитися" */}
      <Modal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)}>
        <ModalContent>
          <ModalHeader>{t("rent.shareProperty")}</ModalHeader>
          <ModalBody>
            <div className="space-y-3">
              <Button fullWidth variant="flat" startContent={<IconLink size={20} />} onClick={() => handleShare("copy")}>
                {t("rent.copyLink")}
              </Button>
              <Button fullWidth className="bg-blue-500 text-white" startContent={<IconBrandTelegram size={20} />} onClick={() => handleShare("telegram")}>
                Telegram
              </Button>
              <Button fullWidth className="bg-green-500 text-white" startContent={<IconBrandWhatsapp size={20} />} onClick={() => handleShare("whatsapp")}>
                WhatsApp
              </Button>
              <Button fullWidth className="bg-purple-500 text-white" startContent={<IconPhone size={20} />} onClick={() => handleShare("viber")}>
                Viber
              </Button>
              <Button fullWidth variant="flat" startContent={<IconMail size={20} />} onClick={() => handleShare("email")}>
                Email
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Модальне вікно підписки */}
      <Modal isOpen={isSubscribeModalOpen} onClose={() => setIsSubscribeModalOpen(false)}>
        <ModalContent>
          <ModalHeader>{t("rent.subscribeToNewOffers")}</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              {subscribeMethod === "email" ? (
                <Input type="email" label={t("rent.yourEmail")} placeholder="example@email.com" />
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  Натисніть кнопку нижче, щоб підписатися через Telegram бота
                </p>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setIsSubscribeModalOpen(false)}>
              Скасувати
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white shadow-lg"
              onPress={() => setIsSubscribeModalOpen(false)}
            >
              Підписатися
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Модальне вікно телефону */}
      <Modal isOpen={isCallModalOpen} onClose={() => setIsCallModalOpen(false)}>
        <ModalContent>
          <ModalHeader>{t("rent.callAgent")}</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">Контактний номер телефону:</p>
              {property?.realtorPhone ? (
                <>
                  <Snippet symbol="" variant="bordered" className="w-full">
                    {property.realtorPhone}
                  </Snippet>
                  {property.realtorName && (
                    <p className="text-sm text-gray-500">Рієлтор: {property.realtorName}</p>
                  )}
                </>
              ) : (
                <Snippet symbol="" variant="bordered" className="w-full">
                  {t("footer.phone")}
                </Snippet>
              )}
        </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setIsCallModalOpen(false)}>
              Закрити
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white shadow-lg"
              as="a"
              href={`tel:${property?.realtorPhone || t("footer.phone")}`}
            >
              Зателефонувати
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Модальне вікно email */}
      <Modal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)}>
        <ModalContent>
          <ModalHeader>{t("rent.writeEmail")}</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input label={t("rent.yourName")} placeholder="Введіть ваше ім'я" />
              <Input type="email" label={t("rent.yourEmail")} placeholder="example@email.com" />
              <Textarea label={t("rent.writeQuestion")} placeholder={t("rent.messagePlaceholder")} rows={4} />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setIsEmailModalOpen(false)}>
              Скасувати
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white shadow-lg"
              onPress={() => setIsEmailModalOpen(false)}
            >
              Відправити
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Модальне вікно замовлення огляду */}
      <Modal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)}>
        <ModalContent>
          <ModalHeader>{t("rent.bookViewing")}</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input label={t("rent.yourName")} placeholder="Введіть ваше ім'я" />
              <Input type="tel" label={t("footer.phone")} placeholder="+380" />
              <Input type="email" label={t("rent.yourEmail")} placeholder="example@email.com" />
              <DatePicker label={t("rent.selectDate")} />
              <Textarea label={t("rent.yourMessage")} placeholder={t("rent.messagePlaceholder")} />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setIsBookingModalOpen(false)}>
              Скасувати
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white shadow-lg"
              onPress={() => setIsBookingModalOpen(false)}
            >
              Відправити
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Модальне вікно пропозиції ціни */}
      <Modal isOpen={isOfferModalOpen} onClose={() => setIsOfferModalOpen(false)} size="lg">
        <ModalContent>
          <ModalHeader>{t("rent.makeOffer")}</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t("rent.currentPrice")}</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatPrice(currentPrice, selectedCurrency)}
                  </span>
                </div>
                <Divider className="my-2" />
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t("rent.yourOffer")}</span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatPrice(offerPrice, selectedCurrency)}
                  </span>
                </div>
                <Divider className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-600 dark:text-green-400">{t("rent.potentialSavings")}</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatPrice(Math.max(0, currentPrice - offerPrice), selectedCurrency)}
                  </span>
                </div>
              </div>
              <Input
                type="number"
                label={t("rent.yourOffer")}
                placeholder="Введіть суму"
                value={offerPrice.toString()}
                onChange={(e) => setOfferPrice(Number(e.target.value))}
              />
              <Input label={t("rent.yourName")} placeholder="Введіть ваше ім'я" />
              <Input type="tel" label={t("footer.phone")} placeholder="+380" />
              <Input type="email" label={t("rent.yourEmail")} placeholder="example@email.com" />
              <Textarea label={t("rent.yourMessage")} placeholder={t("rent.messagePlaceholder")} />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setIsOfferModalOpen(false)}>
              Скасувати
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white shadow-lg"
              onPress={() => setIsOfferModalOpen(false)}
            >
              {t("rent.makeAnOffer")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>


      <section className="container mx-auto px-4 py-6 md:py-10 max-w-7xl">
        {/* Заголовок */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            {property.title}
          </h1>
        </div>

        {/* Галерея зображень з бічними карточками */}
        <div className="mb-8 flex flex-col lg:flex-row gap-4">
          {/* Ліва частина - Головна галерея */}
          <div className="lg:w-2/3 relative">
            {/* Основне зображення або Street View з анімацією */}
            <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
              {/* Кнопка "Інші пропозиції" та чіп ТОП */}
              <div className="absolute top-4 left-4 z-40 flex items-center gap-3">
                <Link href="/rent">
                  <Button
                    variant="flat"
                    className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm"
                    startContent={<IconArrowLeft size={18} />}
                  >
                    {t("rent.otherOffers")}
                  </Button>
                </Link>
                {property.isFeatured && (
                  <Chip size="md" className="bg-yellow-400 text-black font-bold">
                    ТОП
                  </Chip>
                )}
              </div>

              {/* Кнопки переключення виглядів - завжди видимі */}
              <div className="absolute bottom-4 left-4 z-40 flex gap-2">
                <Button
                  size="sm"
                  className={
                    viewMode === "gallery"
                      ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg min-w-0 px-2 sm:px-3"
                      : "bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm min-w-0 px-2 sm:px-3"
                  }
                  startContent={<IconPhoto size={18} />}
                  onPress={() => setViewMode("gallery")}
                >
                  <span className="hidden sm:inline">{t("rent.gallery")}</span>
                </Button>
                <Button
                  size="sm"
                  className={
                    viewMode === "interior"
                      ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg min-w-0 px-2 sm:px-3"
                      : "bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm min-w-0 px-2 sm:px-3"
                  }
                  startContent={<IconEye size={18} />}
                  onPress={() => {
                    if (property?.panoeeUrl) {
                      setViewMode("interior");
                    } else {
                      alert('3D тур недоступний для цього об\'єкта');
                    }
                  }}
                >
                  <span className="hidden sm:inline">{t("rent.interiorView")}</span>
                </Button>
                <Button
                  size="sm"
                  className={
                    viewMode === "street"
                      ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg min-w-0 px-2 sm:px-3"
                      : "bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm min-w-0 px-2 sm:px-3"
                  }
                  startContent={<IconRoad size={18} />}
                  onPress={() => setViewMode("street")}
                >
                  <span className="hidden sm:inline">{t("rent.streetView")}</span>
                </Button>
              </div>

              {/* Навігаційні кнопки галереї - завжди видимі */}
              {viewMode === "gallery" && property.images.length > 1 && (
                <>
                  <button
                    onClick={goToPreviousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
                  >
                    <IconChevronLeft size={28} className="text-gray-900 dark:text-white" />
                  </button>
                  <button
                    onClick={goToNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
                  >
                    <IconChevronRight size={28} className="text-gray-900 dark:text-white" />
                  </button>
                </>
              )}

              {/* Анімований контент */}
              <AnimatePresence mode="wait">
                {viewMode === "gallery" ? (
                  <motion.div
                    key={`gallery-${currentImageIndex}`}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="w-full h-full"
                  >
                    {property.images.length > 0 ? (
                      <Image
                        src={property.images[currentImageIndex]}
                        alt={property.title}
                        className="w-full h-full object-cover cursor-pointer"
                        classNames={{
                          wrapper: "w-full h-full !max-w-full",
                          img: "w-full h-full object-cover",
                        }}
                        onClick={() => setIsLightboxOpen(true)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <IconPhoto size={80} className="text-gray-400" />
                      </div>
                    )}
                  </motion.div>
                ) : viewMode === "interior" ? (
                  <motion.div
                    key="interior"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full"
                  >
                    <iframe
                      src={property.panoeeUrl}
                      className="w-full h-full border-0"
                      allowFullScreen
                      loading="lazy"
                      title="3D Interior View"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="street"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full"
                  >
                    <iframe
                      src={`https://www.google.com/maps/embed/v1/streetview?key=AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao&location=${property.coordinates?.lat},${property.coordinates?.lng}&heading=210&pitch=10&fov=90`}
                      className="w-full h-full border-0"
                      allowFullScreen
                      loading="lazy"
                      title="Street View"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Права частина - 3 карточки */}
          <div className="lg:w-1/3 flex flex-row lg:flex-col gap-4">
            {/* 1. Маленьке превю картинка - наступна (тільки на десктопі) */}
            <div className="hidden lg:block flex-1 relative h-[120px] lg:h-[190px] rounded-xl overflow-hidden">
              {property.images[(currentImageIndex + 1) % property.images.length] && (
                <Image
                  src={property.images[(currentImageIndex + 1) % property.images.length]}
                  alt="Наступне превю"
                  className="w-full h-full object-cover"
                  classNames={{
                    wrapper: "w-full h-full !max-w-full",
                    img: "w-full h-full object-cover",
                  }}
                />
              )}
            </div>

            {/* 2. Блюр з картинкою "Дивитись всі фото" */}
            <div
              className="flex-1 relative h-[120px] lg:h-[190px] rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => {
                setCurrentImageIndex(0);
                setIsLightboxOpen(true);
              }}
            >
              {/* Фонове зображення */}
              <div className="absolute inset-0 z-0">
                {property.images[2] ? (
                  <Image
                    src={property.images[2]}
                    alt="Всі фото"
                    className="w-full h-full object-cover blur-md"
                    classNames={{
                      wrapper: "w-full h-full !max-w-full",
                      img: "w-full h-full object-cover blur-md",
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700" />
                )}
              </div>
              
              {/* Оверлей завжди видимий */}
              <div className="absolute inset-0 z-10 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <div className="text-center">
                  <div className="relative inline-block mb-2">
                    <IconPhoto size={40} className="text-white" />
                    <div className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-lg">
                      <IconZoomIn size={16} className="text-blue-600" />
                    </div>
                  </div>
                  <div className="text-white font-semibold text-sm">
                    {t("rent.openFullscreen")}
                  </div>
                  <div className="text-white/90 text-xs mt-1">{property.images.length} {t("rent.photos")}</div>
                </div>
              </div>
            </div>

            {/* 3. Дивитись на мапі з блюром */}
            <div
              className="flex-1 relative h-[120px] lg:h-[190px] rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => {
                document.getElementById("map-section")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {property.coordinates && (
                <>
                  <div className="absolute inset-0 blur-sm">
                    <OpenStreetMap
                      properties={[
                        {
                          id: property.id,
                          title: property.title,
                          coordinates: property.coordinates,
                          price: property.price,
                          currency: property.currency,
                          type: property.type,
                        },
                      ]}
                      center={property.coordinates}
                      zoom={13}
                      className="w-full h-full"
                    />
            </div>
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <div className="text-center">
                      <IconMapSearch size={32} className="text-white mx-auto mb-2" />
                      <span className="text-white font-semibold text-sm">{t("rent.viewOnMap")}</span>
            </div>
                  </div>
                </>
          )}
            </div>
          </div>
        </div>

        {/* Основна інформація - 2 колонки */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Ліва колонка */}
          <div className="lg:col-span-2 space-y-6">
            {/* Карточка з основними даними */}
            <Card className="shadow-lg border border-gray-200 dark:border-gray-700 relative">
              {/* Кнопка "Поділитися" */}
              <Button
                size="sm"
                variant="bordered"
                className="absolute top-4 right-4 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-300 dark:border-gray-600 min-w-0 px-2 sm:px-3"
                startContent={<IconShare size={16} />}
                onPress={() => setIsShareModalOpen(true)}
              >
                <span className="hidden sm:inline">Поділитися</span>
              </Button>

              <CardBody className="p-6">
                {/* Адреса і Ціна на одному рівні */}
                <div className="mb-6">
                  <div className="mb-3 pr-20 md:pr-0">
                    <span className="text-gray-700 dark:text-gray-300">{property.address}</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatPriceDetailed(property.price, property.currency, property.area)}
                  </div>
                </div>

            {/* Характеристики */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t("rent.propertyType")}</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {getPropertyTypeText(property.type)}
                    </div>
                  </div>

                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t("rent.propertyArea")}</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{property.area} м²</div>
                  </div>

                  {property.rooms && (
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t("rent.propertyRooms")}</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{property.rooms}</div>
                    </div>
                  )}

                  {property.floor && property.totalFloors && (
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">{t("rent.propertyFloor")}</div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {property.floor}/{property.totalFloors}
                      </div>
                    </div>
                  )}
                </div>

                {/* Умови оренди */}
                {(property.utilities || property.deposit || property.minRentPeriod) && (
                  <>
                    <Divider className="my-4" />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Умови оренди
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {property.utilities && (
                          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <span className="text-xs text-gray-600 dark:text-gray-400 block mb-1">Комунальні</span>
                            <span className="font-semibold text-yellow-700 dark:text-yellow-400">
                              +{property.utilities} {property.currency}/міс
                            </span>
                          </div>
                        )}
                        {property.deposit && (
                          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <span className="text-xs text-gray-600 dark:text-gray-400 block mb-1">Застава</span>
                            <span className="font-semibold text-red-700 dark:text-red-400">
                              {property.deposit} {property.currency}
                            </span>
                          </div>
                        )}
                        {property.minRentPeriod && (
                          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                            <span className="text-xs text-gray-600 dark:text-gray-400 block mb-1">Мін. термін</span>
                            <span className="font-semibold text-indigo-700 dark:text-indigo-400">
                              {property.minRentPeriod}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardBody>
            </Card>

            {/* Опис */}
            <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t("rent.description")}</h3>
              </CardHeader>
              <CardBody className="p-6">
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                  {/* Для мобільних - згорнутий опис */}
                  <div className="md:hidden">
                    {!isDescriptionExpanded ? (
                      <>
                        {property.description?.slice(0, 150)}...
                        <button
                          onClick={() => setIsDescriptionExpanded(true)}
                          className="ml-2 text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 font-medium"
                        >
                          Більше
                        </button>
                      </>
                    ) : (
                      <>
                        {property.description}
                        <button
                          onClick={() => setIsDescriptionExpanded(false)}
                          className="ml-2 text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 font-medium"
                        >
                          Менше
                        </button>
                      </>
                    )}
                  </div>
                  {/* Для десктопу - повний опис */}
                  <div className="hidden md:block">
                    {property.description}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Особливості (без заголовка, без іконок) */}
            {property.tags.length > 0 && (
              <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
                <CardBody className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {property.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        size="md"
                        variant="flat"
                        className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium"
                      >
                        {tag}
                      </Chip>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Форма чату з агенством (тільки на мобільних після галереї) */}
            <Card className="shadow-lg border border-gray-200 dark:border-gray-700 lg:hidden">
              <CardHeader className="pb-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t("rent.contactAgency")}
                </h3>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-4">
                  <Input label={t("rent.yourName")} placeholder="Введіть ваше ім'я" />
                  <Input type="email" label={t("rent.yourEmail")} placeholder="example@email.com" />
                  <Textarea
                    name="message"
                    label={t("rent.yourMessage")}
                    placeholder={t("rent.messagePlaceholder")}
                    rows={4}
                    value={contactMessage}
                    onValueChange={setContactMessage}
                  />

                  {/* Швидкі відповіді */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="flat"
                      className="text-xs"
                      onPress={() => addQuickReply(t("rent.quickReply1"))}
                    >
                      {t("rent.quickReply1")}
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      className="text-xs"
                      onPress={() => addQuickReply(t("rent.quickReply2"))}
                    >
                      {t("rent.quickReply2")}
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      className="text-xs"
                      onPress={() => addQuickReply(t("rent.quickReply3"))}
                    >
                      {t("rent.quickReply3")}
                    </Button>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white shadow-lg px-8"
                      startContent={<IconSend size={18} />}
                    >
                      {t("rent.sendMessage")}
                    </Button>
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                      {t("rent.orCallUs")}{" "}
                      <a
                        href={`tel:${property?.realtorPhone || t("footer.phone")}`}
                        className="text-blue-600 hover:text-blue-700 underline font-medium"
                      >
                        {property?.realtorPhone || t("footer.phone")}
                      </a>
                      {property?.realtorName && (
                        <span className="block text-xs text-gray-500 mt-1">
                          Рієлтор: {property.realtorName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Форма чату з агенством (тільки на десктопі в лівій колонці) */}
              <Card className="shadow-lg border border-gray-200 dark:border-gray-700 hidden lg:block">
              <CardHeader className="pb-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t("rent.contactAgency")}
                </h3>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-4">
                  <Input label={t("rent.yourName")} placeholder="Введіть ваше ім'я" />
                  <Input type="email" label={t("rent.yourEmail")} placeholder="example@email.com" />
                  <Textarea
                    name="message"
                    label={t("rent.yourMessage")}
                    placeholder={t("rent.messagePlaceholder")}
                    rows={4}
                    value={contactMessage}
                    onValueChange={setContactMessage}
                  />

                  {/* Швидкі відповіді */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="flat"
                      className="text-xs"
                      onPress={() => addQuickReply(t("rent.quickReply1"))}
                    >
                      {t("rent.quickReply1")}
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      className="text-xs"
                      onPress={() => addQuickReply(t("rent.quickReply2"))}
                    >
                      {t("rent.quickReply2")}
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      className="text-xs"
                      onPress={() => addQuickReply(t("rent.quickReply3"))}
                    >
                      {t("rent.quickReply3")}
                    </Button>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white shadow-lg px-8"
                      startContent={<IconSend size={18} />}
                    >
                      {t("rent.sendMessage")}
                    </Button>
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                      {t("rent.orCallUs")}{" "}
                      <a
                        href={`tel:${property?.realtorPhone || t("footer.phone")}`}
                        className="text-blue-600 hover:text-blue-700 underline font-medium"
                      >
                        {property?.realtorPhone || t("footer.phone")}
                      </a>
                      {property?.realtorName && (
                        <span className="block text-xs text-gray-500 mt-1">
                          Рієлтор: {property.realtorName}
                        </span>
                      )}
                        </div>
                        </div>
                      </div>
              </CardBody>
            </Card>

            {/* Карта з точкою та тегами поблизу */}
            <Card className="shadow-lg border border-gray-200 dark:border-gray-700" id="map-section">
              <CardHeader className="pb-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t("rent.location")}</h3>
              </CardHeader>
              <CardBody className="p-0">
                <div className="h-[400px] w-full">
                  {property.coordinates && (
                    <OpenStreetMap
                      properties={[
                        {
                          id: property.id,
                          title: property.title,
                          coordinates: property.coordinates,
                          price: property.price,
                          currency: property.currency,
                          type: property.type,
                        },
                      ]}
                      center={property.coordinates}
                      zoom={15}
                      className="w-full h-full"
                    />
                    )}
                  </div>

                <div className="p-6 bg-gray-50 dark:bg-gray-800">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  {t("rent.nearby")} (500 {t("rent.meters")})
                </h4>
                  <div className="flex flex-wrap gap-2">
                    {nearbyPlaces.cafes > 0 && (
                      <Chip size="sm" variant="flat" startContent={<IconCoffee size={14} />} className="bg-white dark:bg-gray-700">
                        {t("rent.cafes")} ({nearbyPlaces.cafes})
                      </Chip>
                    )}
                    {nearbyPlaces.shops > 0 && (
                      <Chip size="sm" variant="flat" startContent={<IconShoppingCart size={14} />} className="bg-white dark:bg-gray-700">
                        {t("rent.shops")} ({nearbyPlaces.shops})
                      </Chip>
                    )}
                    {nearbyPlaces.busStops > 0 && (
                      <Chip size="sm" variant="flat" startContent={<IconBus size={14} />} className="bg-white dark:bg-gray-700">
                        {t("rent.busStops")} ({nearbyPlaces.busStops})
                      </Chip>
                    )}
                    {nearbyPlaces.schools > 0 && (
                      <Chip size="sm" variant="flat" startContent={<IconSchool size={14} />} className="bg-white dark:bg-gray-700">
                        {t("rent.schools")} ({nearbyPlaces.schools})
                      </Chip>
                    )}
                    {nearbyPlaces.parks > 0 && (
                      <Chip size="sm" variant="flat" startContent={<IconTree size={14} />} className="bg-white dark:bg-gray-700">
                        {t("rent.parks")} ({nearbyPlaces.parks})
                      </Chip>
                    )}
                    {nearbyPlaces.hospitals > 0 && (
                      <Chip size="sm" variant="flat" startContent={<IconHospital size={14} />} className="bg-white dark:bg-gray-700">
                        {t("rent.hospitals")} ({nearbyPlaces.hospitals})
                      </Chip>
                    )}
                    {nearbyPlaces.pharmacies > 0 && (
                      <Chip size="sm" variant="flat" startContent={<IconPill size={14} />} className="bg-white dark:bg-gray-700">
                        {t("rent.pharmacies")} ({nearbyPlaces.pharmacies})
                      </Chip>
                    )}
                    {nearbyPlaces.banks > 0 && (
                      <Chip size="sm" variant="flat" startContent={<IconBuildingBank size={14} />} className="bg-white dark:bg-gray-700">
                        {t("rent.banks")} ({nearbyPlaces.banks})
                      </Chip>
                    )}
                    {nearbyPlaces.gyms > 0 && (
                      <Chip size="sm" variant="flat" startContent={<IconBarbell size={14} />} className="bg-white dark:bg-gray-700">
                        {t("rent.gyms")} ({nearbyPlaces.gyms})
                      </Chip>
                    )}
                    {nearbyPlaces.bikeRoads > 0 && (
                      <Chip size="sm" variant="flat" startContent={<IconBike size={14} />} className="bg-white dark:bg-gray-700">
                        {t("rent.bikeRoads")} ({nearbyPlaces.bikeRoads})
                      </Chip>
                    )}
                  </div>
                </div>
                </CardBody>
              </Card>

            {/* Схожі пропозиції - карусель з кнопками */}
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {t("rent.similarProperties")}
              </h3>
              <div className="relative">
                {/* Кнопки навігації */}
                <button
                  onClick={() => {
                    const container = document.getElementById("similar-properties-container");
                    if (container) container.scrollBy({ left: -300, behavior: "smooth" });
                  }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all hover:scale-110"
                >
                  <IconChevronLeft size={28} className="text-gray-900 dark:text-white" />
                </button>

                <button
                  onClick={() => {
                    const container = document.getElementById("similar-properties-container");
                    if (container) container.scrollBy({ left: 300, behavior: "smooth" });
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all hover:scale-110"
                >
                  <IconChevronRight size={28} className="text-gray-900 dark:text-white" />
                </button>

                <div
                  id="similar-properties-container"
                  className="overflow-x-auto pb-4 hide-scrollbar px-10"
                >
                  <div className="flex gap-4" style={{ width: "fit-content" }}>
                    {similarProperties.slice(0, 12).map((similarProperty) => (
                      <Link
                        key={similarProperty.id}
                        href={`/rent/${similarProperty.id}`}
                        className="block w-[280px] flex-shrink-0"
                      >
                        <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700 h-full">
                          <CardBody className="p-0">
                            <div className="relative h-[200px] w-full">
                              <Image
                                src={similarProperty.images[0]}
                                alt={similarProperty.title}
                                className="w-full h-full object-cover"
                                classNames={{
                                  wrapper: "w-full h-full !max-w-full",
                                  img: "w-full h-full object-cover",
                                }}
                              />
                              {similarProperty.isFeatured && (
                                <Chip size="sm" className="absolute top-2 right-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                                  ТОП
                                </Chip>
                              )}
                            </div>
                            <div className="p-4">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                {similarProperty.title}
                              </h4>
                              <div className="text-xl font-bold text-blue-600 mb-2">
                                {formatPrice(similarProperty.price, similarProperty.currency)}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <IconMapPin size={14} />
                                <span className="line-clamp-1">{similarProperty.address}</span>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
          </div>

            {/* Підписка на нові пропозиції */}
            <Card className="shadow-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30">
              <CardBody className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {t("rent.subscribeToNewOffers")}
                </h3>
                <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white shadow-lg hover:scale-105 transition-transform"
                    startContent={<IconMail size={20} />}
                    onPress={() => {
                      setSubscribeMethod("email");
                      setIsSubscribeModalOpen(true);
                    }}
                  >
                    {t("rent.subscribeViaEmail")}
                  </Button>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white shadow-lg hover:scale-105 transition-transform"
                    startContent={<IconBrandTelegram size={20} />}
                    onPress={() => {
                      setSubscribeMethod("telegram");
                      setIsSubscribeModalOpen(true);
                    }}
                  >
                    {t("rent.subscribeViaTelegram")}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Права колонка - контактна інформація */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                  <h2 className="text-xl font-bold">{t("rent.contactInfo")}</h2>
                </CardHeader>
                <CardBody className="p-6 space-y-4">
                  {property.responsibleAgent && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <Avatar size="lg" name={property.responsibleAgent} className="bg-gradient-to-r from-blue-600 to-blue-400 text-white" />
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{t("rent.responsibleAgent")}</p>
                          <p className="font-bold text-gray-900 dark:text-white">{property.responsibleAgent}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Divider />

                  <div className="space-y-3">
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white font-medium shadow-lg"
                      startContent={<IconPhone size={20} />}
                      onPress={() => setIsCallModalOpen(true)}
                    >
                      {t("rent.callAgent")}
                    </Button>

                    <Button
                      size="lg"
                      variant="bordered"
                      className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                      startContent={<IconMail size={20} />}
                      onPress={() => setIsEmailModalOpen(true)}
                    >
                      {t("rent.writeEmail")}
                    </Button>

                    <Button
                      size="lg"
                      variant="bordered"
                      className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                      startContent={<IconCalendar size={20} />}
                      onPress={() => setIsBookingModalOpen(true)}
                    >
                      {t("rent.bookViewing")}
                    </Button>

                    <Button
                      size="lg"
                      variant="bordered"
                      className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                      onPress={() => setIsOfferModalOpen(true)}
                    >
                      {t("rent.makeOffer")}
                    </Button>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <Button
                        size="md"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                        startContent={<IconBrandTelegram size={18} />}
                      >
                        Telegram
                      </Button>

                      <Button
                        size="md"
                        className="w-full bg-green-500 hover:bg-green-600 text-white"
                        startContent={<IconBrandWhatsapp size={18} />}
                      >
                        WhatsApp
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </DefaultLayout>
  );
}