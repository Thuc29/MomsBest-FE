import React, { useState } from "react";

const getYoutubeId = (url) => {
  const match = url.match(
    /(?:youtu.be\/|youtube.com\/(?:embed\/|v\/|watch\?v=))([\w-]{11})/
  );
  return match ? match[1] : null;
};

const ForumCard = ({ post }) => {
  const [showVideo, setShowVideo] = useState(false);
  const isYoutube = post.videoUrl && getYoutubeId(post.videoUrl);

  return (
    <div className="rounded-2xl border border-gray-100 shadow-lg bg-white/95 p-4 mb-4 flex flex-col gap-2 hover:scale-[1.02] hover:shadow-2xl transition-all duration-200 cursor-pointer">
      {isYoutube ? (
        <div className="relative group" onClick={() => setShowVideo(true)}>
          <img
            src={`https://img.youtube.com/vi/${getYoutubeId(
              post.videoUrl
            )}/hqdefault.jpg`}
            alt={post.title}
            className="rounded-xl w-full aspect-video object-cover border border-gray-200 group-hover:brightness-90 transition"
          />
          <span className="absolute inset-0 flex items-center justify-center text-5xl text-white/90 group-hover:scale-110 transition">
            ▶️
          </span>
        </div>
      ) : (
        post.thumbnail && (
          <img
            src={post.thumbnail}
            alt={post.title}
            className="rounded-xl w-full aspect-video object-cover border border-gray-200"
          />
        )
      )}
      <div className="flex items-center gap-2 mt-2">
        {isYoutube && (
          <span className="bg-red-500/90 text-white px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm">
            Video
          </span>
        )}
        {post.isNew && (
          <span className="bg-green-500/90 text-white px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm">
            Mới
          </span>
        )}
      </div>
      <h3 className="font-bold text-base md:text-lg line-clamp-2 leading-snug mt-1 mb-0.5">
        {post.title}
      </h3>
      <p className="text-gray-600 text-sm line-clamp-2 mb-1">
        {post.description}
      </p>
      <div className="flex items-center gap-2 text-xs text-gray-400 mt-auto">
        <span>{post.author}</span>
        <span>•</span>
        <span>{post.date}</span>
      </div>
      {/* Modal video */}
      {showVideo && isYoutube && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setShowVideo(false)}
        >
          <div
            className="bg-black rounded-2xl overflow-hidden shadow-2xl w-full max-w-2xl border-4 border-white"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${getYoutubeId(
                post.videoUrl
              )}?autoplay=1`}
              title={post.title}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ForumCard;
