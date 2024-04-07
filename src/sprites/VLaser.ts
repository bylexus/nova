import Laser from "./Laser";
import { GAME_IMAGES, LASER_WIDTH } from "../Constants";
import LaserDirection from "../lib/LaserDirection";

export default class VLaser extends Laser {
  protected _direction: LaserDirection.DOWN | LaserDirection.UP;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    direction: LaserDirection.DOWN | LaserDirection.UP
  ) {
    super(scene, x, y, LASER_WIDTH, 1, GAME_IMAGES.laserV.key);
    this.setOrigin(0.5, direction === LaserDirection.DOWN ? 0 : 1);
    this._direction = direction;
  }

  public get direction(): LaserDirection {
    return this._direction;
  }
}
