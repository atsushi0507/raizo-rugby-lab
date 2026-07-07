import Image from 'next/image';
import { GlossaryText } from '@/components/GlossaryText';

interface FeatureOverview {
  title: string;
  body: string;
  image?: string;
}

interface FeatureSection {
  title: string;
  body: string;
}

interface FeatureBreakdownProps {
  overview: FeatureOverview;
  sections: FeatureSection[];
}

export function FeatureBreakdown({ overview, sections }: FeatureBreakdownProps) {
  return (
    <div className="space-y-8 my-8">
      {/* Overview */}
      <div className="bg-gradient-to-br from-teal-900 to-emerald-900 text-white rounded-xl p-6">
        <h3 className="font-bold text-lg mb-3 text-teal-300">{overview.title}</h3>
        <p className="text-gray-200 leading-relaxed text-sm whitespace-pre-line">
          <GlossaryText text={overview.body} />
        </p>
        {overview.image && !overview.image.includes('example.com') && (
          <div className="mt-5 mx-auto" style={{ maxWidth: '400px' }}>
            <div
              className="rounded-lg overflow-hidden shadow-md relative w-full"
              style={{ aspectRatio: '4 / 3' }}
            >
              <Image
                src={overview.image}
                alt={overview.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section, i) => (
          <div key={i} className="bg-white border border-teal-100 rounded-xl p-5 flex gap-4">
            <div className="shrink-0 w-8 h-8 rounded-full bg-teal-100 text-teal-700 font-bold text-sm flex items-center justify-center">
              {i + 1}
            </div>
            <div>
              <p className="font-bold text-gray-800 mb-1.5">{section.title}</p>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                <GlossaryText text={section.body} />
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
