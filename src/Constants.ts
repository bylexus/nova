export const TILE_SIZE = 48;
export const LASER_WIDTH = 5;
export const LASER_GROW_SPEED = 150; // as in 150 px per second

export const GAME_ASSETS = {
  laserH: { key: "laser-h", url: "assets/laser-horiz-1px.png" },
  laserV: { key: "laser-v", url: "assets/laser-vert-1px.png" },
  block: { key: "block", url: "assets/block.png" },
  mirrorTR: { key: "miror-tr", url: "assets/mirror-top-right.png" },
  mirrorTL: { key: "miror-tl", url: "assets/mirror-top-left.png" },
  mirrorBR: { key: "miror-br", url: "assets/mirror-bottom-right.png" },
  mirrorBL: { key: "miror-bl", url: "assets/mirror-bottom-left.png" },
  mirrorBall: { key: "miror-ball", url: "assets/mirror-ball.png" },
};

export const EVENTS = {
  blockHit: Symbol("blockHit"),
  laserHit: Symbol("laserHit"),
  dirChange: Symbol("dirChange"),
};
