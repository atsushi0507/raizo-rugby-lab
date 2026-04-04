interface VideoProps {
  url: string;
}

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'www.youtube.com' || parsed.hostname === 'youtube.com') {
      const videoId = parsed.searchParams.get('v');
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    if (parsed.hostname === 'youtu.be') {
      const videoId = parsed.pathname.slice(1);
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
  } catch {
    // not a valid URL
  }
  return null;
}

export function Video({ url }: VideoProps) {
  if (!url) return null;

  const embedUrl = getYouTubeEmbedUrl(url);

  return (
    <div className="my-8">
      <div className="rounded-lg overflow-hidden shadow-md aspect-video bg-gray-900">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title="動画"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <video controls className="w-full h-full">
            <source src={url} type="video/mp4" />
            お使いのブラウザは動画タグをサポートしていません。
          </video>
        )}
      </div>
      <p className="text-sm text-gray-600 mt-2 text-center">
        状況 → 判断 → 結果の流れを動画で確認しよう
      </p>
    </div>
  );
}
