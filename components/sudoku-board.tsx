"use client"

import { cn } from "@/lib/utils"

type CompletedSection = {
  type: "row" | "column" | "box"
  index: number
  boxRow?: number
  boxCol?: number
}

type SudokuBoardProps = {
  board: (number | null)[][]
  onCellSelect: (row: number, col: number) => void
  selectedCell: [number, number] | null
  invalidCell: [number, number, number] | null
  computerSelectedCell: [number, number] | null
  completedSections: CompletedSection[]
  currentPlayer: number
  gameOver: boolean
  selectedNumber: number | null
  revealedCell?: { row: number; col: number; value: number }
  starCell?: { row: number; col: number }
  isBonusActive?: boolean
}

export default function SudokuBoard({
  board,
  onCellSelect,
  selectedCell,
  invalidCell,
  computerSelectedCell,
  completedSections,
  currentPlayer,
  gameOver,
  selectedNumber,
  revealedCell,
  starCell,
  isBonusActive
}: SudokuBoardProps) {
  const isSelectedCell = (row: number, col: number) => {
    return selectedCell && selectedCell[0] === row && selectedCell[1] === col
  }

  const isComputerSelectedCell = (row: number, col: number) => {
    return computerSelectedCell && computerSelectedCell[0] === row && computerSelectedCell[1] === col
  }

  const isInvalidCell = (row: number, col: number) => {
    return invalidCell && invalidCell[0] === row && invalidCell[1] === col
  }

  const isSameNumber = (row: number, col: number) => {
    if (selectedNumber === null) return false
    const cellValue = board[row][col]
    const isMatch = cellValue === selectedNumber
    console.log(`Cell [${row},${col}] value: ${cellValue}, selectedNumber: ${selectedNumber}, isMatch: ${isMatch}`)
    return isMatch
  }

  const getInvalidCellValue = () => {
    return invalidCell ? invalidCell[2] : null
  }

  const isOriginalCell = (row: number, col: number) => {
    // Original cells are those that were filled at the start of the game
    return board[row][col] !== null
  }

  const isInCompletedSection = (row: number, col: number) => {
    return completedSections.some((section) => {
      if (section.type === "row") {
        return section.index === row
      } else if (section.type === "column") {
        return section.index === col
      } else if (section.type === "box") {
        const boxRow = Math.floor(row / 3)
        const boxCol = Math.floor(col / 3)
        return section.boxRow === boxRow && section.boxCol === boxCol
      }
      return false
    })
  }

  // Update the getCellStyle function to use Solana style
  const getCellStyle = (row: number, col: number) => {
    // Return just the base style, we'll handle highlighting separately
    return board[row][col] !== null ? "number-tile" : "bg-[#1a1a2e] hover:bg-[#252547] border border-[#14F195]/20"
  }

  const getCellContent = (row: number, col: number) => {
    // Show revealed number if this is the revealed cell
    if (revealedCell && revealedCell.row === row && revealedCell.col === col) {
      return revealedCell.value
    }

    return board[row][col]
  }

  const getCellClasses = (row: number, col: number) => {
    const isSelected = selectedCell?.[0] === row && selectedCell?.[1] === col
    const isComputerSelected = computerSelectedCell?.[0] === row && computerSelectedCell?.[1] === col
    const isInvalid = invalidCell?.[0] === row && invalidCell?.[1] === col
    const isRevealed = revealedCell?.row === row && revealedCell?.col === col
    const value = board[row][col]
    const isHighlighted = value !== null && value === selectedNumber

    return `
      relative flex items-center justify-center
      ${getCellBorderClasses(row, col)}
      ${isSelected ? 'bg-[#F5BC41]/20' : ''}
      ${isComputerSelected ? 'bg-[#CC7A4D]/20' : ''}
      ${isInvalid ? 'animate-shake' : ''}
      ${isHighlighted ? 'bg-[#F5BC41]/10' : ''}
      ${isRevealed ? 'bg-[#1B998B]/20' : ''}
      ${value === null ? 'hover:bg-[#F5BC41]/10 cursor-pointer' : ''}
      ${gameOver ? 'cursor-default' : ''}
      transition-colors
    `
  }

  // Group the cells into 3x3 boxes for better rendering
  const renderBoxes = () => {
    const boxes = [];
    
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const cells = [];
        
        for (let cellRow = 0; cellRow < 3; cellRow++) {
          for (let cellCol = 0; cellCol < 3; cellCol++) {
            const row = boxRow * 3 + cellRow;
            const col = boxCol * 3 + cellCol;
            const isInvalid = isInvalidCell(row, col);
            const isCompleted = isInCompletedSection(row, col);
            const isComputer = isComputerSelectedCell(row, col);
            const isSameNum = isSameNumber(row, col);
            const isStarCell = starCell?.row === row && starCell?.col === col;
            
            cells.push(
              <div
                key={`${row}-${col}`}
                data-cell={`${row}-${col}`}
                className={cn(
                  "aspect-square flex items-center justify-center",
                  "transition-all duration-200 relative",
                  "border border-[#14F195]/10",
                  "touch-manipulation",
                  getCellStyle(row, col),
                  // Cell state styling
                  isSelectedCell(row, col) &&
                    "ring-2 ring-[#14F195] z-10",
                  isComputer &&
                    "z-20 bg-[#FF6B6B]/30",
                  isInvalid && "z-10",
                  isCompleted && "animate-completed-flash",
                  !gameOver &&
                    currentPlayer === 0 &&
                    "cursor-pointer"
                )}
                onClick={() => !gameOver && currentPlayer === 0 && onCellSelect(row, col)}
              >
                {/* Add an overlay div for highlighting same numbers */}
                {isSameNum && (
                  <div className="absolute inset-0 bg-[#14F195]/60 border-2 border-[#14F195] z-5 rounded-lg" />
                )}
                
                {/* Cell content - large numbers for tiles */}
                {board[row][col] !== null ? (
                  <div className={`relative z-10 text-base md:text-lg font-bold ${isSameNum ? 'text-[#0D1117]' : 'text-white'}`}>
                    {getCellContent(row, col)}
                  </div>
                ) : (
                  <div className="relative z-10 text-xs text-[#14F195]/60">
                    {getCellContent(row, col)}
                  </div>
                )}

                {/* Star cell */}
                {isStarCell && !board[row][col] && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <span className="text-xl md:text-2xl animate-pulse">⭐</span>
                  </div>
                )}

                {/* Localized flash animation for invalid cells */}
                {isInvalid && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#FF6B6B]/80 rounded-lg z-30">
                    <div className="text-lg md:text-xl font-bold text-white animate-flash-number drop-shadow-lg">
                      {getInvalidCellValue()}
                    </div>
                  </div>
                )}
                
                {/* Computer selection pulse animation */}
                {isComputer && (
                  <div className="absolute inset-0 bg-[#FF6B6B]/30 animate-computer-pulse rounded"></div>
                )}
              </div>
            );
          }
        }
        
        boxes.push(
          <div 
            key={`box-${boxRow}-${boxCol}`} 
            className="grid grid-cols-3 grid-rows-3 relative border border-[#14F195]/50"
          >
            {cells}
          </div>
        );
      }
    }
    
    return boxes;
  };

  // Update the return statement with a better grid structure
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-0.5 bg-[#0D1117] p-0.5 rounded-lg border-2 border-[#14F195]/30 w-full">
      {renderBoxes()}
    </div>
  )
}

