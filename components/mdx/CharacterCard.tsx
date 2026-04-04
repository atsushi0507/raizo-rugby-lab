import Image from 'next/image';

interface CharacterCardProps {
  icon: string;
  image: string;
  name: string;
}

export function CharacterCard({ icon, image, name }: CharacterCardProps) {
  return (
    <div className="my-8 flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl">
      <div className="relative w-32 h-32">
        <Image
          src={image}
          alt={`${name}のキャラクター`}
          fill
          className="object-contain"
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="relative w-8 h-8">
          <Image
            src={icon}
            alt={`${name}のアイコン`}
            fill
            className="object-contain"
          />
        </div>
        <span className="font-bold text-lg text-gray-800">{name}</span>
      </div>
    </div>
  );
}
