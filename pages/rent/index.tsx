"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Pagination } from "@heroui/pagination";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from "@heroui/drawer";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { useDisclosure } from "@heroui/react";
import { Tabs, Tab } from "@heroui/tabs";
import {
  IconFilter,
  IconHome,
  IconSearch,
  IconMapPin,
  IconRuler,
  IconGrid3x3,
  IconMap,
  IconLayoutSidebarRightExpand,
  IconCurrencyDollar,
  IconCurrencyEuro,
  IconCurrency
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import DefaultLayout from "@/layouts/default";
import { useTranslation } from "@/hooks/useTranslation";
import { OpenStreetMap } from "@/components/maps/openstreet-map";

// Типи для нерухомості
type PropertyType = "apartment" | "house" | "commercial" | "land";
type PropertyStatus = "active" | "pending" | "sold" | "reserved";
type ViewMode = "grid" | "map" | "split";

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
  coordinates?: { lat: number; lng: number };
}

export default function RentPage() {
  const router = useRouter();
  const { t } = useTranslation();

  // Дані для фільтрів - категорії оренди
  const rentCategories = [
    {key: "daily", label: t("rent.filters.daily") || "Подобово"},
    {key: "longterm", label: t("rent.filters.longterm") || "Довгостроково"},
    {key: "commercial", label: t("rent.filters.commercial") || "Комерційна"},
    {key: "premium", label: t("rent.filters.premium") || "Преміум"},
  ];

  const roomOptions = [
    {key: "1", label: "1 кімната"},
    {key: "2", label: "2 кімнати"},
    {key: "3", label: "3 кімнати"},
    {key: "4", label: "4 кімнати"},
    {key: "5", label: "5+ кімнат"},
  ];

  const floorOptions = [
    {key: "1", label: "1 поверх"},
    {key: "2", label: "2 поверх"},
    {key: "3", label: "3 поверх"},
    {key: "4", label: "4 поверх"},
    {key: "5", label: "5+ поверх"},
  ];

  const currencies = [
    {key: "EUR", label: "EUR", icon: IconCurrencyEuro},
    {key: "USD", label: "USD", icon: IconCurrencyDollar},
    {key: "UAH", label: "₴ UAH", icon: IconCurrency},
  ];
  
  // States
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [areaMin, setAreaMin] = useState("");
  const [areaMax, setAreaMax] = useState("");
  const [rooms, setRooms] = useState("all");
  const [floor, setFloor] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  
  // Drawer для фільтрів
  const {isOpen: isFiltersOpen, onOpen: onFiltersOpen, onOpenChange: onFiltersOpenChange} = useDisclosure();
  
  // Modal для карти
  const {isOpen: isMapOpen, onOpen: onMapOpen, onOpenChange: onMapOpenChange} = useDisclosure();

  // Пагінація
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const currentItems = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Фейкові дані нерухомості для оренди з координатами
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
      coordinates: { lat: 48.2975, lng: 25.9322 },
      description: "Простора квартира з сучасним ремонтом для довгострокової оренди",
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&h=600&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=center"
      ],
      tags: ["індивідуальне опалення", "новобудова", "панорамні вікна", "без посередників"],
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
      coordinates: { lat: 48.2922, lng: 25.9285 },
      description: "Приміщення на першому поверсі з окремим входом, ідеально для офісу",
      images: [
        "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800&h=600&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&crop=center"
      ],
      tags: ["центр", "окремий вхід", "вітрини", "паркінг"],
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
      coordinates: { lat: 48.3156, lng: 25.9012 },
      description: "Двоповерховий будинок з прибудинковою ділянкою для сімейної оренди",
      images: [
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800&h=600&fit=crop&crop=center"
      ],
      tags: ["окремий будинок", "гараж", "власна ділянка", "для сім'ї"],
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
      coordinates: { lat: 48.2889, lng: 25.9350 },
      description: "Компактна квартира поруч з університетом, ідеально для студентів",
      images: [
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1534889156217-d643df14f14a?w=800&h=600&fit=crop&crop=center"
      ],
      tags: ["студентський район", "ремонт", "меблі", "для студентів"],
    },
    {
      id: "5",
      title: "Офіс в бізнес-центрі",
      type: "commercial",
      status: "active",
      isFeatured: true,
      price: 1200,
      currency: "EUR",
      address: "вул. Героїв Майдану, 172, Чернівці",
      area: 120.0,
      floor: 3,
      totalFloors: 7,
      coordinates: { lat: 48.2945, lng: 25.9280 },
      description: "Сучасний офіс з ремонтом в престижному бізнес-центрі",
      images: [
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=800&h=600&fit=crop&crop=center"
      ],
      tags: ["офіс", "бізнес-центр", "ремонт", "престижний"],
    },
    {
      id: "6",
      title: "3-кімнатна квартира з ремонтом",
      type: "apartment",
      status: "active",
      isFeatured: false,
      price: 550,
      currency: "EUR",
      address: "вул. Південно-Кільцева, 12, Чернівці",
      area: 78.5,
      rooms: 3,
      floor: 4,
      totalFloors: 9,
      coordinates: { lat: 48.2856, lng: 25.9401 },
      description: "Простора квартира в спальному районі для сімейної оренди",
      images: [
        "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&h=600&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1560185009-5bf9f2849488?w=800&h=600&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1585412459292-166763d72053?w=800&h=600&fit=crop&crop=center"
      ],
      tags: ["якісний ремонт", "спальний район", "гарне планування", "для сім'ї"],
    },
    {
      id: "7",
      title: "Котедж з басейном в оренду",
      type: "house",
      status: "active",
      isFeatured: true,
      price: 1500,
      currency: "EUR",
      address: "вул. Яблунева, 5, с. Чорнівка, Чернівецький район",
      area: 210.0,
      rooms: 5,
      totalFloors: 2,
      coordinates: { lat: 48.3201, lng: 25.8956 },
      description: "Розкішний котедж з басейном для VIP оренди",
      images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop&crop=center"
      ],
      tags: ["преміум", "басейн", "гараж", "VIP"],
    },
    {
      id: "8",
      title: "Студія в центрі міста",
      type: "apartment",
      status: "active",
      isFeatured: false,
      price: 300,
      currency: "EUR",
      address: "вул. Центральна, 8, Чернівці",
      area: 25.0,
      rooms: 1,
      floor: 6,
      totalFloors: 10,
      coordinates: { lat: 48.2934, lng: 25.9301 },
      description: "Компактна студія в серці міста для молодих професіоналів",
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=center"
      ],
      tags: ["студія", "центр", "новобудова", "молодим"],
    },
    {
      id: "9",
      title: "Торгове приміщення в оренду",
      type: "commercial",
      status: "active",
      isFeatured: false,
      price: 400,
      currency: "EUR",
      address: "вул. Промислова, 15, Чернівці",
      area: 65.0,
      floor: 1,
      totalFloors: 2,
      coordinates: { lat: 48.2798, lng: 25.9456 },
      description: "Приміщення для торгівлі в районі з високою прохідністю",
      images: [
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&crop=center"
      ],
      tags: ["торгівля", "проходимість", "парковка", "бізнес"],
    },
    {
      id: "10",
      title: "2-кімнатна квартира з балконом",
      type: "apartment",
      status: "active",
      isFeatured: false,
      price: 400,
      currency: "EUR",
      address: "вул. Льва Толстого, 3, Чернівці",
      area: 55.0,
      rooms: 2,
      floor: 5,
      totalFloors: 9,
      coordinates: { lat: 48.2823, lng: 25.9378 },
      description: "Квартира з великим балконом в тихому районі міста",
      images: [
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop&crop=center"
      ],
      tags: ["балкон", "тихий район", "парк поруч", "зручно"],
    }
  ];

  // Завантаження даних та URL параметрів
  useEffect(() => {
    setProperties(dummyProperties);
    setFilteredProperties(dummyProperties);

    // Зчитуємо параметри з URL
    const { type, category, price_min, price_max, rooms: urlRooms } = router.query;
    
    if (type && typeof type === "string" && type === "commercial") {
      setFilterCategory("commercial");
    }
    if (category && typeof category === "string") {
      setFilterCategory(category);
    }
    if (price_min && typeof price_min === "string") {
      setPriceMin(price_min);
    }
    if (price_max && typeof price_max === "string") {
      setPriceMax(price_max);
    }
    if (urlRooms && typeof urlRooms === "string") {
      setRooms(urlRooms);
    }
  }, [router.query]);

  // Фільтрація властивостей
  useEffect(() => {
    let result = [...properties];

    // Пошук за назвою та адресою
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (property) =>
          property.title.toLowerCase().includes(term) ||
          property.address.toLowerCase().includes(term) ||
          property.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    }

    // Фільтр за категорією
    if (filterCategory !== "all") {
      if (filterCategory === "daily") {
        result = result.filter((property) => property.price < 100);
      } else if (filterCategory === "longterm") {
        result = result.filter((property) => property.price >= 200 && property.price <= 1000);
      } else if (filterCategory === "commercial") {
        result = result.filter((property) => property.type === "commercial");
      } else if (filterCategory === "premium") {
        result = result.filter((property) => property.price > 1000 || property.tags.includes("преміум") || property.tags.includes("VIP"));
      }
    }

    // Фільтр за ціною
    const minPrice = priceMin ? parseFloat(priceMin) : 0;
    const maxPrice = priceMax ? parseFloat(priceMax) : Infinity;
    result = result.filter(
      (property) => property.price >= minPrice && property.price <= maxPrice
    );

    // Фільтр за площею
    const minArea = areaMin ? parseFloat(areaMin) : 0;
    const maxArea = areaMax ? parseFloat(areaMax) : Infinity;
    result = result.filter(
      (property) => property.area >= minArea && property.area <= maxArea
    );

    // Фільтр за кількістю кімнат
    if (rooms !== "all") {
      const roomCount = parseInt(rooms);
      result = result.filter((property) => property.rooms === roomCount);
    }

    setFilteredProperties(result);
    setCurrentPage(1);
  }, [searchTerm, filterCategory, priceMin, priceMax, areaMin, areaMax, rooms, properties]);

  // Форматування ціни
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("uk-UA", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price) + "/міс";
  };

  // Компонент реальної Google Maps
  const MapComponent = () => {
    const handleMarkerClick = (property: any) => {
      console.log("Клік по маркеру:", property.title);
      // Тут можна додати логіку відкриття деталей об'єкта
    };

  return (
      <OpenStreetMap
        properties={currentItems
          .filter(property => property.coordinates) // Фільтруємо тільки об'єкти з координатами
          .map(property => ({
            id: property.id,
            title: property.title,
            coordinates: property.coordinates!,
            price: property.price,
            currency: property.currency,
            type: property.type,
          }))}
        center={{ lat: 48.2909, lng: 25.9314 }} // vul. Nebesnoyi Sotni, 8, Chernivtsi
        zoom={13}
        className="w-full h-full"
        onMarkerClick={handleMarkerClick}
      />
    );
  };

  // Компонент картки властивості
  const PropertyCard = ({ property }: { property: Property }) => {
    return (
      <Card className="w-full">
      <CardBody className="p-0">
        <div className="relative h-48 w-full">
                  <Image
                    src={property.images[0] || "/img/placeholder.jpg"}
                    alt={property.title}
                    fill
            className="object-cover rounded-t-lg"
                  />
                  {property.isFeatured && (
            <Chip className="absolute top-2 left-2" color="warning" variant="solid" size="sm">
                      {t("rent.featured")}
            </Chip>
                  )}
          <div className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white px-2 py-1 rounded text-sm font-bold shadow-lg">
                      {formatPrice(property.price, property.currency)}
                  </div>
                </div>
                <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">{property.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mb-2">
                    <IconMapPin size={16} className="mr-1 flex-shrink-0" />
                    <span className="line-clamp-1">{property.address}</span>
                  </p>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 space-x-3 mb-3">
                    <span className="flex items-center">
                      <IconRuler size={16} className="mr-1" />
                      {property.area} м²
                    </span>
                    {property.rooms && (
                      <span className="flex items-center">
                        <IconHome size={16} className="mr-1" />
                        {property.rooms} кімн.
                      </span>
                    )}
                  </div>
          <div className="flex flex-wrap gap-1">
            {property.tags.slice(0, 2).map((tag, index) => (
              <Chip key={index} size="sm" variant="flat">
                {tag}
              </Chip>
            ))}
          </div>
        </div>
      </CardBody>
      <CardFooter className="pt-0">
        <Button 
          as={Link}
          href={`/rent/${property.id}`}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all duration-300"
          size="sm"
        >
          {t("rent.details")}
        </Button>
      </CardFooter>
      </Card>
    );
  };

  return (
    <DefaultLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Пошук та основні кнопки */}
        <div className="mb-6 space-y-4">
          {/* Рядок з пошуком та кнопкою */}
          <div className="flex gap-3">
            <Input
              className="flex-1"
              placeholder={t("rent.searchPlaceholder") || "Пошук за назвою, адресою, тегами..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startContent={<IconSearch size={20} />}
              size="lg"
            />
            <Button 
              color="primary"
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all duration-300 px-8"
            >
              Шукати
            </Button>
          </div>

          {/* Кнопки фільтрів та режимів */}
          <div className="flex gap-3">
            <Button 
              onPress={onFiltersOpen}
              startContent={<IconFilter size={20} />}
              variant="flat"
            >
              Фільтри
            </Button>
            
            {/* Кнопка режимів - тільки для десктопу */}
            <Button 
              isIconOnly
              onPress={() => {
                const modes: ViewMode[] = ["split", "map", "grid"];
                const currentIndex = modes.indexOf(viewMode);
                const nextIndex = (currentIndex + 1) % modes.length;
                setViewMode(modes[nextIndex]);
              }}
              variant="flat"
              className="hidden lg:flex"
            >
              {/* Показуємо іконку НАСТУПНОГО режиму, а не поточного */}
              {viewMode === "split" && <IconMap size={20} />}
              {viewMode === "map" && <IconGrid3x3 size={20} />}
              {viewMode === "grid" && <IconLayoutSidebarRightExpand size={20} />}
            </Button>
          </div>

          {/* Плаваюча кнопка карти для мобільних */}
          <Button
            isIconOnly
            onPress={onMapOpen}
            className="lg:hidden fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300"
            size="lg"
            radius="full"
          >
            <IconMap size={24} />
          </Button>

          {/* Результати пошуку */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("rent.resultsCount")} {filteredProperties.length} {t("rent.properties")}
            </p>
          </div>
        </div>

        {/* Drawer з фільтрами */}
        <Drawer isOpen={isFiltersOpen} onOpenChange={onFiltersOpenChange} size="lg">
          <DrawerContent>
            {(onClose) => (
              <>
                <DrawerHeader className="flex flex-col gap-1">
                  <h2 className="text-xl font-semibold">Фільтри пошуку</h2>
                  <p className="text-sm text-gray-500">Налаштуйте параметри для пошуку нерухомості в оренду</p>
                </DrawerHeader>
                <DrawerBody>
                  <div className="space-y-6">
                    {/* Категорія оренди */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Категорія оренди</label>
                      <Autocomplete
                        defaultItems={rentCategories}
                        placeholder="Оберіть категорію"
                        selectedKey={filterCategory !== "all" ? filterCategory : null}
                        onSelectionChange={(key) => {
                          setFilterCategory(key ? key as string : "all");
                        }}
                      >
                        {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
                      </Autocomplete>
                    </div>

                    {/* Кількість кімнат */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Кількість кімнат</label>
                      <Autocomplete
                        defaultItems={roomOptions}
                        placeholder="Оберіть кількість кімнат"
                        selectedKey={rooms !== "all" ? rooms : null}
                        onSelectionChange={(key) => {
                          setRooms(key ? key as string : "all");
                        }}
                      >
                        {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
                      </Autocomplete>
                    </div>

                    {/* Поверх */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Поверх</label>
                      <Autocomplete
                        defaultItems={floorOptions}
                        placeholder="Оберіть поверх"
                        selectedKey={floor || null}
                        onSelectionChange={(key) => {
                          setFloor(key ? key as string : "");
                        }}
                      >
                        {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
                      </Autocomplete>
                    </div>

                    {/* Валюта */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Валюта</label>
                      <Tabs 
                        aria-label="Currency options"
                        selectedKey={currency}
                        onSelectionChange={(key) => setCurrency(key as string)}
                        variant="bordered"
                      >
                        {currencies.map((curr) => (
                          <Tab 
                            key={curr.key} 
                            title={
                              <div className="flex items-center space-x-2">
                                <curr.icon size={16} />
                                <span>{curr.label}</span>
                              </div>
                            }
                          />
                        ))}
                      </Tabs>
                    </div>

                    {/* Ціна за місяць */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Оренда на місяць ({currency})</label>
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Від"
                          value={priceMin}
                          onChange={(e) => setPriceMin(e.target.value)}
                          type="number"
                          startContent={<span className="text-gray-400 text-sm">{currency}</span>}
                        />
                        <Input
                          placeholder="До"
                          value={priceMax}
                          onChange={(e) => setPriceMax(e.target.value)}
                          type="number"
                          startContent={<span className="text-gray-400 text-sm">{currency}</span>}
                        />
                      </div>
                    </div>

                    {/* Площа */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Площа (м²)</label>
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Від"
                          value={areaMin}
                          onChange={(e) => setAreaMin(e.target.value)}
                          type="number"
                          endContent={<span className="text-gray-400 text-sm">м²</span>}
                        />
                        <Input
                          placeholder="До"
                          value={areaMax}
                          onChange={(e) => setAreaMax(e.target.value)}
                          type="number"
                          endContent={<span className="text-gray-400 text-sm">м²</span>}
                        />
                  </div>
                    </div>
                  </div>
                </DrawerBody>
                <DrawerFooter>
                  <Button 
                    color="danger" 
                    variant="light" 
                    onPress={() => {
                      // Скинути всі фільтри
                      setFilterCategory("all");
                      setRooms("all");
                      setFloor("");
                      setPriceMin("");
                      setPriceMax("");
                      setAreaMin("");
                      setAreaMax("");
                      setCurrency("EUR");
                    }}
                  >
                    Скинути
                  </Button>
                  <Button 
                    color="primary" 
                    onPress={onClose}
                    className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all duration-300"
                  >
                    Застосувати
                  </Button>
                </DrawerFooter>
              </>
            )}
          </DrawerContent>
        </Drawer>

        {/* Основний контент */}
        <div className="min-h-screen">
          {/* Мобільна версія - тільки сітка */}
          <div className="lg:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4">
              {currentItems.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center px-4 pb-20">
                <Pagination
                  loop
                  showControls
                  page={currentPage}
                  total={totalPages}
                  onChange={setCurrentPage}
                  classNames={{
                    wrapper: "gap-0 overflow-visible h-8",
                    item: "w-8 h-8 text-small bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20",
                    cursor: "bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold shadow-lg",
                    prev: "hover:bg-blue-50 dark:hover:bg-blue-900/20",
                    next: "hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  }}
                />
              </div>
            )}
          </div>

          {/* Десктопна версія */}
          <div className="hidden lg:block">
            {viewMode === "split" && (
              <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] h-screen">
                {/* Ліва частина - список */}
                <div className="h-screen flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {currentItems.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                      ))}
                    </div>
                  </div>
                  {totalPages > 1 && (
                    <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-center">
                      <Pagination
                        loop
                        showControls
                        page={currentPage}
                        total={totalPages}
                        onChange={setCurrentPage}
                        classNames={{
                          wrapper: "gap-0 overflow-visible h-8",
                          item: "w-8 h-8 text-small bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20",
                          cursor: "bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold shadow-lg",
                          prev: "hover:bg-blue-50 dark:hover:bg-blue-900/20",
                          next: "hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        }}
                      />
                    </div>
                  )}
                </div>
                
                {/* Права частина - карта */}
                <div className="h-screen sticky top-0">
                  <MapComponent />
                </div>
              </div>
            )}
          </div>

          {viewMode === "map" && (
            <div className="h-screen">
              <MapComponent />
            </div>
          )}

          {viewMode === "grid" && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentItems.map((property) => (
                  <PropertyCard key={property.id} property={property} />
            ))}
          </div>
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    loop
                    showControls
                    page={currentPage}
                    total={totalPages}
                    onChange={setCurrentPage}
                    classNames={{
                      wrapper: "gap-0 overflow-visible h-8",
                                              item: "w-8 h-8 text-small bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20",
                      cursor: "bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold shadow-lg",
                      prev: "hover:bg-blue-50 dark:hover:bg-blue-900/20",
                      next: "hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {filteredProperties.length === 0 && (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <IconHome className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">
                {t("rent.noPropertiesFound")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t("rent.tryDifferentFilters")}
              </p>
            </div>
          )}
        </div>

        {/* Модальне вікно з картою для мобільних */}
        <Modal 
          isOpen={isMapOpen} 
          onOpenChange={onMapOpenChange}
          size="full"
          hideCloseButton={false}
          className="lg:hidden"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 bg-white dark:bg-gray-900 border-b">
                  <h2 className="text-lg font-semibold">Карта об'єктів</h2>
                  <p className="text-sm text-gray-500">{filteredProperties.length} об'єктів на карті</p>
                </ModalHeader>
                <ModalBody className="p-0">
                  <div className="h-full w-full">
                    <MapComponent />
                  </div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </DefaultLayout>
  );
}