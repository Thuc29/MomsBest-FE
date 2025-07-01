import React, { useState } from "react";
import ForumCard from "./ForumCard";
import Modal from "./Modal";

const getYoutubeId = (url) => {
  const match = url.match(
    /(?:youtu.be\/|youtube.com\/(?:embed\/|v\/|watch\?v=))([\w-]{11})/
  );
  return match ? match[1] : null;
};

const QuickViewList = ({ items }) => {
  const [selected, setSelected] = useState(null);

  const handleClose = () => setSelected(null);

  return (
    <div className="bg-white/95 rounded-2xl shadow-lg p-4 mb-6 border border-gray-100">
      <h3 className="font-bold text-base mb-3 flex items-center gap-2 text-black">
        <span className="text-pink-500 text-lg">⚡</span> Xem nhanh
      </h3>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {items.map((item) => (
          <div
            key={item.id}
            className="min-w-[210px] max-w-[210px] cursor-pointer"
            onClick={() => setSelected(item)}
          >
            <ForumCard post={item} />
          </div>
        ))}
      </div>
      {/* Modal chi tiết */}
      <Modal open={!!selected} title={selected?.title} onClose={handleClose}>
        {selected && selected.videoUrl && getYoutubeId(selected.videoUrl) ? (
          <div className="mb-4">
            <iframe
              width="100%"
              height="250"
              src={`https://www.youtube.com/embed/${getYoutubeId(
                selected.videoUrl
              )}?autoplay=1`}
              title={selected.title}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="rounded-xl w-full aspect-video border border-gray-200"
            />
          </div>
        ) : selected && selected.thumbnail ? (
          <img
            src={selected.thumbnail}
            alt={selected.title}
            className="rounded-xl w-full aspect-video object-cover border border-gray-200 mb-4"
          />
        ) : null}
        {selected && (
          <>
            <div className="flex items-center gap-2 mb-2">
              {selected.videoUrl && getYoutubeId(selected.videoUrl) && (
                <span className="bg-red-500/90 text-white px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm">
                  Video
                </span>
              )}
              {selected.isNew && (
                <span className="bg-green-500/90 text-white px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm">
                  Mới
                </span>
              )}
            </div>
            <h3 className="font-bold text-base md:text-lg mb-2 leading-snug">
              {selected.title}
            </h3>
            <p className="text-gray-600 text-sm mb-2">{selected.description}</p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{selected.author}</span>
              <span>•</span>
              <span>{selected.date}</span>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default QuickViewList;
