'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, Instagram } from 'lucide-react';

const navItems = [
  { path: '/', label: 'ホーム' },
  { path: '/articles', label: '記事一覧' },
  { path: '/rules', label: 'ルール解説' },
  { path: '/positions', label: 'ポジション' },
  { path: '/gallery', label: 'ギャラリー' },
  { path: '/about', label: 'About' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ロゴ */}
          <Link href="/" className="flex items-center space-x-2">
            {logoError ? (
              <span className="font-bold text-xl">ライゾウのラグビーラボ</span>
            ) : (
              <Image
                src="/header_logo.png"
                alt="Rugby Insight"
                width={180}
                height={60}
                onError={() => setLogoError(true)}
              />
            )}
          </Link>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="text-sm font-medium transition-colors hover:text-blue-600 text-gray-700"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Instagram & モバイルメニューボタン */}
          <div className="flex items-center space-x-4">
            <a
              href="https://www.instagram.com/rugby.raizo/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-pink-600 transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700"
              aria-label="メニュー"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* モバイルメニュー */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium transition-colors hover:text-blue-600 text-gray-700"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
