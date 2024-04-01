export const TILE_SIZE = 48;
export const LASER_WIDTH = 5;
export const LASER_GROW_SPEED = 150; // as in 150 px per second

export const GAME_IMAGES = {
  laserH: { key: "laser-h", url: "assets/laser-horiz-1px.png" },
  laserV: { key: "laser-v", url: "assets/laser-vert-1px.png" },
  tileSelect: { key: "tileSelect", url: "assets/017-tile-select.png" },
  tileset: { key: "tileset", url: "assets/tileset.png" },
};

export const GAME_SPRITESHEETS = {
  spritesheet: { key: "spritesheet", url: "assets/tileset.png" },
}

export const GAME_TILEMAPS = {
  level00: { key: "level-00", url: "assets/levels/level-00.json" },
};

export const EVENTS = {
  blockHit: Symbol("blockHit"),
  mirrorBallHit: Symbol("mirrorBallHit"),
  laserHit: Symbol("laserHit"),
  dirChange: Symbol("dirChange"),
  targetReached: Symbol("targetReached"),
  tileSelected: Symbol("tileSelected"),
};
