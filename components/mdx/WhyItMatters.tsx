import { GlossaryText } from '@/components/GlossaryText';

interface WhyItMattersProps {
  title: string;
  body: string;
}

export function WhyItMatters({ title, body }: WhyItMattersProps) {
  return (
    <div className="my-4 rounded-xl overflow-hidden border border-amber-200">
      {/* ヘッダー */}
      <div className="bg-amber-50 px-5 py-3 border-b border-amber-200">
        <p className="text-sm font-bold text-amber-800">{title}</p>
      </div>
      {/* 本文 */}
      <div className="bg-white px-5 py-4">
        <p className="text-sm text-gray-700 leading-loose whitespace-pre-line">
          <GlossaryText text={body} />
        </p>
      </div>
    </div>
  );
}
