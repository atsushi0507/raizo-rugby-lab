import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://raizo-rugby-lab.com'),
  title: {
    default: 'ライゾウのラグビーラボ',
    template: "%s | ライゾウのラグビーラボ"
  },
  description: 'ラグビーの観戦体験を深めるための解説・分析メディア。プレーの「なぜ」を理解して、もっと楽しく観戦しよう。',
  keywords: ['ラグビー', 'ラグビー観戦', 'ラグビー解説', 'ラグビー戦術', 'ラグビー分析', 'ラグビールール', 'ラグビーポジション', '観戦ガイド', 'ライゾウ', 'リッチー'],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'ライゾウのラグビーラボ',
    description: 'ラグビーの観戦体験を深めるための解説・分析メディア。プレーの「なぜ」を理解して、もっと楽しく観戦しよう。',
    images: [{ url: '/raizo_with_ball.png', width: 1200, height: 630, alt: 'ライゾウのラグビーラボ' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ライゾウのラグビーラボ',
    description: 'ラグビーの観戦体験を深めるための解説・分析メディア。プレーの「なぜ」を理解して、もっと楽しく観戦しよう。',
    images: ['/raizo_with_ball.png'],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" }
    ],
    apple: "/apple-touch-icon.png"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
