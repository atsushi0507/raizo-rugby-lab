import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Eye, GitBranch, Film, Link2, Zap, BookOpen } from 'lucide-react';
import { getPositionById } from '@/lib/mdx';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PositionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const position = await getPositionById(id);

  if (!position) {
    notFound();
  }

  const isForward = position.category === 'フォワード';
  const accentColor = isForward ? 'text-red-700' : 'text-blue-700';
  const accentBg = isForward ? 'bg-red-50' : 'bg-blue-50';
  const accentBorder = isForward ? 'border-red-200' : 'border-blue-200';
  const numberBadge = isForward ? 'bg-red-200 text-red-800' : 'bg-blue-200 text-blue-800';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/positions"
        className="inline-flex items-center text-sm text-gray-500 hover:text-green-600 mb-8 transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" />
        ポジション一覧に戻る
      </Link>

      {/* ヘッダー */}
      <div className="flex items-center gap-4 mb-2">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 shadow-sm shrink-0">
          <Image src={position.character} alt={position.name} width={64} height={64} className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={'text-sm font-bold px-2 py-0.5 rounded ' + numberBadge}>{position.number}</span>
            <span className={'text-xs font-semibold px-2 py-0.5 rounded ' + accentBg + ' ' + accentColor}>{position.category}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">{position.name}</h1>
          <p className="text-sm text-gray-500">{position.nameEn}</p>
        </div>
      </div>

      {/* 一言キャッチ */}
      <p className="text-xl font-semibold text-gray-800 mt-6 mb-10">{position.catch}</p>

      {/* レベル別導線 */}
      {position.levelGuide && (
        <div className={'rounded-xl p-6 mb-10 ' + accentBg + ' border ' + accentBorder}>
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <BookOpen size={20} />
            観戦レベル別ガイド
          </h2>
          <div className="space-y-3">
            <div>
              <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded mr-2">まずはここを見る</span>
              <span className="text-sm text-gray-700">{position.levelGuide.beginner}</span>
            </div>
            <div>
              <span className="text-xs font-semibold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded mr-2">慣れてきたら</span>
              <span className="text-sm text-gray-700">{position.levelGuide.intermediate}</span>
            </div>
          </div>
        </div>
      )}

      {/* 観戦ポイント */}
      {position.watchPoints.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Eye size={20} className="text-green-600" />
            観戦ポイント
          </h2>
          <div className="space-y-3">
            {position.watchPoints.map((wp, i) => (
              <div key={i} className="flex items-start gap-3 bg-white border rounded-lg p-4">
                <span className="text-green-500 font-bold mt-0.5">{i + 1}</span>
                <span className="text-gray-700">{wp}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 判断の分岐 */}
      {position.decision.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <GitBranch size={20} className="text-purple-600" />
            判断の分岐
          </h2>
          <div className="space-y-2">
            {position.decision.map((d, i) => (
              <div key={i} className="flex items-center gap-3 bg-white border rounded-lg p-4">
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">{d.condition}</span>
                <span className="text-gray-300">→</span>
                <span className="font-semibold text-gray-800">{d.action}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* よくあるシーン */}
      {position.scenes.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Film size={20} className="text-orange-600" />
            よくあるシーン
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {position.scenes.map((scene, i) => (
              <div key={i} className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm text-gray-700">
                {scene}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ポジション間の関係 */}
      {position.relations.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Link2 size={20} className="text-blue-600" />
            ポジション間の関係
          </h2>
          <div className="space-y-2">
            {position.relations.map((rel, i) => (
              <div key={i} className="flex items-center gap-3 bg-white border rounded-lg p-4">
                <span className="text-sm font-bold bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center shrink-0">{rel.number}</span>
                <div>
                  <span className="font-semibold text-sm">{rel.name}</span>
                  <span className="text-gray-500 text-sm ml-2">{rel.description}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* スキル・役割 */}
      {position.skills.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap size={20} className="text-amber-600" />
            スキル
          </h2>
          <div className="space-y-3">
            {position.skills.map((skill, i) => (
              <div key={i} className="bg-white border rounded-lg p-4">
                <span className="font-semibold text-sm text-gray-800">{skill.name}</span>
                <p className="text-sm text-gray-500 mt-1">{skill.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {position.roles.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-bold mb-3 text-gray-600">主な役割</h2>
          <ul className="space-y-1">
            {position.roles.map((role, i) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-gray-400">•</span>
                <span>{role}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
