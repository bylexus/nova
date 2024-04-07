import Laser from "./Laser";
import { LASER_WIDTH, GAME_IMAGES } from "../Constants";
import LaserDirection from "../lib/LaserDirection";

export default class HLaser extends Laser {
  private _direction: LaserDirection.LEFT | LaserDirection.RIGHT;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    direction: LaserDirection.LEFT | LaserDirection.RIGHT
  ) {
    super(scene, x, y, 1, LASER_WIDTH, GAME_IMAGES.laserH.key);
    this.setOrigin(direction === LaserDirection.RIGHT ? 0 : 1, 0.5);
    this._direction = direction;
  }

  public get direction(): LaserDirection {
    return this._direction;
  }
}
