import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Ticket, Shirt, Clock, Tv, Heart, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: '初めてのラグビー観戦ガイド',
  description: 'ラグビー観戦が初めてでも安心。チケットの取り方から持ち物、試合の楽しみ方まで、ライゾウとリッチーくんが会話形式でやさしく解説します。',
  keywords: ['ラグビー観戦', '初心者', '観戦ガイド', 'スタジアム', 'チケット', '持ち物'],
  openGraph: {
    title: '初めてのラグビー観戦ガイド',
    description: 'ラグビー観戦が初めてでも安心。チケットの取り方から持ち物、試合の楽しみ方まで。',
    images: [{ url: '/raizo_with_ball.png', width: 1200, height: 630, alt: 'ラグビー観戦ガイド' }],
  },
};

function Chat({ speaker, children }: { speaker: 'raizo' | 'richie'; children: React.ReactNode }) {
  const isRaizo = speaker === 'raizo';
  return (
    <div className={`flex items-start gap-3 ${isRaizo ? '' : 'flex-row-reverse'}`}>
      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
        <Image
          src={isRaizo ? '/icons/raizo.png' : '/icons/richie.png'}
          alt={isRaizo ? 'ライゾウ' : 'リッチーくん'}
          width={40} height={40}
          className="w-full h-full object-cover"
        />
      </div>
      <div className={`${isRaizo ? 'bg-blue-50 rounded-lg rounded-tl-none' : 'bg-gray-100 rounded-lg rounded-tr-none text-right'} px-4 py-2.5 max-w-[85%]`}>
        <p className="text-sm text-gray-700">{children}</p>
      </div>
    </div>
  );
}

function StepSection({ number, icon, title, children }: { number: number; icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
          {number}
        </div>
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}
