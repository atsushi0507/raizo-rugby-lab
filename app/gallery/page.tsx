import { getAllGallery } from '@/lib/mdx';
import { Image as ImageIcon } from 'lucide-react';
import { GalleryAlbum } from '@/components/GalleryAlbum';

export default async function GalleryPage() {
  const albums = await getAllGallery();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            <GalleryAlbum key={album.id} album={album} />
          ))}
        </div>
      )}
    </div>
  );
}
