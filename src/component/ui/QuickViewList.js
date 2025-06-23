import ForumCard from "./ForumCard";

const QuickViewList = ({ items }) => (
  <div className="bg-white/95 rounded-2xl shadow-lg p-4 mb-6 border border-gray-100">
    <h3 className="font-bold text-base mb-3 flex items-center gap-2 text-black">
      <span className="text-pink-500 text-lg">⚡</span> Xem nhanh
    </h3>
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      {items.map((item) => (
        <div key={item.id} className="min-w-[210px] max-w-[210px]">
          <ForumCard post={item} />
        </div>
      ))}
    </div>
  </div>
);

export default QuickViewList;
