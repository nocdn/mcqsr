export default function Sets({
  sets,
  className,
  selectedSet,
  setSelectedSet,
}: {
  sets: string[];
  className?: string;
  selectedSet?: string;
  setSelectedSet?: (set: string) => void;
}) {
  return (
    <div
      className={`flex gap-2 opacity-20 hover:opacity-100 transition-opacity duration-200 ${className} w-5xl`}
    >
      {sets.map((set) => (
        <div
          className={`px-4 py-2 rounded-lg border-gray-200 hover:border-gray-400 border-[1.5px] hover:bg-gray-50 cursor-pointer ${
            selectedSet === set ? "border-gray-400" : "border-gray-200"
          }`}
          key={set}
          onClick={() => {
            setSelectedSet?.(set);
          }}
        >
          {set}
        </div>
      ))}
    </div>
  );
}
