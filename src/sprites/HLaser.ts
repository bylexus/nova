import Laser, { LaserDirection } from "./Laser";
import { TILE_SIZE, GAME_ASSETS, LASER_WIDTH } from "../Constants";

export default class HLaser extends Laser {
  private _direction: LaserDirection.LEFT | LaserDirection.RIGHT;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    direction: LaserDirection.LEFT | LaserDirection.RIGHT
  ) {
    super(scene, x, y, 1, LASER_WIDTH, GAME_ASSETS.laserH.key);
    this.setOrigin(direction === LaserDirection.RIGHT ? 0 : 1, 0.5);
    this._direction = direction;
  }

  public get direction(): LaserDirection {
    return this._direction;
  }

  public grow(amount: number): void {
    this.width += amount;
  }

  public get head(): Phaser.Geom.Point {
    if (this.direction === LaserDirection.RIGHT) {
      // return the head x/y point of this laser when pointing right:
      return new Phaser.Geom.Point(this.x + this.width, this.y);
    } else {
      // return the head x/y point of this laser when pointing left:
      return new Phaser.Geom.Point(this.x - this.width, this.y);
    }
  }
}
