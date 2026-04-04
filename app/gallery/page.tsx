import { getAllGallery } from '@/lib/mdx';
import type { GalleryFrontmatter } from '@/lib/mdx';
import { Image as ImageIcon } from 'lucide-react';

export default async function GalleryPage() {
  const albums = await getAllGallery();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* ヘッダー */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">ギャラリー</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          試合の瞬間、選手たちの表情、スタジアムの熱気。写真で振り返るラグビーの魅力。
        </p>
      </div>

      {albums.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <ImageIcon size={48} className="mx-auto mb-4 opacity-40" />
          <p>ギャラリーはまだありません</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <GalleryCard key={album.id} album={album} />
          ))}
        </div>
      )}
    </div>
  );
}

function GalleryCard({ album }: { album: GalleryFrontmatter }) {
  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
      <div className="aspect-square overflow-hidden bg-gray-200 relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={album.coverImage}
          alt={album.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="flex items-center mb-2">
              <ImageIcon size={16} className="mr-2" />
              <span className="text-sm">{album.photoCount}枚</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 group-hover:text-green-600 transition-colors">
          {album.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3">{album.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="font-semibold">{album.match}</span>
          <span>
            {new Date(album.date).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
