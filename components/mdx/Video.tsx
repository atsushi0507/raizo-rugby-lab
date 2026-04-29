interface VideoProps {
  url: string;
}

interface YouTubeInfo {
  embedUrl: string;
  isShort: boolean;
}

function getYouTubeInfo(url: string): YouTubeInfo | null {
  try {
    const parsed = new URL(url);
    // youtube.com/watch?v=ID
    if (parsed.hostname === 'www.youtube.com' || parsed.hostname === 'youtube.com') {
      const videoId = parsed.searchParams.get('v');
      if (videoId) return { embedUrl: `https://www.youtube.com/embed/${videoId}`, isShort: false };
      // youtube.com/shorts/ID
      const shortsMatch = parsed.pathname.match(/^\/shorts\/([^/?]+)/);
      if (shortsMatch) return { embedUrl: `https://www.youtube.com/embed/${shortsMatch[1]}`, isShort: true };
    }
    // youtu.be/ID
    if (parsed.hostname === 'youtu.be') {
      const videoId = parsed.pathname.slice(1);
      if (videoId) return { embedUrl: `https://www.youtube.com/embed/${videoId}`, isShort: false };
    }
  } catch {
    // not a valid URL
  }
  return null;
}

export function Video({ url }: VideoProps) {
  if (!url) return null;

  const ytInfo = getYouTubeInfo(url);

  if (ytInfo) {
    return (
      <div className="my-8">
        <div className={
          ytInfo.isShort
            ? 'rounded-lg overflow-hidden shadow-md bg-gray-900 mx-auto'
            : 'rounded-lg overflow-hidden shadow-md aspect-video bg-gray-900'
        } style={ytInfo.isShort ? { maxWidth: '360px', aspectRatio: '9 / 16' } : undefined}>
          <iframe
            src={ytInfo.embedUrl}
            title="動画"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
        <p className="text-sm text-gray-600 mt-2 text-center">
          {ytInfo.isShort ? '動画で確認しよう' : '状況 → 判断 → 結果の流れを動画で確認しよう'}
        </p>
      </div>
    );
  }

  return (
    <div className="my-8">
      <div className="rounded-lg overflow-hidden shadow-md aspect-video bg-gray-900">
        <video controls className="w-full h-full">
          <source src={url} type="video/mp4" />
          お使いのブラウザは動画タグをサポートしていません。
        </video>
      </div>
      <p className="text-sm text-gray-600 mt-2 text-center">
        状況 → 判断 → 結果の流れを動画で確認しよう
      </p>
    </div>
  );
}
