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

  // Update the getCellStyle function to use our new wooden style
  const getCellStyle = (row: number, col: number) => {
    // Return just the base style, we'll handle highlighting separately
    return board[row][col] !== null ? "number-tile" : "bg-[#F9EED7] hover:bg-[#F5DFB3]"
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
            
            cells.push(
              <div
                key={`${row}-${col}`}
                data-cell={`${row}-${col}`}
                className={cn(
                  "aspect-square flex items-center justify-center text-sm md:text-lg font-bold",
                  "transition-all duration-200 relative border border-[#D2B48C]",
                  getCellStyle(row, col),
                  // Cell state styling
                  isSelectedCell(row, col) &&
                    "ring-2 ring-[#F5BC41] z-10",
                  isComputer &&
                    "z-20 bg-[#F37B60]/30",
                  isInvalid && "ring-2 ring-red-500 z-10",
                  isCompleted && "animate-completed-cell",
                  !gameOver &&
                    currentPlayer === 0 &&
                    "cursor-pointer"
                )}
                onClick={() => !gameOver && currentPlayer === 0 && onCellSelect(row, col)}
              >
                {/* Add an overlay div for highlighting same numbers */}
                {isSameNum && (
                  <div className="absolute inset-0 bg-[#F5BC41]/70 z-5" />
                )}
                
                {/* Cell content */}
                <div className="relative z-10">
                  {isInvalid ? getInvalidCellValue() : board[row][col] !== null ? board[row][col] : ""}
                </div>

                {/* Localized flash animation for invalid cells */}
                {isInvalid && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-sm md:text-lg font-bold animate-flash-number">{getInvalidCellValue()}</div>
                  </div>
                )}
                
                {/* Computer selection pulse animation */}
                {isComputer && (
                  <div className="absolute inset-0 bg-[#F37B60]/30 animate-computer-pulse rounded"></div>
                )}
              </div>
            );
          }
        }
        
        boxes.push(
          <div 
            key={`box-${boxRow}-${boxCol}`} 
            className="grid grid-cols-3 grid-rows-3 relative overflow-hidden rounded-sm box-glow border-2 border-[#8B4513]"
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
    <div className="grid grid-cols-3 grid-rows-3 gap-1 bg-[#8B4513] p-1 rounded-lg shadow-lg">
      {renderBoxes()}
    </div>
  )
}

