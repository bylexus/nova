export const TILE_SIZE = 48;

export const GAME_ASSETS = {
  laserH: { key: "laser-h", url: "assets/laser-horiz-1px.png" },
  laserV: { key: "laser-v", url: "assets/laser-vert-1px.png" },
  block: { key: "block", url: "assets/block.png" },
  mirrorTR: { key: "miror-tr", url: "assets/mirror-top-right.png" },
  mirrorTL: { key: "miror-tl", url: "assets/mirror-top-left.png" },
  mirrorBR: { key: "miror-br", url: "assets/mirror-bottom-right.png" },
  mirrorBL: { key: "miror-bl", url: "assets/mirror-bottom-left.png" },
};

export const EVENTS = {
  blockHit: Symbol("blockHit"),
  dirChange: Symbol("dirChange"),
};
