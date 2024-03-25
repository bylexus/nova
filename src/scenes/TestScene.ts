import { Scene } from "phaser";
import { TILE_SIZE, GAME_ASSETS, EVENTS } from "../Constants";
import HLaser from "../sprites/HLaser";
import VLaser from "../sprites/VLaser";
import Laser, { LaserDirection } from "../sprites/Laser";
import TopLeftMirror from "../sprites/TopLeftMirror";
import BottomRightMirror from "../sprites/BottomRightMirror";
import BottomLeftMirror from "../sprites/BottomLeftMirror";
import TopRightMirror from "../sprites/TopRightMirror";
import BlockingBlock from "../sprites/BlockingBlock";
import Block from "../sprites/Block";

export class TestScene extends Scene {
  private lasers: Phaser.GameObjects.Group | null = null;
  private blocks: Phaser.GameObjects.Group | null = null;
  private gameField: Phaser.GameObjects.Container | null = null;

  preload() {
    Object.values(GAME_ASSETS).forEach((value) => {
      this.load.image(value.key, value.url);
    });
  }

  create() {
    console.log("Main scene created");

    this.lasers = this.add.group();
    this.blocks = this.add.group();

    this.events.addListener(EVENTS.blockHit, (block: Block, laser: Laser) => {
      console.log("SCENE: laser collides and stops:", block);
    });
    this.events.addListener(
      EVENTS.dirChange,
      this.laserDirChangedEvent.bind(this)
    );

    // Test Group 1
    (() => {
      // tl
      const tl = new TopLeftMirror(this, TILE_SIZE * 5, TILE_SIZE * 5);
      tl.configureLaserCollider(this.lasers);
      this.blocks.add(tl);

      // br
      const br = new BottomRightMirror(this, TILE_SIZE * 5, TILE_SIZE * 2);
      br.configureLaserCollider(this.lasers);
      this.blocks.add(br);

      // bl
      const bl = new BottomLeftMirror(this, TILE_SIZE * 8, TILE_SIZE * 2);
      bl.configureLaserCollider(this.lasers);
      this.blocks.add(bl);

      // tr
      const tr = new TopRightMirror(this, TILE_SIZE * 8, TILE_SIZE * 5);
      tr.configureLaserCollider(this.lasers);
      this.blocks.add(tr);

      // block
      const block = new BlockingBlock(this, TILE_SIZE * 12, TILE_SIZE * 5);
      block.configureLaserCollider(this.lasers);
      this.blocks.add(block);

      // block 2
      const block2 = new BlockingBlock(this, TILE_SIZE * 2, TILE_SIZE * 5);
      block2.configureLaserCollider(this.lasers);
      this.blocks.add(block2);

      // coming from left:
      const actLaser = new HLaser(
        this,
        TILE_SIZE * 3,
        TILE_SIZE * 5,
        LaserDirection.RIGHT
      );
      actLaser.configureLaserCollider(this.lasers!);
      this.lasers.add(actLaser);
    })();

    // Test Group 2
    (() => {
      // tl
      const tl = new TopLeftMirror(this, TILE_SIZE * 5, TILE_SIZE * 10);
      tl.configureLaserCollider(this.lasers);
      this.blocks.add(tl);

      // br
      const br = new BottomRightMirror(this, TILE_SIZE * 5, TILE_SIZE * 7);
      br.configureLaserCollider(this.lasers);
      this.blocks.add(br);

      // bl
      const bl = new BottomLeftMirror(this, TILE_SIZE * 8, TILE_SIZE * 7);
      bl.configureLaserCollider(this.lasers);
      this.blocks.add(bl);

      // tr
      const tr = new TopRightMirror(this, TILE_SIZE * 8, TILE_SIZE * 10);
      tr.configureLaserCollider(this.lasers);
      this.blocks.add(tr);

      // block
      const block = new BlockingBlock(this, TILE_SIZE * 17, TILE_SIZE * 10);
      block.configureLaserCollider(this.lasers);
      this.blocks.add(block);

      const c1 = new TopRightMirror(this, TILE_SIZE * 2, TILE_SIZE * 10);
      c1.configureLaserCollider(this.lasers);
      this.blocks.add(c1);

      const c2 = new BottomRightMirror(this, TILE_SIZE * 2, TILE_SIZE * 8);
      c2.configureLaserCollider(this.lasers);
      this.blocks.add(c2);

      // coming from right:
      const actLaser = new HLaser(
        this,
        15 * TILE_SIZE,
        TILE_SIZE * 10,
        LaserDirection.LEFT
      );
      actLaser.configureLaserCollider(this.lasers!);
      this.lasers.add(actLaser);
    })();

    // 2 lasers pointing at each other:
    (() => {
      // coming from right:
      const rl = new HLaser(
        this,
        15 * TILE_SIZE,
        TILE_SIZE * 12,
        LaserDirection.LEFT
      );
      rl.configureLaserCollider(this.lasers!);
      this.lasers.add(rl);

      // coming from left:
      const ll = new HLaser(
        this,
        5 * TILE_SIZE,
        TILE_SIZE * 12,
        LaserDirection.RIGHT
      );
      ll.configureLaserCollider(this.lasers!);
      this.lasers.add(ll);
    })();
  }

