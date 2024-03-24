export enum LaserDirection {
  UP = "up",
  DOWN = "down",
  LEFT = "left",
  RIGHT = "right",
}

export default abstract class Laser extends Phaser.GameObjects.TileSprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    textureKey: string,
    frameKey?: string | number
  ) {
    super(scene, x, y, width, height, textureKey, frameKey);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    (this.body as Phaser.Physics.Arcade.Body).syncBounds = true;
  }

  public abstract grow(amount: number): void;
  public abstract get direction(): LaserDirection;
}
