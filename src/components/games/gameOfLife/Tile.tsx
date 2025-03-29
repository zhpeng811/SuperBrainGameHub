interface TileProps {
  isAlive: boolean;
  isInteractive: boolean;
  isHighlighted?: boolean;
  isCorrect?: boolean | null;
  isMissed?: boolean; // For cells that should be alive but weren't predicted
  verificationEnabled?: boolean;
  showPostSubmission?: boolean; // To display verification after submission
  onClick?: () => void;
  onHover?: () => void;
  onHoverEnd?: () => void;
}

export default function Tile({ 
  isAlive, 
  isInteractive, 
  isHighlighted = false,
  isCorrect = null,
  isMissed = false,
  verificationEnabled = false,
  showPostSubmission = false,
  onClick, 
  onHover,
  onHoverEnd 
}: TileProps) {
  const baseClasses = "w-full h-full aspect-square border border-gray-300 transition-colors";
  
  let colorClasses = isAlive 
    ? "bg-gray-900 dark:bg-gray-950" 
    : "bg-white dark:bg-gray-200";
    
  // Apply verification colors if enabled and cell is alive
  if ((verificationEnabled || showPostSubmission) && isAlive && isCorrect !== null) {
    colorClasses = isCorrect 
      ? "bg-green-600 dark:bg-green-700" // Correct prediction
      : "bg-red-600 dark:bg-red-700";    // Incorrect prediction
  }

  // For post-submission display, show missed cells (cells that should be alive but weren't predicted)
  if (showPostSubmission && !isAlive && isMissed) {
    colorClasses = "bg-orange-500 dark:bg-orange-600"; // Missed cell
  }
  
  const interactiveClasses = isInteractive
    ? "cursor-pointer hover:opacity-80 active:opacity-60"
    : "cursor-default";
  const highlightClasses = isHighlighted
    ? "ring-2 ring-blue-500 z-10"
    : "";

  return (
    <div 
      className={`${baseClasses} ${colorClasses} ${interactiveClasses} ${highlightClasses}`}
      onClick={isInteractive ? onClick : undefined}
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
      role={isInteractive ? "button" : "presentation"}
      aria-label={isInteractive ? `Cell ${isAlive ? 'alive' : 'dead'}` : undefined}
    />
  );
} 