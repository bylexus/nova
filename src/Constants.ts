export const TILE_SIZE = 48;
export const LASER_WIDTH = 5;
export const LASER_GROW_SPEED = 120; // as in 120 px per second

export const GAME_IMAGES = {
  laserH: { key: "laser-h", url: "assets/laser-horiz-1px.png" },
  laserV: { key: "laser-v", url: "assets/laser-vert-1px.png" },
  laserHead: { key: "laserHead", url: "assets/020-laser-head.png" },
  tileSelect: { key: "tileSelect", url: "assets/017-tile-select.png" },
  startBtn: { key: "startBtn", url: "assets/018-start-btn.png" },
  resetBtn: { key: "resetBtn", url: "assets/019-reset-btn.png" },
  forbiddenBlock: { key: "forbidden-block", url: "assets/021-forbidden-block.png" },
  tileset: { key: "tileset", url: "assets/tileset.png" },
};

export const GAME_SPRITESHEETS = {
  spritesheet: { key: "spritesheet", url: "assets/tileset.png" },
}

export const GAME_TILEMAPS = {
  level00: { key: "level-00", url: "assets/levels/level-00.json" },
  level01: { key: "level-01", url: "assets/levels/level-01.json" },
  level02: { key: "level-02", url: "assets/levels/level-02.json" },
  level03: { key: "level-03", url: "assets/levels/level-03.json" },
  level04: { key: "level-04", url: "assets/levels/level-04.json" },
};

export const EVENTS = {
  blockHit: Symbol("blockHit"),
  mirrorBallHit: Symbol("mirrorBallHit"),
  laserHit: Symbol("laserHit"),
  dirChange: Symbol("dirChange"),
  targetReached: Symbol("targetReached"),
  tileSelected: Symbol("tileSelected"),
};
