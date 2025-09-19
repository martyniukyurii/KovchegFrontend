"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
  Select,
  SelectItem,
  Button,
  Divider,
  Checkbox,
  RadioGroup,
  Radio,
} from "@heroui/react";
import { useTranslation } from "@/hooks/useTranslation";
import { IconUser, IconHome, IconMapPin, IconPhone, IconMail } from "@tabler/icons-react";

interface FormData {
  // Інформація про продавця
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
  
  // Інформація про нерухомість
  propertyType: string;
  propertyAddress: string;
  propertyCity: string;
  propertyArea: string;
  propertyRooms: string;
  propertyFloor: string;
  propertyTotalFloors: string;
  propertyYearBuilt: string;
  propertyCondition: string;
  propertyPrice: string;
  propertyDescription: string;
  
  // Додаткові параметри
  hasBalcony: boolean;
  hasParking: boolean;
  hasElevator: boolean;
  hasSecurity: boolean;
  
  // Земельна ділянка (якщо є)
  landArea: string;
  landType: string;
  
  // Тип послуги
  serviceType: string;
  
  // Додаткова інформація
  additionalInfo: string;
  preferredContactTime: string;
  urgentSale: boolean;
}

export function SellPropertyForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    sellerName: "",
    sellerPhone: "",
    sellerEmail: "",
    propertyType: "",
    propertyAddress: "",
    propertyCity: "",
    propertyArea: "",
    propertyRooms: "",
    propertyFloor: "",
    propertyTotalFloors: "",
    propertyYearBuilt: "",
    propertyCondition: "",
    propertyPrice: "",
    propertyDescription: "",
    hasBalcony: false,
    hasParking: false,
    hasElevator: false,
    hasSecurity: false,
    landArea: "",
    landType: "",
    serviceType: "evaluation",
    additionalInfo: "",
    preferredContactTime: "anytime",
    urgentSale: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Встановлюємо тип послуги на основі URL параметрів
  useEffect(() => {
    if (router.query.service) {
      const serviceMap: { [key: string]: string } = {
        evaluation: "evaluation",
        list: "full_service", 
        consultation: "consultation",
        fast: "fast_sale"
      };
      
      const serviceType = serviceMap[router.query.service as string] || "evaluation";
      setFormData(prev => ({
        ...prev,
        serviceType
      }));
    }
  }, [router.query.service]);

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Тут буде логіка відправки форми
      console.log("Form data:", formData);
      
      // Симуляція відправки
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(t("sell.form.submitSuccess"));
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(t("sell.form.submitError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const propertyTypes = [
    { key: "apartment", label: t("sell.form.propertyTypes.apartment") },
    { key: "house", label: t("sell.form.propertyTypes.house") },
    { key: "commercial", label: t("sell.form.propertyTypes.commercial") },
    { key: "land", label: t("sell.form.propertyTypes.land") },
  ];

  const conditionTypes = [
    { key: "excellent", label: t("sell.form.conditions.excellent") },
    { key: "good", label: t("sell.form.conditions.good") },
    { key: "satisfactory", label: t("sell.form.conditions.satisfactory") },
    { key: "needs_renovation", label: t("sell.form.conditions.needsRenovation") },
  ];

  const serviceTypes = [
    { key: "evaluation", label: t("sell.form.services.evaluation") },
    { key: "consultation", label: t("sell.form.services.consultation") },
    { key: "fast_sale", label: t("sell.form.services.fastSale") },
    { key: "full_service", label: t("sell.form.services.fullService") },
  ];

  const contactTimes = [
    { key: "morning", label: t("sell.form.contactTimes.morning") },
    { key: "afternoon", label: t("sell.form.contactTimes.afternoon") },
    { key: "evening", label: t("sell.form.contactTimes.evening") },
    { key: "anytime", label: t("sell.form.contactTimes.anytime") },
  ];

  const landTypes = [
    { key: "residential", label: t("sell.form.landTypes.residential") },
    { key: "commercial", label: t("sell.form.landTypes.commercial") },
    { key: "agricultural", label: t("sell.form.landTypes.agricultural") },
    { key: "industrial", label: t("sell.form.landTypes.industrial") },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Інформація про продавця */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-900/20">
        <CardHeader className="flex gap-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-t-xl -m-1 mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <IconUser className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{t("sell.form.sellerInfo.title")}</h3>
            <p className="text-sm text-blue-100">{t("sell.form.sellerInfo.subtitle")}</p>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t("sell.form.sellerInfo.name")}
              placeholder={t("sell.form.sellerInfo.namePlaceholder")}
              value={formData.sellerName}
              onChange={(e) => handleInputChange("sellerName", e.target.value)}
              isRequired
              startContent={<IconUser className="h-4 w-4 text-default-400" />}
            />
            <Input
              label={t("sell.form.sellerInfo.phone")}
              placeholder={t("sell.form.sellerInfo.phonePlaceholder")}
              value={formData.sellerPhone}
              onChange={(e) => handleInputChange("sellerPhone", e.target.value)}
              isRequired
              startContent={<IconPhone className="h-4 w-4 text-default-400" />}
            />
          </div>
          <Input
            label={t("sell.form.sellerInfo.email")}
            placeholder={t("sell.form.sellerInfo.emailPlaceholder")}
            type="email"
            value={formData.sellerEmail}
            onChange={(e) => handleInputChange("sellerEmail", e.target.value)}
            isRequired
            startContent={<IconMail className="h-4 w-4 text-default-400" />}
          />
        </CardBody>
      </Card>

      {/* Тип послуги */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-900/20">
        <CardHeader className="flex gap-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-t-xl -m-1 mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{t("sell.form.serviceType.title")}</h3>
            <p className="text-sm text-blue-100">{t("sell.form.serviceType.subtitle")}</p>
          </div>
        </CardHeader>
        <CardBody>
          <RadioGroup
            value={formData.serviceType}
            onValueChange={(value) => handleInputChange("serviceType", value)}
            orientation="horizontal"
            className="grid grid-cols-2 gap-4"
          >
            {serviceTypes.map((service) => (
              <Radio 
                key={service.key} 
                value={service.key} 
                className="p-4 border-2 border-blue-200 hover:border-blue-400 rounded-xl transition-all duration-200 hover:shadow-md bg-white/50 hover:bg-blue-50/50"
              >
                <div className="text-sm">
                  <div className="font-semibold text-gray-800 dark:text-gray-200">{service.label}</div>
                  <div className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                    {t(`sell.form.services.${service.key}Description`)}
                  </div>
                </div>
              </Radio>
            ))}
          </RadioGroup>
        </CardBody>
      </Card>

      {/* Інформація про нерухомість */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-900/20">
        <CardHeader className="flex gap-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-t-xl -m-1 mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <IconHome className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{t("sell.form.propertyInfo.title")}</h3>
            <p className="text-sm text-blue-100">{t("sell.form.propertyInfo.subtitle")}</p>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label={t("sell.form.propertyInfo.type")}
              placeholder={t("sell.form.propertyInfo.typePlaceholder")}
              value={formData.propertyType}
              onSelectionChange={(value) => handleInputChange("propertyType", value as string)}
              isRequired
            >
              {propertyTypes.map((type) => (
                <SelectItem key={type.key}>
                  {type.label}
                </SelectItem>
              ))}
            </Select>
            
            <Input
              label={t("sell.form.propertyInfo.city")}
              placeholder={t("sell.form.propertyInfo.cityPlaceholder")}
              value={formData.propertyCity}
              onChange={(e) => handleInputChange("propertyCity", e.target.value)}
              isRequired
              startContent={<IconMapPin className="h-4 w-4 text-default-400" />}
            />
          </div>

          <Input
            label={t("sell.form.propertyInfo.address")}
            placeholder={t("sell.form.propertyInfo.addressPlaceholder")}
            value={formData.propertyAddress}
            onChange={(e) => handleInputChange("propertyAddress", e.target.value)}
            isRequired
            startContent={<IconMapPin className="h-4 w-4 text-default-400" />}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label={t("sell.form.propertyInfo.area")}
              placeholder="м²"
              type="number"
              value={formData.propertyArea}
              onChange={(e) => handleInputChange("propertyArea", e.target.value)}
              isRequired
            />
            <Input
              label={t("sell.form.propertyInfo.rooms")}
              placeholder="2"
              type="number"
              value={formData.propertyRooms}
              onChange={(e) => handleInputChange("propertyRooms", e.target.value)}
            />
            <Input
              label={t("sell.form.propertyInfo.price")}
              placeholder="₴"
              type="number"
              value={formData.propertyPrice}
              onChange={(e) => handleInputChange("propertyPrice", e.target.value)}
            />
          </div>

          {formData.propertyType === "apartment" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label={t("sell.form.propertyInfo.floor")}
                placeholder="4"
                type="number"
                value={formData.propertyFloor}
                onChange={(e) => handleInputChange("propertyFloor", e.target.value)}
              />
              <Input
                label={t("sell.form.propertyInfo.totalFloors")}
                placeholder="9"
                type="number"
                value={formData.propertyTotalFloors}
                onChange={(e) => handleInputChange("propertyTotalFloors", e.target.value)}
              />
              <Input
                label={t("sell.form.propertyInfo.yearBuilt")}
                placeholder="2020"
                type="number"
                value={formData.propertyYearBuilt}
                onChange={(e) => handleInputChange("propertyYearBuilt", e.target.value)}
              />
            </div>
          )}

          {formData.propertyType === "land" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t("sell.form.propertyInfo.landArea")}
                placeholder="10"
                type="number"
                value={formData.landArea}
                onChange={(e) => handleInputChange("landArea", e.target.value)}
              />
              <Select
                label={t("sell.form.propertyInfo.landType")}
                placeholder={t("sell.form.propertyInfo.landTypePlaceholder")}
                value={formData.landType}
                onSelectionChange={(value) => handleInputChange("landType", value as string)}
              >
                {landTypes.map((type) => (
                  <SelectItem key={type.key}>
                    {type.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          )}

          <Select
            label={t("sell.form.propertyInfo.condition")}
            placeholder={t("sell.form.propertyInfo.conditionPlaceholder")}
            value={formData.propertyCondition}
            onSelectionChange={(value) => handleInputChange("propertyCondition", value as string)}
            isRequired
          >
            {conditionTypes.map((condition) => (
              <SelectItem key={condition.key}>
                {condition.label}
              </SelectItem>
            ))}
          </Select>

          <Textarea
            label={t("sell.form.propertyInfo.description")}
            placeholder={t("sell.form.propertyInfo.descriptionPlaceholder")}
            value={formData.propertyDescription}
            onChange={(e) => handleInputChange("propertyDescription", e.target.value)}
            minRows={3}
          />
        </CardBody>
      </Card>

      {/* Додаткові зручності */}
      {formData.propertyType !== "land" && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-900/20">
          <CardHeader className="flex gap-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-t-xl -m-1 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{t("sell.form.amenities.title")}</h3>
              <p className="text-sm text-blue-100">Оберіть доступні зручності</p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-blue-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200">
                <Checkbox
                  isSelected={formData.hasBalcony}
                  onValueChange={(checked) => handleInputChange("hasBalcony", checked)}
                  color="primary"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("sell.form.amenities.balcony")}
                </span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-blue-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200">
                <Checkbox
                  isSelected={formData.hasParking}
                  onValueChange={(checked) => handleInputChange("hasParking", checked)}
                  color="primary"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("sell.form.amenities.parking")}
                </span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-blue-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200">
                <Checkbox
                  isSelected={formData.hasElevator}
                  onValueChange={(checked) => handleInputChange("hasElevator", checked)}
                  color="primary"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("sell.form.amenities.elevator")}
                </span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-blue-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200">
                <Checkbox
                  isSelected={formData.hasSecurity}
                  onValueChange={(checked) => handleInputChange("hasSecurity", checked)}
                  color="primary"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("sell.form.amenities.security")}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Додаткова інформація */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-900/20">
        <CardHeader className="flex gap-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-t-xl -m-1 mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{t("sell.form.additionalInfo.title")}</h3>
            <p className="text-sm text-blue-100">Додаткові деталі та побажання</p>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <Select
            label={t("sell.form.additionalInfo.preferredContactTime")}
            placeholder={t("sell.form.additionalInfo.preferredContactTimePlaceholder")}
            value={formData.preferredContactTime}
            onSelectionChange={(value) => handleInputChange("preferredContactTime", value as string)}
          >
            {contactTimes.map((time) => (
              <SelectItem key={time.key}>
                {time.label}
              </SelectItem>
            ))}
          </Select>

          <Checkbox
            isSelected={formData.urgentSale}
            onValueChange={(checked) => handleInputChange("urgentSale", checked)}
          >
            {t("sell.form.additionalInfo.urgentSale")}
          </Checkbox>

          <Textarea
            label={t("sell.form.additionalInfo.additionalInfo")}
            placeholder={t("sell.form.additionalInfo.additionalInfoPlaceholder")}
            value={formData.additionalInfo}
            onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
            minRows={3}
          />
        </CardBody>
      </Card>

      {/* Кнопка відправки */}
      <div className="flex justify-center pt-8">
        <Button
          type="submit"
          size="lg"
          className="px-12 py-6 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          isLoading={isSubmitting}
        >
          {!isSubmitting && (
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
          {t("sell.form.submitButton")}
        </Button>
      </div>
    </form>
  );
}
