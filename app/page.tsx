'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header mit Logo */}
          <div className="bg-gradient-to-r from-brand-primary to-brand-hover px-6 sm:px-8 lg:px-12 py-8 sm:py-10">
            {/* Sprachauswahl */}
            <div className="flex justify-end mb-4">
              <LanguageSwitcher />
            </div>

            <div className="flex items-center justify-center mb-6">
              <Image
              src="/logo.png"
              alt="Hotel Harburger Hof Logo"
              width={140}
              height={140}
              className="rounded p-1 w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center">
              Hotel Harburger Hof
            </h1>
            <p className="text-white text-opacity-80 text-center mt-3 text-base sm:text-lg">
              Schloßmühlendamm 16, 21073 Hamburg
            </p>
          </div>

          {/* Hauptinhalt */}
          <div className="px-6 sm:px-8 lg:px-12 py-8 sm:py-10 lg:py-12">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800 mb-6">
                {t.home.title}
              </h2>
              <p className="text-gray-600 leading-relaxed text-base sm:text-lg lg:text-xl max-w-3xl mx-auto">
                {t.home.greeting}
                <br />
                {t.home.description}
                <br />
                <br />
                {t.home.thankYou}
              </p>
            </div>

            {/* Call-to-Action Button */}
            <div className="text-center">
              <Link
                href="/form/hotel-harburger-hof"
                className="inline-flex items-center px-8 sm:px-12 py-4 sm:py-5 bg-brand-primary hover:bg-brand-hover text-white font-semibold text-base sm:text-lg rounded-lg shadow-lg transform transition duration-200 hover:scale-105"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {t.home.fillOutButton}
              </Link>
            </div>
          </div>

          {/* Footer Info */}
          <div className="bg-gray-50 px-6 sm:px-8 lg:px-12 py-6 border-t">
            <div className="text-sm sm:text-base text-gray-500 text-center space-y-3">
              <p>{t.home.contact}</p>
              <p className="text-xs sm:text-sm">
                {t.home.privacyNotice}{' '}
                <a
                  href="https://www.hhhof.de/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-primary hover:text-brand-hover underline font-medium"
                >
                  {t.home.privacyLink}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
