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

  // Update the getCellStyle function to use our new wooden style
  const getCellStyle = (row: number, col: number) => {
    // Original cells use the golden letter tile style
    if (board[row][col] !== null) {
      return "number-tile"
    }
    
    // Empty cells have a lighter background
    return "bg-[#F9EED7] hover:bg-[#F5DFB3]"
  }

  // Get position-based styling for the cell
  const getCellPosition = (row: number, col: number) => {
    const classes = []
    
    // Add margin to create gaps between 3x3 boxes
    if ((col + 1) % 3 === 0 && col < 8) {
      classes.push("mr-[2px]") // Add right margin for cells at the end of 3x3 boxes (except last column)
    }
    
    if ((row + 1) % 3 === 0 && row < 8) {
      classes.push("mb-[2px]") // Add bottom margin for cells at the bottom of 3x3 boxes (except last row)
    }
    
    return classes.join(" ")
  }

  // Get border styling for cells
  const getCellBorders = (row: number, col: number) => {
    const classes = []
    
    // Right borders
    if (col < 8) {
      if ((col + 1) % 3 === 0) {
        classes.push("border-r-[2px] border-r-[#8C653C]")
      } else {
        classes.push("border-r-[1px] border-r-[#D2B48C]")
      }
    }
    
    // Bottom borders
    if (row < 8) {
      if ((row + 1) % 3 === 0) {
        classes.push("border-b-[2px] border-b-[#8C653C]")
      } else {
        classes.push("border-b-[1px] border-b-[#D2B48C]")
      }
    }

    // Add right edge
    if (col === 8) {
      classes.push("border-r-[1px] border-r-[#8C653C]")
    }

    // Add bottom edge
    if (row === 8) {
      classes.push("border-b-[1px] border-b-[#8C653C]")
    }
    
    return classes.join(" ")
  }

  // Update the return statement to use our wooden board style with gaps
  return (
    <div className="wooden-border p-[6px] rounded-lg shadow-xl overflow-hidden bg-[#B58853]">
      <div className="grid grid-cols-9 gap-0 bg-[#8C653C]">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isInvalid = isInvalidCell(rowIndex, colIndex)
            const isCompleted = isInCompletedSection(rowIndex, colIndex)

            // Calculate the 3x3 box this cell belongs to
            const boxRow = Math.floor(rowIndex / 3)
            const boxCol = Math.floor(colIndex / 3)

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                data-cell={`${rowIndex}-${colIndex}`}
                className={cn(
                  "aspect-square flex items-center justify-center text-sm md:text-lg font-bold",
                  "transition-all duration-200 relative",
                  getCellStyle(rowIndex, colIndex),
                  getCellBorders(rowIndex, colIndex),
                  getCellPosition(rowIndex, colIndex),
                  // Cell state styling
                  isSelectedCell(rowIndex, colIndex) &&
                    "ring-2 ring-[#F5BC41] z-10",
                  isComputerSelectedCell(rowIndex, colIndex) &&
                    "ring-2 ring-[#F37B60] z-10",
                  isInvalid && "ring-2 ring-red-500 z-10",
                  isCompleted && "animate-completed-cell",
                  cell === null &&
                    !gameOver &&
                    currentPlayer === 0 &&
                    "cursor-pointer hover:bg-[#F5DFB3]",
                )}
                onClick={() => cell === null && !isInvalid && onCellSelect(rowIndex, colIndex)}
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
    </div>
  )
}

