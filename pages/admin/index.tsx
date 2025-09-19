import React, { useState, useEffect } from "react";
import {
  Input,
  InputOtp,
  Button,
  Link,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
} from "@heroui/react";
import { FcLock } from "react-icons/fc";
import { FaTelegram } from "react-icons/fa";
import Head from "next/head";
import { useRouter } from "next/router";

import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api-client";
import { TelegramLoginWidget } from "@/components/auth/telegram-login-widget";
import { ThemeSwitch } from "@/components/theme-switch";
import { LanguageSwitch } from "@/components/language-switch";

const AdminPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { login, telegramLogin, isAuthenticated, isLoading: authLoading, error } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formMode, setFormMode] = useState<"login" | "forgotPassword" | "otpVerification" | "newPassword">("login");
  const [isSent, setIsSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Перенаправлення, якщо вже авторизований
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/admin/crm');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('🔄 Спроба входу з:', { email, password: '***' });
    console.log('🌐 API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL);

    try {
      const success = await login({ email, password });
      console.log('✅ Результат входу:', success);
      
      if (success) {
        console.log('✅ Успішний вхід, перенаправляємо...');
      } else {
        console.log('❌ Вхід неуспішний');
        alert('Помилка входу. Перевірте email та пароль.');
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      alert(`Помилка входу: ${err instanceof Error ? err.message : 'Невідома помилка'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Обробка Telegram Login
  const handleTelegramAuth = async (user: any) => {
    console.log('🤖 Telegram user data отримано:', user);
    
    try {
      const success = await telegramLogin({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        photo_url: user.photo_url,
        auth_date: user.auth_date,
        hash: user.hash,
      });

      if (success) {
        console.log('✅ Успішний вхід через Telegram');
      }
    } catch (err) {
      console.error('❌ Telegram login error:', err);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert('Будь ласка, введіть email');
      return;
    }

    setIsLoading(true);
    console.log('🔄 Відновлення пароля для:', email);

    try {
      const response = await apiClient.resetPassword(email, 'uk');
      console.log('📥 Відповідь API resetPassword:', response);

      if (response.status === 'success') {
        setFormMode('otpVerification');
        console.log('✅ Email для відновлення пароля надіслано');
      } else {
        console.log('❌ Помилка відновлення:', response.message);
        alert(response.message || 'Помилка при відправці листа для відновлення пароля');
      }
    } catch (error: any) {
      console.error('❌ Password reset error:', error);
      alert(error.message || 'Помилка мережі. Перевірте підключення та спробуйте ще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      alert('Будь ласка, введіть 6-значний код');
      return;
    }

    setFormMode('newPassword');
  };

  const handleNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      alert('Будь ласка, введіть новий пароль');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.confirmPasswordReset(otpCode, newPassword);
      console.log('📥 Відповідь confirmPasswordReset:', response);

      if (response.status === 'success') {
        alert('Пароль успішно змінено!');
        // Повертаємося до форми входу через 1-2 секунди
        setTimeout(() => {
          setFormMode('login');
          setEmail('');
          setPassword('');
          setOtpCode('');
          setNewPassword('');
          setIsSent(false);
        }, 1500);
      } else {
        alert(response.message || 'Помилка при зміні пароля');
      }
    } catch (error: any) {
      console.error('❌ Password change error:', error);
      alert(error.message || 'Помилка мережі. Перевірте підключення та спробуйте ще раз.');
    } finally {
      setIsLoading(false);
    }
  };



  // Показуємо завантаження поки перевіряється аутентифікація
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Завантаження...</p>
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <Head>
        <title>{`${t("admin.title")} | ${t("common.companyName")}`}</title>
      </Head>
      <div className="min-h-screen flex flex-col p-4 dark:dark-gradient-8 bg-gray-50">
        <div className="w-full flex justify-between items-center mb-4">
          <Link
            href="/"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
              />
            </svg>
            {t("admin.backToHome")}
          </Link>
          <div className="flex gap-2">
            <LanguageSwitch />
            <ThemeSwitch />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md border border-border bg-background/80 backdrop-blur-md">
            <CardHeader className="flex flex-col items-center gap-3 pb-0">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                {formMode === "login" && <FcLock className="w-8 h-8" />}
                {formMode === "forgotPassword" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                )}
                {formMode === "otpVerification" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                )}
                {formMode === "newPassword" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-purple-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                )}
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                {formMode === "login" && t("admin.title")}
                {formMode === "forgotPassword" && t("admin.forgotPasswordTitle")}
                {formMode === "otpVerification" && "Введіть код з email"}
                {formMode === "newPassword" && "Новий пароль"}
              </h1>
              {error && (
                <div className="text-sm text-red-500 text-center bg-red-50 dark:bg-red-900/20 p-2 rounded">
                  {error}
                </div>
              )}
            </CardHeader>
            <CardBody>
              {/* Форма входу */}
              {formMode === "login" && (
                <>
                  <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <Input
                      isRequired
                      label="Email"
                      placeholder="admin@kovcheg.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full"
                    />
                    <Input
                      isRequired
                      label={t("auth.password")}
                      placeholder={t("auth.passwordPlaceholder")}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full"
                    />
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setFormMode("forgotPassword")}
                        className="text-sm text-primary hover:underline bg-transparent border-none cursor-pointer"
                      >
                        {t("admin.forgotPassword")}
                      </button>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all duration-300"
                      isLoading={isLoading}
                      disabled={!email || !password}
                    >
                      {isLoading
                        ? t("admin.loginLoading")
                        : t("admin.loginButton")}
                    </Button>
                  </form>

                  <div className="mt-6">
                    <div className="flex items-center mb-4">
                      <div className="flex-grow h-px bg-border" />
                      <span className="text-xs text-muted-foreground px-2">
                        {t("admin.orLoginWith")}
                      </span>
                      <div className="flex-grow h-px bg-border" />
                    </div>

                    {process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ? (
                      <TelegramLoginWidget
                        botName={process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME}
                        onAuth={handleTelegramAuth}
                        buttonSize="large"
                        lang="uk"
                      />
                    ) : (
                      <div className="w-full p-4 text-center text-sm text-muted-foreground bg-gray-100 dark:bg-gray-800 rounded">
                        Telegram бот не налаштований
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Форма відновлення пароля */}
              {formMode === "forgotPassword" && (
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-muted-foreground text-center">
                    {t("admin.recoveryEmailInfo")}
                  </p>
                  <form
                    onSubmit={handleForgotPassword}
                    className="flex flex-col gap-4"
                  >
                    <Input
                      isRequired
                      label="Email"
                      placeholder="admin@kovcheg.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full"
                    />
                    <div className="flex gap-3 mt-2">
                      <Button
                        type="button"
                        variant="ghost"
                        className="flex-1"
                        onClick={() => setFormMode("login")}
                      >
                        {t("admin.backButton")}
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all duration-300"
                        isLoading={isLoading}
                      >
                        {isLoading
                          ? t("admin.sendLoading")
                          : t("admin.sendButton")}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Форма OTP верифікації */}
              {formMode === "otpVerification" && (
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-muted-foreground text-center">
                    Введіть 6-значний код, який ми надіслали на {email}
                  </p>
                  <form
                    onSubmit={handleOtpVerification}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex flex-col gap-2 items-center">
                      <label className="text-sm font-medium">Код підтвердження</label>
                      <InputOtp
                        length={6}
                        value={otpCode}
                        onValueChange={setOtpCode}
                      />
                    </div>
                    <div className="flex gap-3 mt-4">
                      <Button
                        type="button"
                        variant="ghost"
                        className="flex-1"
                        onClick={() => setFormMode("forgotPassword")}
                      >
                        Назад
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-400 hover:from-green-500 hover:to-green-300 text-white"
                        disabled={otpCode.length !== 6}
                      >
                        Підтвердити
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Форма нового пароля */}
              {formMode === "newPassword" && (
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-muted-foreground text-center">
                    Введіть новий пароль для вашого акаунта
                  </p>
                  <form
                    onSubmit={handleNewPassword}
                    className="flex flex-col gap-4"
                  >
                    <Input
                      isRequired
                      label="Новий пароль"
                      placeholder="Введіть новий пароль"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full"
                    />
                    <div className="flex gap-3 mt-2">
                      <Button
                        type="button"
                        variant="ghost"
                        className="flex-1"
                        onClick={() => setFormMode("otpVerification")}
                      >
                        Назад
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-500 hover:to-purple-300 text-white"
                        isLoading={isLoading}
                        disabled={!newPassword}
                      >
                        {isLoading ? "Зміна пароля..." : "Змінити пароль"}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </CardBody>
            <div className="h-px bg-border" />
            <CardFooter className="flex justify-center pt-2">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} {t("admin.companyName")} •{" "}
                {t("admin.allRightsReserved")}
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AdminPage;
