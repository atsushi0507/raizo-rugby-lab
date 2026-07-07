import { GlossaryText } from '@/components/GlossaryText';

interface ViewingPointsProps {
  items: string[];
}

export function ViewingPoints({ items }: ViewingPointsProps) {
  if (!items || items.length === 0) return null;

  const ICONS = ['👁️', '🎯', '🤝', '📣', '✨'];

  return (
    <ul className="space-y-3 my-4">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3 bg-teal-50 border border-teal-100 rounded-lg px-4 py-3">
          <span className="text-base shrink-0 mt-0.5">{ICONS[index % ICONS.length]}</span>
          <span className="text-sm text-gray-700 leading-relaxed">
            <GlossaryText text={item} />
          </span>
        </li>
      ))}
    </ul>
  );
}
