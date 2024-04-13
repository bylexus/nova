export const TILE_SIZE = 48;
export const LASER_WIDTH = 5;
export const LASER_GROW_SPEED = 120; // as in 120 px per second

export const GAME_IMAGES = {
  block: { key: "block", url: "assets/001-block.png" },
  cross: { key: "cross", url: "assets/002-cross.png" },
  mirrorBall: { key: "mirrorBall", url: "assets/003-mirror-ball.png" },
  mirrorBL: { key: "mirrorBL", url: "assets/004-mirror-bottom-left.png" },
  mirrorBR: { key: "mirrorBR", url: "assets/005-mirror-bottom-right.png" },
  mirrorTL: { key: "mirrorTL", url: "assets/006-mirror-top-left.png" },
  mirrorTR: { key: "mirrorTR", url: "assets/007-mirror-top-right.png" },
  timedBlock: { key: "timedBlock", url: "assets/008-timeblock.png" },
  laserDown: { key: "laserDown", url: "assets/009-laser-down.png" },
  laserLeft: { key: "laserLeft", url: "assets/010-laser-left.png" },
  laserRight: { key: "laserRight", url: "assets/011-laser-right.png" },
  laserUp: { key: "laserUp", url: "assets/012-laser-up.png" },
  targetUp: { key: "targetUp", url: "assets/013-target-up.png" },
  targetRight: { key: "targetRight", url: "assets/014-target-right.png" },
  targetDown: { key: "targetDown", url: "assets/015-target-down.png" },
  targetLeft: { key: "targetLeft", url: "assets/016-target-left.png" },
  tileSelect: { key: "tileSelect", url: "assets/017-tile-select.png" },
  startBtn: { key: "startBtn", url: "assets/018-start-btn.png" },
  resetBtn: { key: "resetBtn", url: "assets/019-reset-btn.png" },
  laserHead: { key: "laserHead", url: "assets/020-laser-head.png" },
  forbiddenBlock: {
    key: "forbidden-block",
    url: "assets/021-forbidden-block.png",
  },
  laserH: { key: "laser-h", url: "assets/laser-horiz-1px.png" },
  laserV: { key: "laser-v", url: "assets/laser-vert-1px.png" },

  tileset: { key: "tileset", url: "assets/tileset.png" },
};

export const GAME_SPRITESHEETS = {
  spritesheet: { key: "spritesheet", url: "assets/tileset.png" },
};

export const GAME_TILEMAPS = {
  level00: { key: "level-00", url: "assets/levels/level-00.json" },
  level01: { key: "level-01", url: "assets/levels/level-01.json" },
  level02: { key: "level-02", url: "assets/levels/level-02.json" },
  level03: { key: "level-03", url: "assets/levels/level-03.json" },
  level04: { key: "level-04", url: "assets/levels/level-04.json" },
  level05: { key: "level-05", url: "assets/levels/level-05.json" },
};

export const TEXTURE_ATLAS = {
  laserRight: {key: 'laserRightAtlas', textureUrl: 'assets/011-laser-right-tileset.png', atlasUrl: 'assets/011-laser-right.json'},
};

export const LEVELS = [
  GAME_TILEMAPS.level00,
  GAME_TILEMAPS.level01,
  GAME_TILEMAPS.level02,
  GAME_TILEMAPS.level03,
  GAME_TILEMAPS.level04,
  GAME_TILEMAPS.level05,
];


export const EVENTS = {
  blockHit: Symbol("blockHit"),
  mirrorBallHit: Symbol("mirrorBallHit"),
  laserHit: Symbol("laserHit"),
  dirChange: Symbol("dirChange"),
  targetReached: Symbol("targetReached"),
  tileSelected: Symbol("tileSelected"),
  allTilesUsed: Symbol("allTilesUsed"),
};
