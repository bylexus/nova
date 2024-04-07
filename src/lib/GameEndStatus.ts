enum GameEndStatus {
  WON,
  LOST,
}
export default GameEndStatus;

export function getGameEndStatusText(status: GameEndStatus): string {
  switch (status) {
	case GameEndStatus.WON:
	  return "YOU WIN !!!";
	case GameEndStatus.LOST:
	  return "YOU LOOSE !!!";
  }
}

