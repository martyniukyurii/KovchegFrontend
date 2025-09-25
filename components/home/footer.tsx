import Link from "next/link";
import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

// TikTok icon component
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  );
}

export function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-12 w-screen relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt={t('common.companyName')} height={32} width={32} />
              <h3 className="text-xl font-bold">{t('common.companyName')}</h3>
            </div>
            <p className="text-white/80">
              {t('footer.tagline')}
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.navigation')}</h4>
            <ul className="space-y-2">
              <li><Link className="text-white/80 hover:text-white transition-colors" href="/buy">{t('nav.buy')}</Link></li>
              <li><Link className="text-white/80 hover:text-white transition-colors" href="/sell">{t('nav.sell')}</Link></li>
              <li><Link className="text-white/80 hover:text-white transition-colors" href="/rent">{t('nav.rent')}</Link></li>
              <li><Link className="text-white/80 hover:text-white transition-colors" href="/about">{t('nav.about')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.contacts')}</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-white/80 hover:text-white transition-colors">
                <Phone className="w-4 h-4 mr-2" />
                <a 
                  href={`tel:${t('footer.phone')}`}
                  className="hover:text-white transition-colors"
                >
                  {t('footer.phone')}
                </a>
              </li>
              <li className="flex items-center text-white/80 hover:text-white transition-colors">
                <Phone className="w-4 h-4 mr-2" />
                <a 
                  href={`tel:${t('footer.phone2')}`}
                  className="hover:text-white transition-colors"
                >
                  {t('footer.phone2')}
                </a>
              </li>
              <li className="flex items-center text-white/80 hover:text-white transition-colors">
                <Mail className="w-4 h-4 mr-2" />
                <a 
                  href={`mailto:${t('footer.email')}`}
                  className="hover:text-white transition-colors"
                >
                  {t('footer.email')}
                </a>
              </li>
              <li className="flex items-center text-white/80 hover:text-white transition-colors">
                <MapPin className="w-4 h-4 mr-2" />
                <a 
                  href={t('footer.googleMapsUrl')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {t('footer.address')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.socialMedia')}</h4>
            <div className="flex space-x-4">
              <Link 
                className="text-white/80 hover:text-white transition-colors"
                href="https://www.facebook.com/vashkovcheg" 
                rel="noopener noreferrer"
                target="_blank"
              >
                <Facebook className="w-6 h-6" />
              </Link>
              <Link 
                className="text-white/80 hover:text-white transition-colors"
                href="https://instagram.com/vashkovcheg"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Instagram className="w-6 h-6" />
              </Link>
              <Link 
                className="text-white/80 hover:text-white transition-colors"
                href="https://www.tiktok.com/@vashkovcheg"
                rel="noopener noreferrer"
                target="_blank"
              >
                <TikTokIcon className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/80">
          <p>&copy; {new Date().getFullYear()} {t('common.companyName')}. {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
} 