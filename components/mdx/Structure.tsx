import Image from 'next/image';

interface StructureProps {
  situation: string;
  situationImage?: string;
  decision: string;
  decisionImage?: string;
  result: string;
  resultImage?: string;
}

interface SectionProps {
  label: string;
  emoji: string;
  text: string;
  image?: string;
  colorClass: string;
  borderClass: string;
  headingClass: string;
}

function Section({ label, emoji, text, image, colorClass, borderClass, headingClass }: SectionProps) {
  return (
    <div>
      <div className={`${colorClass} border-l-4 ${borderClass} p-6 rounded-r-lg mb-4`}>
        <h3 className={`font-bold text-lg mb-2 ${headingClass} flex items-center gap-2`}>
          <span>{emoji}</span>
          {label}
        </h3>
        <p className="text-gray-800">{text}</p>
      </div>
      {image && (
        <div className="rounded-lg overflow-hidden shadow-md mb-6 relative mx-auto" style={{ maxWidth: '400px', aspectRatio: '1280 / 1080' }}>
          <Image
            src={image}
            alt={label}
            fill
            className="object-cover"
            style={{ objectPosition: 'center 50%', transform: 'scale(1.12)' }}
          />
        </div>
      )}
    </div>
  );
}

export function Structure({ situation, situationImage, decision, decisionImage, result, resultImage }: StructureProps) {
  return (
    <div className="space-y-8 my-8">
      <Section
        label="状況"
        emoji="🏁"
        text={situation}
        image={situationImage}
        colorClass="bg-yellow-50"
        borderClass="border-yellow-600"
        headingClass="text-yellow-700"
      />
      <Section
        label="判断"
        emoji="🧠"
        text={decision}
        image={decisionImage}
        colorClass="bg-blue-50"
        borderClass="border-blue-600"
        headingClass="text-blue-700"
      />
      <Section
        label="結果"
        emoji="✅"
        text={result}
        image={resultImage}
        colorClass="bg-green-50"
        borderClass="border-green-600"
        headingClass="text-green-700"
      />
    </div>
  );
}
