interface TileProps {
  isBlack: boolean;
  isInteractive: boolean;
  onClick?: () => void;
}

export default function Tile({ isBlack, isInteractive, onClick }: TileProps) {
  const baseClasses = "w-full aspect-square border border-gray-300 transition-colors";
  const colorClasses = isBlack 
    ? "bg-gray-900 dark:bg-gray-950" 
    : "bg-white dark:bg-gray-200";
  const interactiveClasses = isInteractive
    ? "cursor-pointer hover:opacity-80 active:opacity-60"
    : "cursor-default";

  return (
    <div 
      className={`${baseClasses} ${colorClasses} ${interactiveClasses}`}
      onClick={isInteractive ? onClick : undefined}
      role={isInteractive ? "button" : "presentation"}
      aria-label={isInteractive ? `Tile ${isBlack ? 'black' : 'white'}` : undefined}
      style={{ minWidth: "28px", minHeight: "28px" }}
    />
  );
} 