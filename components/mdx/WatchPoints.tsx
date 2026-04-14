interface WatchPointsProps {
  items: string[];
}

import { GlossaryText } from '@/components/GlossaryText';

export function WatchPoints({ items }: WatchPointsProps) {
  if (!items || items.length === 0) return null;
  return (
    <ul className="space-y-2 my-4">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2">
          <span className="text-green-600 mt-0.5">•</span>
          <span><GlossaryText text={item} /></span>
        </li>
      ))}
    </ul>
  );
}
