import React from "react";
import {
  Tabs,
  Tab,
  Input,
  Link,
  Button,
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  useDisclosure,
  Divider,
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

import { useTranslation } from "@/hooks/useTranslation";

export function AuthModal() {
  const { t } = useTranslation();
  const [selected, setSelected] = React.useState<string>("login");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSelectionChange = (key: React.Key) => {
    setSelected(key.toString());
  };

  const tabVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  // Функції для OAuth автентифікації
  const handleGoogleAuth = () => {
    // Тут буде логіка для OAuth з Google
    console.log("Google authentication initiated");
    window.location.href = "/api/auth/google";
  };

  const handleAppleAuth = () => {
    // Тут буде логіка для OAuth з Apple
    console.log("Apple authentication initiated");
    window.location.href = "/api/auth/apple";
  };

  return (
    <>
      <Button
        onPress={onOpen}
        className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all duration-300"
      >
        {t("menu.login")}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent className="bg-background/80 backdrop-blur-md border border-border">
          <ModalHeader className="flex items-center justify-center min-h-[40px] py-0">
            <span className="text-sm text-foreground">{t("auth.title")}</span>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-1 flex-col gap-3 overflow-hidden">
              <Tabs
                fullWidth
                aria-label="Tabs form"
                selectedKey={selected || null}
                size="md"
                onSelectionChange={handleSelectionChange}
                className="flex-1"
              >
                <Tab key="login" title={t("auth.login")}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="login-form"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={tabVariants}
                      className="flex flex-col gap-4"
                    >
                      <Input
                        isRequired
                        label={t("auth.email")}
                        placeholder={t("auth.emailPlaceholder")}
                        type="email"
                      />
                      <Input
                        isRequired
                        label={t("auth.password")}
                        placeholder={t("auth.passwordPlaceholder")}
                        type="password"
                      />
                      <p className="text-center text-sm text-muted-foreground">
                        {t("auth.needAccount")}{" "}
                        <Link
                          size="sm"
                          onPress={() => setSelected("sign-up")}
                          className="cursor-pointer hover:underline"
                        >
                          {t("auth.signUp")}
                        </Link>
                      </p>
                      <div className="flex gap-2 justify-end">
                        <Button
                          fullWidth
                          className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all duration-300"
                        >
                          {t("auth.login")}
                        </Button>
                      </div>

                      <Divider className="my-2" />

                      <div>
                        <p className="text-center text-sm text-muted-foreground mb-3">
                          {t("auth.orLoginWith")}
                        </p>
                        <div className="flex gap-3 justify-center">
                          <Button
                            className="flex-1 bg-white border border-gray-300 hover:bg-gray-100 transition-colors text-black"
                            startContent={<FcGoogle className="text-xl" />}
                            onClick={handleGoogleAuth}
                          >
                            Google
                          </Button>
                          <Button
                            className="flex-1 bg-black text-white hover:bg-gray-900 transition-colors"
                            startContent={<FaApple className="text-xl" />}
                            onClick={handleAppleAuth}
                          >
                            Apple
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </Tab>
                <Tab key="sign-up" title={t("auth.signUp")}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="signup-form"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={tabVariants}
                      className="flex flex-col gap-4"
                    >
                      <Input
                        isRequired
                        label={t("auth.email")}
                        placeholder={t("auth.emailPlaceholder")}
                        type="email"
                      />
                      <Input
                        isRequired
                        label={t("auth.password")}
                        placeholder={t("auth.passwordPlaceholder")}
                        type="password"
                      />
                      <p className="text-center text-sm text-muted-foreground">
                        {t("auth.haveAccount")}{" "}
                        <Link
                          size="sm"
                          onPress={() => setSelected("login")}
                          className="cursor-pointer hover:underline"
                        >
                          {t("auth.login")}
                        </Link>
                      </p>
                      <div className="flex gap-2 justify-end">
                        <Button
                          fullWidth
                          className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all duration-300"
                        >
                          {t("auth.signUp")}
                        </Button>
                      </div>

                      <Divider className="my-2" />

                      <div>
                        <p className="text-center text-sm text-muted-foreground mb-3">
                          {t("auth.orRegisterWith")}
                        </p>
                        <div className="flex gap-3 justify-center">
                          <Button
                            className="flex-1 bg-white border border-gray-300 hover:bg-gray-100 transition-colors text-black"
                            startContent={<FcGoogle className="text-xl" />}
                            onClick={handleGoogleAuth}
                          >
                            Google
                          </Button>
                          <Button
                            className="flex-1 bg-black text-white hover:bg-gray-900 transition-colors"
                            startContent={<FaApple className="text-xl" />}
                            onClick={handleAppleAuth}
                          >
                            Apple
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </Tab>
              </Tabs>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
