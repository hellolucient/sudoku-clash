"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SudokuBoard from "./sudoku-board"
import PlayerHand from "./player-hand"
import VictoryCelebration from "./victory-celebration"
import DefeatMessage from "./defeat-message"
import { generateSudokuPuzzle } from "@/lib/sudoku-generator"
import { checkValidPlacement, isRowComplete, isColumnComplete, isBoxComplete } from "@/lib/sudoku-validator"
import { playSound, addFloatingPoints } from "@/lib/game-utils"
import { usePlayerProfile } from "../contexts/player-profile-context"
import PowerUpButton from "./power-up-button"
import PowerUpNotification from "./power-up-notification"

type Player = {
  name: string
  score: number
  hand: number[]
}

type PowerUpType = 'peek' | 'swap' | 'steal' | 'skip'

type PowerUps = {
  [key in PowerUpType]: number
}

type GameState = {
  board: (number | null)[][]
  solution: number[][]
  pool: number[]
  currentPlayer: number
  players: Player[]
  gameOver: boolean
  message: string
  startTime?: number
  powerUps: PowerUps[]
  activePowerUp?: PowerUpType | null
  revealedCell?: { row: number; col: number; value: number }
  stolenTileIndex?: number
  powerUpUsedThisTurn?: boolean
  lastUsedPowerUp?: PowerUpType | null
}

type CompletedSection = {
  type: "row" | "column" | "box"
  index: number
  boxRow?: number
  boxCol?: number
}

type SudokuGameProps = {
  onExit: () => void
  difficulty: "easy" | "medium" | "hard"
}

const DIFFICULTY_LEVELS = {
  easy: 40,
  medium: 30,
  hard: 20,
}

