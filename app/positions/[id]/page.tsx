import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowLeft, Eye, GitBranch, Film, AlertTriangle, Link2, Zap, BookOpen, ArrowRight, MessageCircle } from 'lucide-react';
import { getPositionById, getAllPositions, getAllArticles } from '@/lib/mdx';
import { getCharacterName } from '@/lib/characters';
import { Conversation } from '@/components/mdx/Conversation';
import { GlossaryText } from '@/components/GlossaryText';
import { getLikeCounts } from '@/lib/likes';
import ArticleCard from '@/components/ArticleCard';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const position = await getPositionById(id);
  if (!position) return { title: 'ポジションが見つかりません' };
  return {
    title: `${position.name}（${position.number}番）- ${position.catch}`,
    description: `${position.name}の観戦ポイント・判断の分岐・思考プロセスを解説。${position.catch}。`,
    keywords: ['ラグビー', 'ラグビーポジション', position.name, position.nameEn, position.category],
  };
}

export default async function PositionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const position = await getPositionById(id);
  if (!position) notFound();

  const isForward = position.category === 'フォワード';
  const accentBg = isForward ? 'bg-red-50' : 'bg-blue-50';
  const accentBorder = isForward ? 'border-red-200' : 'border-blue-200';
  const accentColor = isForward ? 'text-red-700' : 'text-blue-700';
  const numberBadge = isForward ? 'bg-red-200 text-red-800' : 'bg-blue-200 text-blue-800';

  // ポジション番号 → データのマッピングを構築（リンク・アイコン用）
  const allPositions = await getAllPositions();
  const numberToPosition = new Map(allPositions.map((p) => [p.number, p]));

  // このポジションに関連する記事を取得
  const allArticles = await getAllArticles();
  const positionArticles = allArticles.filter(
    (a) => a.position && a.position.toLowerCase() === position.id
  );
  let positionArticleLikeCounts: Record<string, number> = {};
  if (positionArticles.length > 0) {
    try {
      positionArticleLikeCounts = await getLikeCounts(positionArticles.map((a) => a.id));
    } catch {
      // Firebase 接続失敗時はいいね数 0 で表示
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/positions" className="inline-flex items-center text-sm text-gray-500 hover:text-green-600 mb-8 transition-colors">
        <ArrowLeft size={16} className="mr-1" />ポジション一覧に戻る
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

      <p className="text-xl font-semibold text-gray-800 mt-6 mb-10">{position.catch}</p>

      {/* レベル別導線 */}
      {position.levelGuide && (
        <div className={'rounded-xl p-6 mb-10 ' + accentBg + ' border ' + accentBorder}>
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><BookOpen size={20} />観戦レベル別ガイド</h2>
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

      {/* 観戦ポイント（タイミング + 詳細付き） */}
      {position.watchPoints.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Eye size={20} className="text-green-600" />観戦ポイント</h2>
          <div className="space-y-3">
            {position.watchPoints.map((wp, i) => (
              <div key={i} className="bg-white border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-green-500 font-bold mt-0.5 shrink-0">{i + 1}</span>
                  <div>
                    <p className="font-medium text-gray-800">{wp.text}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {wp.timing && (
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                          ⏱ {wp.timing}
                        </span>
                      )}
                      {wp.detail && (
                        <span className="text-xs text-gray-500"><GlossaryText text={wp.detail} /></span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 判断の分岐（根拠付き） */}
      {position.decision.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><GitBranch size={20} className="text-purple-600" />判断の分岐</h2>
          <div className="space-y-3">
            {position.decision.map((d, i) => (
              <div key={i} className="bg-white border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">{d.condition}</span>
                  <span className="text-gray-300">→</span>
                  <span className="font-semibold text-gray-800">{d.action}</span>
                </div>
                {d.reason && (
                  <p className="text-xs text-gray-500 ml-1 mt-1">💡 <GlossaryText text={d.reason} /></p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 判断の思考プロセス（会話形式） */}
      {position.decisionConversation.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><MessageCircle size={20} className="text-green-600" />思考プロセスを会話で理解する</h2>
          <Conversation items={position.decisionConversation} />
        </section>
      )}

      {/* よくあるシーン + よくある失敗 */}
      <div className="grid sm:grid-cols-2 gap-6 mb-10">
        {position.scenes.length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Film size={18} className="text-orange-600" />よくあるシーン</h2>
            <div className="space-y-2">
              {position.scenes.map((scene, i) => (
                <div key={i} className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-gray-700"><GlossaryText text={scene} /></div>
              ))}
            </div>
          </section>
        )}

        {position.commonMistakes.length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><AlertTriangle size={18} className="text-red-500" />よくある失敗</h2>
            <div className="space-y-2">
              {position.commonMistakes.map((mistake, i) => (
                <div key={i} className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-gray-700"><GlossaryText text={mistake} /></div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ポジション間の関係（チェーン表示） */}
      {position.relations.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Link2 size={20} className="text-blue-600" />ポジション間の関係</h2>
          <div className="flex flex-col items-center gap-1">
            {position.relations.map((rel, i) => {
              const isSelf = rel.number === position.number;
              const linkedPosition = numberToPosition.get(rel.number);
              const isLinkable = !isSelf && linkedPosition;
              const characterName = linkedPosition ? getCharacterName(linkedPosition.id) : null;

              const avatar = linkedPosition ? (
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shadow-sm shrink-0">
                  <Image src={linkedPosition.icon} alt={linkedPosition.name} width={40} height={40} className="w-full h-full object-cover" />
                </div>
              ) : (
                <span className={'text-sm font-bold w-10 h-10 rounded-full flex items-center justify-center shrink-0 ' + (isSelf ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-700')}>{rel.number}</span>
              );

              const nameDisplay = linkedPosition
                ? `${rel.number}: ${rel.name}`
                : rel.name;

              const cardContent = (
                <div className={'flex items-center gap-3 rounded-lg p-4 w-full max-w-md ' + (isSelf ? 'bg-green-50 border-2 border-green-300' : 'bg-white border') + (isLinkable ? ' hover:shadow-md transition-shadow group' : '')}>
                  {avatar}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={'font-semibold text-sm' + (isLinkable ? ' group-hover:text-green-600 transition-colors' : '')}>{nameDisplay}</span>
                      {characterName && !isSelf && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">{characterName}</span>
                      )}
                      <span className={'text-xs px-2 py-0.5 rounded-full ' + (isSelf ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600')}>{rel.role}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{rel.description}</p>
                  </div>
                  {isLinkable && (
                    <ArrowRight size={14} className="text-gray-300 group-hover:text-green-600 transition-colors shrink-0" />
                  )}
                </div>
              );

              return (
                <div key={i}>
                  {isLinkable ? (
                    <Link href={`/positions/${linkedPosition.id}`}>{cardContent}</Link>
                  ) : (
                    cardContent
                  )}
                  {i < position.relations.length - 1 && (
                    <div className="flex justify-center py-0.5">
                      <ArrowRight size={16} className="text-gray-300 rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* スキル */}
      {position.skills.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Zap size={20} className="text-amber-600" />スキル</h2>
          <div className="space-y-3">
            {position.skills.map((skill, i) => (
              <div key={i} className="bg-white border rounded-lg p-4">
                <span className="font-semibold text-sm text-gray-800">{skill.name}</span>
                <p className="text-sm text-gray-500 mt-1"><GlossaryText text={skill.description} /></p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 役割 */}
      {position.roles.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-bold mb-3 text-gray-600">主な役割</h2>
          <ul className="space-y-1">
            {position.roles.map((role, i) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-2"><span className="text-gray-400">•</span><span><GlossaryText text={role} /></span></li>
            ))}
          </ul>
        </section>
      )}

      {/* このポジションが登場する記事 */}
      {positionArticles.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><BookOpen size={20} className="text-blue-600" />このポジションが登場する記事</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {positionArticles.slice(0, 3).map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                likeCount={positionArticleLikeCounts[article.id] ?? 0}
              />
            ))}
          </div>
          {positionArticles.length > 3 && (
            <div className="text-center mt-6">
              <Link
                href={`/articles?position=${encodeURIComponent(positionArticles[0]?.position ?? position.id.toUpperCase())}`}
                className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold text-sm"
              >
                もっと見る（{positionArticles.length}件）
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
