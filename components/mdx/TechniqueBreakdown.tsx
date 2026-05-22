import Image from 'next/image';
import { GlossaryText } from '@/components/GlossaryText';

interface TechniqueOverview {
  title: string;
  body: string;
  image?: string;
}

interface TechniqueSection {
  title: string;
  body: string;
}

interface TechniqueBreakdownProps {
  overview: TechniqueOverview;
  sections: TechniqueSection[];
}

export function TechniqueBreakdown({ overview, sections }: TechniqueBreakdownProps) {
  return (
    <div className="space-y-8 my-8">
      {/* Overview */}
      <div className="bg-gray-900 text-white rounded-xl p-6">
        <h3 className="font-bold text-lg mb-3 text-green-400">{overview.title}</h3>
        <p className="text-gray-200 leading-relaxed text-sm">
          <GlossaryText text={overview.body} />
        </p>
        {overview.image && (
          <div className="mt-5 mx-auto" style={{ maxWidth: '400px' }}>
            <div className="rounded-lg overflow-hidden shadow-md relative w-full" style={{ aspectRatio: '4 / 5' }}>
              <Image
                src={overview.image}
                alt={overview.title}
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4">
            <div className="shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold text-sm flex items-center justify-center">
              {i + 1}
            </div>
            <div>
              <p className="font-bold text-gray-800 mb-1.5">{section.title}</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                <GlossaryText text={section.body} />
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