export default function SudokuGame({ onExit, difficulty }: SudokuGameProps) {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null)
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null)
  const [invalidCells, setInvalidCells] = useState<Array<[number, number]>>([])
  const [invalidCell, setInvalidCell] = useState<[number, number, number] | null>(null)
  const [computerSelectedCell, setComputerSelectedCell] = useState<[number, number] | null>(null)
  const [completedSections, setCompletedSections] = useState<CompletedSection[]>([])
  const boardRef = useRef<HTMLDivElement>(null)
  const { updateStats, profile, updateProfile } = usePlayerProfile()
  const [showEndMessage, setShowEndMessage] = useState(false)
  const [powerUpNotification, setPowerUpNotification] = useState<{
    isVisible: boolean
    action: PowerUpType
    player: 'player' | 'cpu'
  }>({
    isVisible: false,
    action: 'peek',
    player: 'player'
  })

  // Start game automatically when component mounts
  useEffect(() => {
    startNewGame()
  }, [])

  // Initialize or reset the game
  const startNewGame = () => {
    playSound("gameOver") // Reusing game over sound for start game

    const { puzzle, solution } = generateSudokuPuzzle(DIFFICULTY_LEVELS[difficulty])

    // Create a pool of remaining numbers
    const pool: number[] = []
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (puzzle[i][j] === null) {
          pool.push(solution[i][j])
        }
      }
    }

    // Shuffle the pool
    pool.sort(() => Math.random() - 0.5)

    // Create player hands
    const playerHand = pool.splice(0, 7)
    const computerHand = pool.splice(0, 7)

    const initialPowerUps: PowerUps[] = [
      { 
        peek: profile?.powerups.peek || 3,
        swap: profile?.powerups.swap || 3,
        steal: profile?.powerups.steal || 3,
        skip: profile?.powerups.skip || 3
      },
      { peek: 3, swap: 3, steal: 3, skip: 3 } // CPU's power-ups
    ]

    setGameState({
      board: puzzle,
      solution,
      pool,
      currentPlayer: 0, // 0 for player, 1 for computer
      players: [
        { name: "You", score: 0, hand: playerHand },
        { name: "Computer", score: 0, hand: computerHand },
      ],
      gameOver: false,
      message: "Your turn! Select a cell and then a number from your hand.",
      startTime: Date.now(), // Track when the game started
      powerUps: initialPowerUps,
    })

    setSelectedCell(null)
    setSelectedNumber(null)
    setInvalidCells([])
    setCompletedSections([])
  }

  // Count empty cells on the board
  const countEmptyCells = (board: (number | null)[][]) => {
    let count = 0
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === null) {
          count++
        }
      }
    }
    return count
  }

  // Check if the game should end
  const shouldGameEnd = (board: (number | null)[][], player1Hand: number[], player2Hand: number[], pool: number[]) => {
    // Game ends when the board is full
    const emptyCells = countEmptyCells(board)
    if (emptyCells === 0) return true

    // Game ends when both players have no tiles and the pool is empty
    if (player1Hand.length === 0 && player2Hand.length === 0 && pool.length === 0) return true

    // Game should not end if there are empty cells and tiles available
    return false
  }

  // Handle cell select
  const handleCellSelect = (row: number, col: number) => {
    if (!gameState || gameState.gameOver || gameState.currentPlayer !== 0) return

    // Handle peek power-up
    if (gameState.activePowerUp === 'peek') {
      if (gameState.board[row][col] === null) {
        const value = gameState.solution[row][col]
        setGameState({
          ...gameState,
          revealedCell: { row, col, value },
          activePowerUp: null,
          message: `The correct number for this cell is ${value}. Make your move!`
        })
      }
      return
    }

    // Clear revealed cell on any cell click after peek
    if (gameState.revealedCell) {
      setGameState({
        ...gameState,
        revealedCell: undefined,
        message: "Your turn! Select a cell and then a number from your hand."
      })
    }

    // Normal cell selection logic
    if (gameState.board[row][col] !== null) {
      const number = gameState.board[row][col]
      if (selectedNumber === number) {
        setSelectedNumber(null)
      } else {
        setSelectedNumber(number)
      }
      return
    }

    setSelectedNumber(null)
    playSound("select")
    setSelectedCell([row, col])
  }

  // Handle tile selection from player's hand
  const handleTileSelect = (index: number) => {
    if (!gameState || gameState.gameOver || gameState.currentPlayer !== 0) return

    // Handle swap power-up
    if (gameState.activePowerUp === 'swap' && gameState.pool.length > 0) {
      const updatedGameState = { ...gameState }
      const playerHand = [...updatedGameState.players[0].hand]
      const tileToSwap = playerHand[index]
      
      // Get a random tile from the pool
      const poolIndex = Math.floor(Math.random() * updatedGameState.pool.length)
      const poolTile = updatedGameState.pool[poolIndex]
      
      // Swap the tiles
      playerHand[index] = poolTile
      updatedGameState.pool[poolIndex] = tileToSwap
      updatedGameState.players[0].hand = playerHand
      updatedGameState.activePowerUp = null
      updatedGameState.stolenTileIndex = index // Highlight the new tile
      
      // Show notification for the swap completion
      setPowerUpNotification({
        isVisible: true,
        action: 'swap',
        player: 'player'
      })

      setGameState(updatedGameState)

      // Clear the highlight after the next click
      const clearHighlight = () => {
        setGameState(prev => prev ? { ...prev, stolenTileIndex: undefined } : null)
        document.removeEventListener('click', clearHighlight)
      }
      document.addEventListener('click', clearHighlight)
      
      return
    }

    // Normal tile selection logic
    if (!selectedCell) return
    const [row, col] = selectedCell
    handleMove(row, col, index)
  }

  // Computer's turn
  useEffect(() => {
    if (!gameState || gameState.gameOver || gameState.currentPlayer !== 1) return

    // Add a delay to make the computer's move more natural
    const timeoutId = setTimeout(() => {
      computerMove()
    }, 1500)

    return () => clearTimeout(timeoutId)
  }, [gameState])

  const computerMove = () => {
    if (!gameState) return

    // Find valid moves
    const validMoves: Array<{ row: number; col: number; number: number; index: number }> = []

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (gameState.board[i][j] === null) {
          gameState.players[1].hand.forEach((number, index) => {
            if (checkValidPlacement(gameState.solution, i, j, number)) {
              validMoves.push({ row: i, col: j, number, index })
            }
          })
        }
      }
    }

    // If no valid moves, make a random move
    let move
    let isValid = false

    if (validMoves.length > 0) {
      // Choose a random valid move
      move = validMoves[Math.floor(Math.random() * validMoves.length)]
      isValid = true
    } else {
      // Make a random move
      const emptyCells: Array<[number, number]> = []
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (gameState.board[i][j] === null) {
            emptyCells.push([i, j])
          }
        }
      }

      if (emptyCells.length === 0 || gameState.players[1].hand.length === 0) {
        // No moves possible
        drawTilesAndSwitchTurn()
        return
      }

      const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)]
      const handIndex = Math.floor(Math.random() * gameState.players[1].hand.length)
      const number = gameState.players[1].hand[handIndex]

      move = { row, col, number, index: handIndex }
    }

    // Show the computer's selected cell
    setComputerSelectedCell([move.row, move.col])
    playSound("select")

    // Get cell position for floating points
    const cellElement = document.querySelector(`[data-cell="${move.row}-${move.col}"]`)
    let pointX = 0
    let pointY = 0

    if (cellElement) {
      const rect = cellElement.getBoundingClientRect()
      pointX = rect.left + rect.width / 2
      pointY = rect.top
    } else if (boardRef.current) {
      // Fallback to board position
      const rect = boardRef.current.getBoundingClientRect()
      pointX = rect.left + rect.width / 2
      pointY = rect.top + rect.height / 2
    }

    // Delay the actual move to show the selection (increased from 1 second to 1.5 seconds)
    setTimeout(() => {
      // Update the board
      const newBoard = gameState.board.map((r) => [...r])

      // Remove the tile from computer's hand
      const updatedComputerHand = [...gameState.players[1].hand]
      updatedComputerHand.splice(move.index, 1)

      // Update score
      let scoreChange = isValid ? move.number : -10
      let message = isValid
        ? `Computer placed ${move.number} correctly! +${move.number} points.`
        : `Computer made an invalid placement! -10 points.`

      const newPool = [...gameState.pool]
      const updatedPlayers = [...gameState.players]

      // Update computer's hand
      updatedPlayers[1] = {
        ...updatedPlayers[1],
        score: updatedPlayers[1].score + scoreChange,
        hand: updatedComputerHand,
      }

      if (isValid) {
        // Play sound
        playSound("place")

        // Show floating points
        addFloatingPoints(move.number, pointX, pointY)

        // Update the board permanently for valid moves
        newBoard[move.row][move.col] = move.number

        // Check for completions and collect them
        const newCompletedSections: CompletedSection[] = []

        // Check row completion
        if (isRowComplete(newBoard, move.row)) {
          scoreChange += 25
          message += " Row complete! +25 bonus points."
          newCompletedSections.push({ type: "row", index: move.row })

          // Play bonus sound and show floating points
          setTimeout(() => {
            playSound("bonus")
            addFloatingPoints(25, pointX, pointY - 20, true)
          }, 300)
        }

        // Check column completion
        if (isColumnComplete(newBoard, move.col)) {
          scoreChange += 25
          message += " Column complete! +25 bonus points."
          newCompletedSections.push({ type: "column", index: move.col })

          // Play bonus sound and show floating points with slight delay
          setTimeout(() => {
            playSound("bonus")
            addFloatingPoints(25, pointX + 20, pointY - 20, true)
          }, 600)
        }

        // Check box completion
        const boxRow = Math.floor(move.row / 3)
        const boxCol = Math.floor(move.col / 3)
        if (isBoxComplete(newBoard, boxRow, boxCol)) {
          scoreChange += 50
          message += " Box complete! +50 bonus points."
          newCompletedSections.push({ type: "box", index: boxRow * 3 + boxCol, boxRow, boxCol })

          // Play bonus sound and show floating points with slight delay
          setTimeout(() => {
            playSound("complete")
            addFloatingPoints(50, pointX - 20, pointY - 20, true)
          }, 900)
        }

        // If there are completed sections, show the animation
        if (newCompletedSections.length > 0) {
          setCompletedSections(newCompletedSections)

          // Clear the completed sections after animation
          setTimeout(() => {
            setCompletedSections([])
          }, 1800) // Animation lasts 1.8s (3 flashes)
        }

        // Update computer's score with bonuses
        updatedPlayers[1].score = updatedPlayers[1].score + scoreChange - move.number // We already added the tile value
      } else {
        // Play invalid sound
        playSound("invalid")

        // Show floating points for penalty
        addFloatingPoints(-10, pointX, pointY)

        // For invalid moves, show animation but don't update board
        setInvalidCell([move.row, move.col, move.number])

        // If pool is empty, give the tile to the opponent (player)
        if (newPool.length === 0) {
          updatedPlayers[0].hand.push(move.number)
          message += " Pool is empty - Invalid tile given to you as bonus!"
        } else {
          // Keep the tile in CPU's hand when there are tiles in the pool
          updatedComputerHand.push(move.number)
          message += " CPU keeps the tile."
        }

        // Clear the invalid cell after animation
        setTimeout(() => {
          setInvalidCell(null)
        }, 1500)
      }

      // Draw a new tile if possible
      if (newPool.length > 0) {
        const newTile = newPool.pop()
        updatedPlayers[1].hand.push(newTile!)
        message += " Computer drew a new tile."

        // Play draw sound
        setTimeout(() => {
          playSound("draw")
        }, 500)
      }

      // Check if game should end
      const gameOver = shouldGameEnd(newBoard, updatedPlayers[0].hand, updatedPlayers[1].hand, newPool)

      let nextPlayer = 0 // Default to player's turn
      if (!gameOver && updatedPlayers[0].hand.length === 0) {
        message += " You have no tiles. Computer's turn continues."
        nextPlayer = 1 // Keep it as computer's turn
      }

      setGameState({
        ...gameState,
        board: newBoard,
        players: updatedPlayers,
        pool: newPool,
        currentPlayer: nextPlayer,
        gameOver,
        message: gameOver ? determineWinner(updatedPlayers) : message + (nextPlayer === 0 ? " Your turn!" : ""),
        // Only reset power-up flags if this wasn't after a skip
        powerUpUsedThisTurn: gameState.lastUsedPowerUp === 'skip' ? true : false,
        lastUsedPowerUp: gameState.lastUsedPowerUp === 'skip' ? 'skip' : null
      })

      setComputerSelectedCell(null)

      // If game is over, show winner
      if (gameOver) {
        endGame(updatedPlayers)
      }
    }, 1500)
  }

  // Draw tiles and switch turn if no moves possible
  const drawTilesAndSwitchTurn = () => {
    if (!gameState) return

    const updatedGameState = { ...gameState }
    const currentPlayerIndex = updatedGameState.currentPlayer
    const nextPlayerIndex = currentPlayerIndex === 0 ? 1 : 0

    // Draw tiles if possible
    if (updatedGameState.pool.length > 0) {
      const tilesToDraw = Math.min(
        7 - updatedGameState.players[currentPlayerIndex].hand.length,
        updatedGameState.pool.length,
      )

      if (tilesToDraw > 0) {
        const newTiles = updatedGameState.pool.splice(0, tilesToDraw)
        updatedGameState.players[currentPlayerIndex].hand.push(...newTiles)

        updatedGameState.message = `${updatedGameState.players[currentPlayerIndex].name} drew ${tilesToDraw} new tiles. ${updatedGameState.players[nextPlayerIndex].name}'s turn!`

        // Play draw sound
        playSound("draw")
      }
    }

    // Only switch turns if the next player has tiles
    if (updatedGameState.players[nextPlayerIndex].hand.length > 0) {
      updatedGameState.currentPlayer = nextPlayerIndex
      updatedGameState.message = `${updatedGameState.players[nextPlayerIndex].name}'s turn!`
    } else {
      // Keep the current player's turn if they still have tiles
      if (updatedGameState.players[currentPlayerIndex].hand.length > 0) {
        updatedGameState.message = `${updatedGameState.players[nextPlayerIndex].name} has no tiles. ${updatedGameState.players[currentPlayerIndex].name} continues playing.`
      } else {
        // If neither player has tiles and there are no tiles in the pool, end the game
        if (updatedGameState.pool.length === 0) {
          endGame(updatedGameState.players)
          return
        }
      }
    }

    setGameState(updatedGameState)
  }

  // End the game and determine the winner
  const endGame = (players: Player[]) => {
    const winnerMessage = determineWinner(players)
    const gameEndTime = Date.now()
    const gameStartTime = gameState?.startTime || gameEndTime
    const gameTimeInSeconds = Math.floor((gameEndTime - gameStartTime) / 1000)
    
    setGameState((prev) => (prev ? { ...prev, gameOver: true, message: winnerMessage } : null))
    setShowEndMessage(true)

    const playerWon = players[0].score > players[1].score
    
    // Create a victory sound sequence if the player wins
    if (playerWon) {
      // Play a sequence of sounds for victory
      playSound("complete")
      setTimeout(() => playSound("bonus"), 300)
      setTimeout(() => playSound("complete"), 600)
      setTimeout(() => playSound("gameOver"), 1200)
    } else {
      // Just play game over sound for loss
      playSound("gameOver")
    }
    
    // Update player stats with game result
    updateStats({
      won: playerWon,
      score: players[0].score,
      timeInSeconds: gameTimeInSeconds,
      difficulty: difficulty
    })
  }

  const handleCloseEndMessage = () => {
    setShowEndMessage(false)
  }

  // Determine the winner
  const determineWinner = (players: Player[]) => {
    if (players[0].score > players[1].score) {
      return `Game Over! You win with ${players[0].score} points vs Computer's ${players[1].score} points!`
    } else if (players[1].score > players[0].score) {
      return `Game Over! Computer wins with ${players[1].score} points vs your ${players[0].score} points!`
    } else {
      return `Game Over! It's a tie with ${players[0].score} points each!`
    }
  }

  // Handle power-up usage
  const handlePowerUp = (type: PowerUpType) => {
    if (!gameState || gameState.gameOver || gameState.currentPlayer !== 0) return
    if (gameState.powerUps[0][type] === 0) return

    // Check if a power-up was already used this turn
    if (gameState.powerUpUsedThisTurn) {
      setGameState(prev => prev ? {
        ...prev,
        message: prev.lastUsedPowerUp === 'skip' ? "You must take your turn now!" : "You can only use one power-up per turn!"
      } : null)
      return
    }

    const updatedGameState = { ...gameState }
    
    // If a power-up is already active, cancel it
    if (gameState.activePowerUp) {
      updatedGameState.activePowerUp = null
      updatedGameState.message = "Power-up cancelled. Your turn!"
      setGameState(updatedGameState)
      return
    }

    // Activate the power-up
    updatedGameState.activePowerUp = type
    updatedGameState.powerUps[0][type]--
    updatedGameState.powerUpUsedThisTurn = true // Mark that a power-up was used this turn
    updatedGameState.lastUsedPowerUp = type // Track the last used power-up

    // Update the player's profile power-up count
    if (profile) {
      const powerups = { ...profile.powerups }
      powerups[type]--
      updateProfile({ powerups })
    }

    switch (type) {
      case 'peek':
        updatedGameState.message = "Select an empty cell to peek at its number."
        break

      case 'swap':
        if (gameState.pool.length === 0) {
          updatedGameState.activePowerUp = null
          updatedGameState.powerUps[0][type]++ // Refund the power-up
          updatedGameState.powerUpUsedThisTurn = false // Reset since power-up wasn't actually used
          updatedGameState.message = "No tiles in the pool to swap with!"
          break
        }
        // Show initial swap message
        setPowerUpNotification({
          isVisible: true,
          action: 'swap',
          player: 'player'
        })
        updatedGameState.message = "Select a tile from YOUR HAND to swap with the Pool."
        break

      case 'steal':
        // Steal a random tile from CPU's hand
        if (updatedGameState.players[1].hand.length > 0) {
          const randomIndex = Math.floor(Math.random() * updatedGameState.players[1].hand.length)
          const stolenTile = updatedGameState.players[1].hand.splice(randomIndex, 1)[0]
          updatedGameState.players[0].hand.push(stolenTile)
          updatedGameState.message = `Stole a ${stolenTile} from CPU! Your turn.`
          updatedGameState.stolenTileIndex = updatedGameState.players[0].hand.length - 1
          updatedGameState.activePowerUp = null // Immediately deactivate since no further action needed

          // Clear the stolen tile highlight after 2 seconds
          setTimeout(() => {
            setGameState(prev => prev ? { ...prev, stolenTileIndex: undefined } : null)
          }, 2000)
        } else {
          updatedGameState.message = "CPU has no tiles to steal!"
        }
        break

      case 'skip':
        updatedGameState.currentPlayer = 1
        updatedGameState.activePowerUp = null // Immediately deactivate since no further action needed
        updatedGameState.message = "Skipped your turn. CPU's turn!"
        break
    }

    // Show notification
    setPowerUpNotification({
      isVisible: true,
      action: type,
      player: 'player'
    })

    setGameState(updatedGameState)
  }

  // Handle CPU power-up usage
  const handleCPUPowerUp = () => {
    if (!gameState || gameState.gameOver || gameState.currentPlayer !== 1) return

    const availablePowerUps = Object.entries(gameState.powerUps[1])
      .filter(([type, count]) => count > 0)
      .map(([type]) => type as PowerUpType)

    if (availablePowerUps.length === 0) return

    const randomPowerUp = availablePowerUps[Math.floor(Math.random() * availablePowerUps.length)]
    const updatedGameState = { ...gameState }
    updatedGameState.powerUps[1][randomPowerUp]--

    // Implement CPU power-up logic similar to player's but automated
    // ... CPU power-up implementation ...

    // Show notification
    setPowerUpNotification({
      isVisible: true,
      action: randomPowerUp,
      player: 'cpu'
    })

    setGameState(updatedGameState)
  }

  const handleMove = (row: number, col: number, handIndex: number) => {
    if (!gameState) return

    const number = gameState.players[0].hand[handIndex]

    // Check if placement is valid
    const isValid = checkValidPlacement(gameState.solution, row, col, number)

    // Update score
    let scoreChange = isValid ? number : -10
    let message = isValid ? `You placed ${number} correctly! +${number} points.` : `Invalid placement! -10 points.`

    // Create a temporary board for animation
    const newBoard = gameState.board.map((r) => [...r])
    const newPool = [...gameState.pool]
    const updatedPlayers = [...gameState.players]

    // Get cell position for floating points
    const cellElement = document.querySelector(`[data-cell="${row}-${col}"]`)
    let pointX = 0
    let pointY = 0

    if (cellElement) {
      const rect = cellElement.getBoundingClientRect()
      pointX = rect.left + rect.width / 2
      pointY = rect.top
    } else if (boardRef.current) {
      // Fallback to board position
      const rect = boardRef.current.getBoundingClientRect()
      pointX = rect.left + rect.width / 2
      pointY = rect.top + rect.height / 2
    }

    // Create a copy of the player's hand that we'll modify based on the move's validity
    const updatedPlayerHand = [...gameState.players[0].hand]

    if (isValid) {
      // Remove the tile from player's hand for valid moves
      updatedPlayerHand.splice(handIndex, 1)

      // Play sound
      playSound("place")

      // Show floating points
      addFloatingPoints(number, pointX, pointY)

      // Update the board permanently for valid moves
      newBoard[row][col] = number

      // Check for completions and collect them
      const newCompletedSections: CompletedSection[] = []

      // Check row completion
      if (isRowComplete(newBoard, row)) {
        scoreChange += 25
        message += " Row complete! +25 bonus points."
        newCompletedSections.push({ type: "row", index: row })

        // Play bonus sound and show floating points
        setTimeout(() => {
          playSound("bonus")
          addFloatingPoints(25, pointX, pointY - 20, true)
        }, 300)
      }

      // Check column completion
      if (isColumnComplete(newBoard, col)) {
        scoreChange += 25
        message += " Column complete! +25 bonus points."
        newCompletedSections.push({ type: "column", index: col })

        // Play bonus sound and show floating points with slight delay
        setTimeout(() => {
          playSound("bonus")
          addFloatingPoints(25, pointX + 20, pointY - 20, true)
        }, 600)
      }

      // Check box completion
      const boxRow = Math.floor(row / 3)
      const boxCol = Math.floor(col / 3)
      if (isBoxComplete(newBoard, boxRow, boxCol)) {
        scoreChange += 50
        message += " Box complete! +50 bonus points."
        newCompletedSections.push({ type: "box", index: boxRow * 3 + boxCol, boxRow, boxCol })

        // Play bonus sound and show floating points with slight delay
        setTimeout(() => {
          playSound("complete")
          addFloatingPoints(50, pointX - 20, pointY - 20, true)
        }, 900)
      }

      // If there are completed sections, show the animation
      if (newCompletedSections.length > 0) {
        setCompletedSections(newCompletedSections)

        // Clear the completed sections after animation
        setTimeout(() => {
          setCompletedSections([])
        }, 1800) // Animation lasts 1.8s (3 flashes)
      }

      // Draw a new tile if possible (only for valid moves)
      if (newPool.length > 0) {
        const newTile = newPool.pop()
        updatedPlayerHand.push(newTile!)
        message += " Drew a new tile."

        // Play draw sound
        setTimeout(() => {
          playSound("draw")
        }, 500)
      }
    } else {
      // Play invalid sound
      playSound("invalid")

      // Show floating points for penalty
      addFloatingPoints(-10, pointX, pointY)

      // For invalid moves, show animation but don't update board
      setInvalidCell([row, col, number])

      // If pool is empty, give the tile to the opponent as an extra penalty
      if (newPool.length === 0) {
        // Remove the tile from player's hand and give it to CPU
        updatedPlayerHand.splice(handIndex, 1)
        updatedPlayers[1].hand.push(number)
        message += " Pool is empty - Invalid tile given to CPU as penalty!"
      } else {
        // Keep the tile in player's hand (no changes needed to updatedPlayerHand)
        message += " Invalid placement! Keep your tile. CPU's turn."
      }

      // Clear the invalid cell after animation
      setTimeout(() => {
        setInvalidCell(null)
      }, 1500)
    }

    // Update player's score and hand
    updatedPlayers[0] = {
      ...updatedPlayers[0],
      score: updatedPlayers[0].score + scoreChange,
      hand: updatedPlayerHand,
    }

    // Check if game should end
    const gameOver = shouldGameEnd(newBoard, updatedPlayers[0].hand, updatedPlayers[1].hand, newPool)

    // Determine next player
    let nextPlayer = 1  // Always go to CPU after player's move (valid or invalid)
    if (!gameOver && updatedPlayers[1].hand.length === 0) {
      message += " Computer has no tiles. Your turn continues."
      nextPlayer = 0 // Keep it as player's turn only if CPU has no tiles
    }

    setGameState({
      ...gameState,
      board: newBoard,
      players: updatedPlayers,
      pool: newPool,
      currentPlayer: nextPlayer,
      message: message + (nextPlayer === 0 ? " Your turn!" : ""),
      gameOver,
      powerUpUsedThisTurn: false, // Reset when turn changes
      lastUsedPowerUp: null // Reset when a move is made
    })

    setSelectedCell(null)
    setSelectedNumber(null)

    // If game is over, show winner
    if (gameOver) {
      endGame(updatedPlayers)
    }
  }

  // Update the message area and score display for better contrast
  return (
    <div className="flex flex-col gap-1">
      {gameState && (
        <>
          <div className="flex justify-between items-center p-1 md:p-2 bg-[#F9EED7]/90 rounded-xl shadow-lg border border-[#8C653C]">
            <div className="text-sm md:text-base font-bold text-[#4B3418]">
              <span className="text-[#1B998B]">YOU:</span> {gameState.players[0].score}
            </div>
            <div className="text-sm md:text-base font-bold text-[#4B3418]">
              <span className="text-[#CC7A4D]">CPU:</span> {gameState.players[1].score}
            </div>
          </div>

          <div className="flex justify-center gap-2 p-1 md:p-2 bg-[#F9EED7]/90 rounded-xl shadow-lg border border-[#8C653C]">
            <PowerUpButton
              type="peek"
              count={gameState.powerUps[0].peek}
              disabled={gameState.currentPlayer !== 0 || gameState.gameOver}
              onClick={() => handlePowerUp('peek')}
            />
            <PowerUpButton
              type="swap"
              count={gameState.powerUps[0].swap}
              disabled={gameState.currentPlayer !== 0 || gameState.gameOver}
              onClick={() => handlePowerUp('swap')}
            />
            <PowerUpButton
              type="steal"
              count={gameState.powerUps[0].steal}
              disabled={gameState.currentPlayer !== 0 || gameState.gameOver}
              onClick={() => handlePowerUp('steal')}
            />
            <PowerUpButton
              type="skip"
              count={gameState.powerUps[0].skip}
              disabled={gameState.currentPlayer !== 0 || gameState.gameOver}
              onClick={() => handlePowerUp('skip')}
            />
          </div>

          <div className="p-1 bg-[#F9EED7]/90 rounded-xl mb-1 border-l-4 border-[#F5BC41] shadow-lg">
            <p className="text-xs text-[#4B3418] font-medium">{gameState.message}</p>
          </div>

          <div ref={boardRef}>
            <SudokuBoard
              board={gameState.board}
              onCellSelect={handleCellSelect}
              selectedCell={selectedCell}
              invalidCell={invalidCell}
              computerSelectedCell={computerSelectedCell}
              completedSections={completedSections}
              currentPlayer={gameState.currentPlayer}
              gameOver={gameState.gameOver}
              selectedNumber={selectedNumber}
              revealedCell={gameState.revealedCell}
            />
          </div>

          <div className="mt-1">
            <h3 className="text-xs md:text-sm font-bold mb-1 text-white bg-gradient-to-r from-[#B58853] to-[#9E7142] px-2 py-0.5 rounded-lg inline-block shadow-md">
              YOUR HAND
            </h3>
            <PlayerHand
              tiles={gameState.players[0].hand}
              onTileSelect={handleTileSelect}
              disabled={gameState.currentPlayer !== 0 || gameState.gameOver}
              highlightedTileIndex={gameState.stolenTileIndex}
            />
          </div>

          <div className="mt-1 flex justify-between text-xs">
            <div className="bg-[#F9EED7]/90 text-[#4B3418] font-bold px-2 py-0.5 rounded-full border border-[#8C653C]">
              Pool: {gameState.pool.length}
            </div>
            <div className="bg-[#F9EED7]/90 text-[#4B3418] font-bold px-2 py-0.5 rounded-full border border-[#8C653C]">
              CPU: {gameState.players[1].hand.length}
            </div>
          </div>

          {gameState.gameOver && (
            <Button
              onClick={startNewGame}
              className="mt-2 bg-gradient-to-r from-[#CC7A4D] to-[#F37B60] hover:from-[#B56E45] hover:to-[#E56F55] text-white font-bold shadow-lg hover:shadow-xl transition-all border border-[#8C653C]"
            >
              PLAY AGAIN
            </Button>
          )}

          {!gameState.gameOver && (
            <Button
              onClick={onExit}
              className="mt-2 bg-gradient-to-r from-[#CC7A4D] to-[#F37B60] hover:from-[#B56E45] hover:to-[#E56F55] text-white font-bold shadow-lg hover:shadow-xl transition-all border border-[#8C653C]"
            >
              EXIT GAME
            </Button>
          )}

          <VictoryCelebration 
            isVisible={showEndMessage && gameState.gameOver && gameState.players[0].score > gameState.players[1].score}
            score={gameState.players[0].score}
            onClose={handleCloseEndMessage}
            onPlayAgain={() => {
              handleCloseEndMessage();
              startNewGame();
            }}
          />
          
          <DefeatMessage
            isVisible={showEndMessage && gameState.gameOver && gameState.players[0].score < gameState.players[1].score}
            score={gameState.players[0].score}
            onClose={handleCloseEndMessage}
            onPlayAgain={() => {
              handleCloseEndMessage();
              startNewGame();
            }}
          />

          <PowerUpNotification
            isVisible={powerUpNotification.isVisible}
            action={powerUpNotification.action}
            player={powerUpNotification.player}
            onClose={() => setPowerUpNotification(prev => ({ ...prev, isVisible: false }))}
            gameState={gameState}
          />
        </>
      )}
    </div>
  )
}

