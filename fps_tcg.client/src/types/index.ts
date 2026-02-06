export type CardType = "attack" | "support";
export type GameView = 'Play' | 'Dice_Roll';
export type DiceSymbol = 'Knight' | 'Tank' | 'Mage' | 'Healer' | 'Rogue' | 'Jester';
export type Turn = 'player' | 'enemy';
export type GameStatus = 'playerTurn' | 'enemyTurn' | 'gameOver';
export type GameResult = null | "win" | "lose";