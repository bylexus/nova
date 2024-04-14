import { GAME_IMAGES, LASER_GROW_SPEED } from "../Constants";
import LaserDirection from "../lib/LaserDirection";
import { snapToHalfGrid } from "../lib/tools";
import Laser from "./Laser";

export default class LaserHead extends Phaser.Physics.Arcade.Sprite {
  // protected seenLasers: Set<Laser> = new Set();
  // protected laserCollider: Phaser.Physics.Arcade.Collider | null = null;
  // public growFactor: number = 1;
  public direction: LaserDirection;
  public tailBeams: Laser[] = [];

  protected particleEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    direction: LaserDirection
  ) {
    super(scene, x, y, GAME_IMAGES.laserHead.key);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    // body is a wee bit bigger, to make sure all colissions are happening
    this.body?.setSize(this.width + 2, this.height + 2);
    this.direction = direction;
    this.setOrigin(0.5, 0.5);

    this.particleEmitter = this.scene.add.particles(
      0,
      0,
      GAME_IMAGES.laserHeadParticle.key,
      {
        emitting: false,
        follow: this,
        blendMode: Phaser.BlendModes.ADD,
        lifespan: 200,
        alpha: { start: 1, end: 0 },
        speed: { random: [10, 200] },
      }
    );
  }

  public preUpdate(_time: number, _delta: number): void {
    this.growLaser();
  }

  public startMoving() {
    this.particleEmitter.start();
    switch (this.direction) {
      case LaserDirection.UP:
        this.setVelocity(0, -1 * LASER_GROW_SPEED);
        break;
      case LaserDirection.RIGHT:
        this.setVelocity(LASER_GROW_SPEED, 0);
        break;
      case LaserDirection.DOWN:
        this.setVelocity(0, LASER_GROW_SPEED);
        break;
      case LaserDirection.LEFT:
        this.setVelocity(-1 * LASER_GROW_SPEED, 0);
        break;
    }
  }

  public stopMoving() {
    this.setVelocity(0, 0);
    this.particleEmitter.stop();
  }

  public growLaser(): void {
    // always snap to grid: sometimes we get some jitter we need to correct:
    const tailBeam = this.tailBeams[this.tailBeams.length - 1];
    if (
      this.direction === LaserDirection.UP ||
      this.direction === LaserDirection.DOWN
    ) {
      this.setX(snapToHalfGrid(this.x));
      // resize the tail beam:
      if (tailBeam) {
        tailBeam.height = Math.abs(this.y - tailBeam.y);
      }
    } else if (
      this.direction === LaserDirection.LEFT ||
      this.direction === LaserDirection.RIGHT
    ) {
      this.setY(snapToHalfGrid(this.y));
      // resize the tail beam:
      if (tailBeam) {
        tailBeam.width = Math.abs(this.x - tailBeam.x);
      }
    }
  }

  public correctToHalfGrid(): void {
    // always snap to grid: sometimes we get some jitter we need to correct:
    const tailBeam = this.tailBeams[this.tailBeams.length - 1];
    if (
      this.direction === LaserDirection.UP ||
      this.direction === LaserDirection.DOWN
    ) {
      this.setX(snapToHalfGrid(this.x));
      // resize the tail beam:
      if (tailBeam) {
        tailBeam.height = snapToHalfGrid(Math.abs(this.y - tailBeam.y));
      }
    } else if (
      this.direction === LaserDirection.LEFT ||
      this.direction === LaserDirection.RIGHT
    ) {
      this.setY(snapToHalfGrid(this.y));
      // resize the tail beam:
      if (tailBeam) {
        tailBeam.width = snapToHalfGrid(Math.abs(this.x - tailBeam.x));
      }
    }
  }
}
