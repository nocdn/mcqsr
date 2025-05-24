import { Settings, MailQuestion } from "lucide-react";

export default function Sets({
  sets,
  className,
  selectedSet,
  setSelectedSet,
  onSettingsClick,
  showingSettingsIcon,
  showingFeedbackIcon,
  openFeedbackModal,
}: {
  sets: { name: string }[];
  className?: string;
  selectedSet?: number;
  setSelectedSet?: (set: number) => void;
  onSettingsClick?: () => void;
  showingSettingsIcon?: boolean;
  showingFeedbackIcon?: boolean;
  openFeedbackModal?: () => void;
}) {
  return (
    <div
      className={`flex gap-2 opacity-20 hover:opacity-100 transition-opacity duration-200 ${className} w-5xl items-center`}
    >
      {sets.map((set, index) => (
        <div
          className={`px-4 py-2 rounded-lg border-gray-200 hover:border-gray-400 border-[1.5px] hover:bg-gray-50 cursor-pointer ${
            selectedSet === index ? "border-gray-400" : "border-gray-200"
          }`}
          key={index}
          onClick={() => {
            console.log("setting set to", index);
            setSelectedSet?.(index);
          }}
        >
          {set.name || `Set ${index + 1}`}
        </div>
      ))}
      {showingSettingsIcon && (
        <div
          className="relative inline-flex items-center ml-4 group"
          title="Settings"
        >
          <Settings
            size={20}
            className={`cursor-pointer motion-preset-focus`}
            onClick={onSettingsClick}
          />
          <div className="absolute bottom-9 left-1/2 transform -translate-x-1/2 w-fit h-fit px-2 py-1 text-xs bg-white border border-gray-200 shadow-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-plex-mono">
            Settings
          </div>
        </div>
      )}
      {showingFeedbackIcon && (
        <div
          className="relative inline-flex items-center ml-4 group"
          title="Feedback"
        >
          <MailQuestion
            size={20}
            className={`cursor-pointer motion-preset-focus`}
            onClick={() => {
              openFeedbackModal?.();
            }}
          />
          <div className="absolute bottom-9 left-1/2 transform -translate-x-1/2 w-fit h-fit px-2 py-1 text-xs bg-white border border-gray-200 shadow-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-plex-mono">
            Feedback
          </div>
        </div>
      )}
    </div>
  );
}
