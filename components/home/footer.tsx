import Link from "next/link";
import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

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