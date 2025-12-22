import { Settings, MailQuestion } from "lucide-react"

export default function Sets({
  sets,
  className,
  selectedSet,
  setSelectedSet,
  onSettingsClick,
  openFeedbackModal,
}: {
  sets: { name: string }[]
  className?: string
  selectedSet?: number
  setSelectedSet?: (set: number) => void
  onSettingsClick?: () => void
  openFeedbackModal?: () => void
}) {
  const selectedIndex = selectedSet ?? 0
  const currentName = sets[selectedIndex]?.name || `Set ${selectedIndex + 1}`

  return (
    <div
      className={`flex items-center gap-2 ${className} w-full sm:w-5xl px-4 sm:px-0`}
    >
      {/* mobile: current set selector */}
      <div className="relative block sm:hidden opacity-35">
        <div className="px-4 py-2 rounded-lg border border-gray-200 bg-white font-jetbrains-mono cursor-pointer">
          {currentName}
        </div>
        <select
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-lg"
          value={selectedIndex}
          onChange={(e) => {
            const idx = parseInt(e.target.value, 10)
            setSelectedSet?.(idx)
          }}
        >
          {sets.map((set, index) => (
            <option key={index} value={index}>
              {set.name || `Set ${index + 1}`}
            </option>
          ))}
        </select>
      </div>

      {/* desktop: button list */}
      <div className="hidden sm:flex gap-2 opacity-20 hover:opacity-100 transition-opacity duration-200 items-center max-w-5xl">
        {sets.map((set, index) => (
          <div
            key={index}
            className={`set-button-desktop px-4 py-2 rounded-lg border-[1.5px] cursor-pointer ${
              selectedSet === index ? "border-gray-400" : "border-gray-200"
            } hover:bg-gray-50 hover:border-gray-400`}
            onClick={() => {
              setSelectedSet?.(index)
            }}
            style={{ opacity: 0 }}
          >
            {set.name || `Set ${index + 1}`}
          </div>
        ))}
      </div>

      {/* settings icon */}
      <div
        className="hidden sm:inline-flex relative items-center ml-2 sm:ml-4 group"
        title="Settings"
      >
        <Settings
          size={20}
          className="cursor-pointer motion-preset-focus opacity-20 hover:opacity-100 transition-opacity duration-200"
          onClick={onSettingsClick}
        />
        <div className="absolute bottom-9 left-1/2 transform -translate-x-1/2 w-fit h-fit px-2 py-1 text-xs bg-white border border-gray-200 shadow-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-plex-mono">
          Settings
        </div>
      </div>
      {/* feedback icon */}
      <div
        className="hidden sm:inline-flex relative items-center ml-2 sm:ml-4 group"
        title="Feedback"
      >
        <MailQuestion
          size={20}
          className="cursor-pointer motion-preset-focus opacity-20 hover:opacity-100 transition-opacity duration-200"
          onClick={() => openFeedbackModal?.()}
        />
        <div className="absolute bottom-9 left-1/2 transform -translate-x-1/2 w-fit h-fit px-2 py-1 text-xs bg-white border border-gray-200 shadow-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-plex-mono">
          Feedback
        </div>
      </div>
    </div>
  )
}
