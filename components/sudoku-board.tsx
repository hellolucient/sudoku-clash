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

  // Update the getCellGradient function to provide better contrast
  const getCellGradient = (row: number, col: number) => {
    const boxRow = Math.floor(row / 3)
    const boxCol = Math.floor(col / 3)

    // Create alternating box colors with better contrast
    if ((boxRow + boxCol) % 2 === 0) {
      return "bg-gradient-to-br from-purple-100 to-purple-200"
    } else {
      return "bg-gradient-to-br from-indigo-100 to-indigo-200"
    }
  }

  // Update the return statement to use darker text colors
  return (
    <div className="grid grid-cols-9 gap-[1px] bg-fuchsia-500 p-[2px] rounded-lg shadow-xl animate-pulse-glow overflow-hidden">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isInvalid = isInvalidCell(rowIndex, colIndex)
          const isCompleted = isInCompletedSection(rowIndex, colIndex)

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              data-cell={`${rowIndex}-${colIndex}`}
              className={cn(
                "aspect-square flex items-center justify-center text-sm md:text-lg font-bold",
                "transition-all duration-200 relative",
                getCellGradient(rowIndex, colIndex),
                // Border styling for 3x3 boxes
                (colIndex + 1) % 3 === 0 && colIndex < 8 && "border-r-[1px] md:border-r-2 border-r-fuchsia-500",
                (rowIndex + 1) % 3 === 0 && rowIndex < 8 && "border-b-[1px] md:border-b-2 border-b-fuchsia-500",
                // Cell state styling
                isSelectedCell(rowIndex, colIndex) &&
                  "bg-gradient-to-br from-cyan-200 to-cyan-300 ring-2 ring-cyan-500",
                isComputerSelectedCell(rowIndex, colIndex) &&
                  "bg-gradient-to-br from-fuchsia-200 to-fuchsia-300 ring-2 ring-fuchsia-500",
                isOriginalCell(rowIndex, colIndex) && "font-extrabold text-purple-900",
                !isOriginalCell(rowIndex, colIndex) && cell !== null && "text-indigo-900",
                isCompleted && "animate-completed-cell",
                cell === null &&
                  !gameOver &&
                  currentPlayer === 0 &&
                  "cursor-pointer hover:bg-gradient-to-br hover:from-pink-100 hover:to-pink-200",
              )}
              onClick={() => cell === null && onCellSelect(rowIndex, colIndex)}
            >
              {isInvalid ? getInvalidCellValue() : cell !== null ? cell : ""}

              {/* Localized flash animation for invalid cells */}
              {isInvalid && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-sm md:text-lg font-bold animate-flash-number">{getInvalidCellValue()}</div>
                </div>
              )}
            </div>
          )
        }),
      )}
    </div>
  )
}

