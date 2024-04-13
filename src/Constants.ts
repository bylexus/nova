export const TILE_SIZE = 48;
export const LASER_WIDTH = 5;
export const LASER_GROW_SPEED = 180; // as in 180 px per second

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
  target: {key: 'targetRightSheet', url: 'assets/014-target-tileset.png'}
};

export const GAME_TILEMAPS: { [key: string]: LevelTileMap } = {
  level00: { key: "level-00", url: "assets/levels/level-00.json" },
  level01: { key: "level-01", url: "assets/levels/level-01.json" },
  level02: { key: "level-02", url: "assets/levels/level-02.json" },
  level03: { key: "level-03", url: "assets/levels/level-03.json" },
  level04: { key: "level-04", url: "assets/levels/level-04.json" },
  level05: { key: "level-05", url: "assets/levels/level-05.json" },
  level06: { key: "level-06", url: "assets/levels/level-06.json" },
  level07: { key: "level-07", url: "assets/levels/level-07.json" },
  level08: { key: "level-08", url: "assets/levels/level-08.json" },
  level09: { key: "level-09", url: "assets/levels/level-09.json" },
  level10: { key: "level-10", url: "assets/levels/level-10.json" },
  level11: { key: "level-11", url: "assets/levels/level-11.json" },
  level12: { key: "level-12", url: "assets/levels/level-12.json" },
  level13: { key: "level-13", url: "assets/levels/level-13.json" },
  level14: { key: "level-14", url: "assets/levels/level-14.json" },
  level15: { key: "level-15", url: "assets/levels/level-15.json" },
  level16: { key: "level-16", url: "assets/levels/level-16.json" },
  level17: { key: "level-17", url: "assets/levels/level-17.json" },
  level18: { key: "level-18", url: "assets/levels/level-18.json" },
  level19: { key: "level-19", url: "assets/levels/level-19.json" },
  level20: { key: "level-20", url: "assets/levels/level-20.json" },
  level21: { key: "level-21", url: "assets/levels/level-21.json" },
  level22: { key: "level-22", url: "assets/levels/level-22.json" },
  level23: { key: "level-23", url: "assets/levels/level-23.json" },
  level24: { key: "level-24", url: "assets/levels/level-24.json" },
  level25: { key: "level-25", url: "assets/levels/level-25.json" },
  level26: { key: "level-26", url: "assets/levels/level-26.json" },
  level27: { key: "level-27", url: "assets/levels/level-27.json" },

  // own levels
  ownNiki01: { key: "level-niki-01", url: "assets/levels/own/level-niki-01.json" },
};

export const TEXTURE_ATLAS = {
  laserRight: {key: 'laserRightAtlas', textureUrl: 'assets/011-laser-right-tileset.png', atlasUrl: 'assets/011-laser-right.json'},
};

export const LEVELS = [
  GAME_TILEMAPS.level27,
  GAME_TILEMAPS.ownNiki01,
  // GAME_TILEMAPS.level00,
  GAME_TILEMAPS.level01,
  GAME_TILEMAPS.level02,
  GAME_TILEMAPS.level03,
  GAME_TILEMAPS.level04,
  GAME_TILEMAPS.level05,
  GAME_TILEMAPS.level06,
  GAME_TILEMAPS.level07,
  GAME_TILEMAPS.level08,
  GAME_TILEMAPS.level09,
  GAME_TILEMAPS.level10,
  GAME_TILEMAPS.level11,
  GAME_TILEMAPS.level12,
  GAME_TILEMAPS.level13,
  GAME_TILEMAPS.level14,
  GAME_TILEMAPS.level15,
  GAME_TILEMAPS.level16,
  GAME_TILEMAPS.level17,
  GAME_TILEMAPS.level18,
  GAME_TILEMAPS.level19,
  GAME_TILEMAPS.level20,
  GAME_TILEMAPS.level21,
  GAME_TILEMAPS.level22,
  GAME_TILEMAPS.level23,
  GAME_TILEMAPS.level24,
  GAME_TILEMAPS.level25,
  GAME_TILEMAPS.level26,
  GAME_TILEMAPS.level27,
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