  update(time: number, delta: number): void {}

  laserDirChangedEvent(
    newDir: LaserDirection,
    block: Block,
    laser: Laser
  ): void {
    this.laserDirChanged(laser, newDir, block);
  }

  laserDirChanged(
    actLaser: Laser,
    newDir: LaserDirection,
    sourceBlock: Block | null
  ) {
    console.log("laser changes dir to:", newDir);
    let newLaserPart = this.continueLaser(actLaser, newDir);
    if (newLaserPart) {
      // The new laser is positioned so that it is in the collission zone
      // of the block that caused a new laser piece: so we
      // don't process a collision with the new laser piece, the laser should
      // be able to depart from the actual block:
      if (sourceBlock) {
        sourceBlock.addSeenLaser(newLaserPart);
      }
      this.lasers?.add(newLaserPart);
    }
  }

  continueLaser(oldLaser: Laser, newDir: LaserDirection): Laser | null {
    let x: number = oldLaser.x,
      y: number = oldLaser.y;
    switch (oldLaser.direction) {
      case LaserDirection.LEFT:
        x = oldLaser.x - oldLaser.width;
        break;
      case LaserDirection.RIGHT:
        x = oldLaser.x + oldLaser.width;
        break;
      case LaserDirection.UP:
        y = oldLaser.y - oldLaser.height;
        break;
      case LaserDirection.DOWN:
        y = oldLaser.y + oldLaser.height;
        break;
    }
    oldLaser.setActive(false);
    // important: remove collider on now inactive laser:
    // only the head laser should have a collider:
    oldLaser.removeLaserCollider();

    let newLaser: Laser;
    // snap new laser to grid:
    x = Math.round(x / TILE_SIZE) * TILE_SIZE;
    y = Math.round(y / TILE_SIZE) * TILE_SIZE;
    switch (newDir) {
      case LaserDirection.LEFT:
        newLaser = new HLaser(this, x, y, LaserDirection.LEFT);
        break;
      case LaserDirection.RIGHT:
        newLaser = new HLaser(this, x, y, LaserDirection.RIGHT);
        break;
      case LaserDirection.UP:
        newLaser = new VLaser(this, x, y, LaserDirection.UP);
        break;
      case LaserDirection.DOWN:
        newLaser = new VLaser(this, x, y, LaserDirection.DOWN);
        break;
    }
    // newLaser.configureLaserCollider(this.lasers!);
    // oldLaser.addSeenLaser(newLaser);
    newLaser.addSeenLaser(oldLaser);
    newLaser.configureLaserCollider(this.lasers!);
    return newLaser;
  }
}
