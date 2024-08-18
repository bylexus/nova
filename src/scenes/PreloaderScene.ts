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
  private laserDot: Phaser.GameObjects.Sprite | null = null;
  private laserTween: Phaser.Tweens.Tween | null = null;
  private loaderText: Phaser.GameObjects.Text | null = null;

  constructor() {
    super({
      key: "PreloaderScene",
      pack: {
        files: [
          {
            type: "image",
            key: "loader-laser-dot",
            url: "assets/laser-dot.png",
          },
        ],
      },
    });
  }

  preload() {
    // --------------------------------------------------------------------------
    // Start animation
    // --------------------------------------------------------------------------
    const w = this.game.canvas.width;
    const h = this.game.canvas.height;
    const r = 50;
    const circle = new Phaser.Geom.Circle(w / 2, h / 2, r);

    this.laserDot = this.add.sprite(0, 0, "loader-laser-dot");
    this.loaderText = this.add
      .text(w / 2, h / 2, "0", {
        fontSize: "32px",
      })
      .setOrigin(0.5);
    Phaser.Actions.PlaceOnCircle([this.laserDot], circle);
    this.laserTween = this.tweens.add({
      targets: circle,
      radius: r,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      onUpdate: () => {
        Phaser.Actions.RotateAroundDistance(
          [this.laserDot!],
          {
            x: w / 2,
            y: h / 2,
          },
          0.1,
          circle.radius
        );
      },
    });

    this.load.on("progress", (value: number) => {
      this.loaderText!.setText(Math.floor(value * 100) + "");
    });

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

    Object.values(SOUNDS).forEach((value) => {
      this.load.audio(value.key, value.url);
    });
  }

  create() {
    const w = this.game.canvas.width;
    const h = this.game.canvas.height;

    const btn = this.add.group();
    btn.add(
      this.add
        .circle(w / 2, h / 2, 50, 0xffffff)
        .setInteractive()
        .on("pointerup", this.startGame, this)
    );
    btn.add(
      this.add
        .text(w / 2, h / 2, "ready!", { fontSize: "14px", color: "#000" })
        .setOrigin(0.5)
    );
    btn.setAlpha(0);

    this.tweens.addMultiple([
      {
        targets: [this.laserDot, this.loaderText],
        alpha: 0,
        duration: 250,
      },
      {
        targets: btn.getChildren(),
        alpha: 1,
        duration: 250,
        onComplete: () => {
          this.laserTween?.stop();
          this.laserDot?.destroy();
        },
      },
    ]);
  }

  startGame() {
    // Game music
    if (!this.game.sound.get(SOUNDS.theme1.key)) {
      this.game.sound.add(SOUNDS.theme1.key);
    }
    const music = this.game.sound.get(SOUNDS.theme1.key);
    if (!music.isPlaying) {
      music.play({ loop: true });
    }
    this.scene.start("GameScene", {
      level: LEVELS[0],
    });
  }

  onProgress(value: number) {
    console.log("asset load progress: ", value);
  }
}
