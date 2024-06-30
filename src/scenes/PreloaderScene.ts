import { Scene } from "phaser";
import {
  TILE_SIZE,
  GAME_IMAGES,
  GAME_TILEMAPS,
  GAME_SPRITESHEETS,
  TEXTURE_ATLAS,
  SOUNDS,
  LEVELS,
} from "../Constants";

export class PreloaderScene extends Scene {
  constructor() {
    super("PreloaderScene");
  }

  preload() {
    this.load.on("progress", this.onProgress, this);
    this.load.on("fileprogress", this.onFileProgress, this);

    Object.values(GAME_IMAGES).forEach((value) => {
      this.load.image(value.key, value.url);
    });
    Object.values(GAME_TILEMAPS).forEach((value) => {
      this.load.tilemapTiledJSON(value.key, value.url);
    });
    Object.values(GAME_SPRITESHEETS).forEach((value) => {
      this.load.spritesheet(value.key, value.url, {
        frameWidth: TILE_SIZE,
        frameHeight: TILE_SIZE,
      });
    });

    Object.values(TEXTURE_ATLAS).forEach((value) => {
      this.load.atlas(value.key, value.textureUrl, value.atlasUrl);
    });

    this.load.audio(SOUNDS.theme1.key, SOUNDS.theme1.url);
  }

  create() {
    // Game music
    if (!this.game.sound.get(SOUNDS.theme1.key)) {
      this.game.sound.add(SOUNDS.theme1.key);
    }
    const music = this.game.sound.get(SOUNDS.theme1.key);
    if (!music.isPlaying) {
      music.play({ loop: true });
    }

    // start game:
    this.scene.start("GameScene", {
      level: LEVELS[0],
    });
  }

  onProgress(value: number) {
    console.log("asset load progress: ", value);
  }

  onFileProgress(file: any) {
    // console.log("file progress: ", file);
  }
}
