import { Scene } from "phaser";
import {
  TILE_SIZE,
  GAME_IMAGES as GAME_IMAGES,
  EVENTS,
  GAME_TILEMAPS,
  GAME_SPRITESHEETS,
} from "../Constants";
import HLaser from "../sprites/HLaser";
import VLaser from "../sprites/VLaser";
import Laser, { LaserDirection } from "../sprites/Laser";
import TopLeftMirror from "../sprites/TopLeftMirror";
import BottomRightMirror from "../sprites/BottomRightMirror";
import BottomLeftMirror from "../sprites/BottomLeftMirror";
import TopRightMirror from "../sprites/TopRightMirror";
import BlockingBlock from "../sprites/BlockingBlock";
import Block from "../sprites/Block";
import BallMirror from "../sprites/BallMirror";
import { snapToHalfGrid } from "../lib/tools";
import Cross from "../sprites/Cross";
import TimedBlock from "../sprites/TimedBlock";
import LaserCannon from "../sprites/LaserCannon";
import Target from "../sprites/Target";

export class TestScene extends Scene {
  private lasers: Phaser.GameObjects.Group | null = null;
  private blocks: Phaser.GameObjects.Group | null = null;
  private laserLayer: Phaser.GameObjects.Layer | null = null;
  private blockLayer: Phaser.GameObjects.Layer | null = null;

  preload() {
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
  }

  create() {
    console.log("Main scene created");

    this.lasers = this.add.group();
    this.blocks = this.add.group();
    this.laserLayer = this.add.layer().setDepth(1);
    this.blockLayer = this.add.layer().setDepth(2);

    this.setupBlocks();

    // Setup event listeners
    this.events.addListener(EVENTS.blockHit, (block: Block, laser: Laser) => {
      laser.setActive(false);
      this.checkGameEnd();
    });
    this.events.addListener(
      EVENTS.dirChange,
      this.laserDirChangedEvent.bind(this)
    );
    this.events.addListener(
      EVENTS.mirrorBallHit,
      this.mirrorBallHitEvent.bind(this)
    );
    this.events.addListener(
      EVENTS.laserHit,
      (otherLaser: Laser, thisLaser: Laser) => {
        // check if the overlap happened within a cross tile:
        let head = thisLaser.head;
        let crossBlock = this.findCrossBlockAt(head);
        if (crossBlock) {
          console.log("let laser pass - within cross ");
        } else {
          otherLaser.setActive(false);
          thisLaser.setActive(false);
          this.checkGameEnd();
        }
      }
    );

    this.events.addListener(EVENTS.targetReached, (_: Target, laser: Laser) => {
      laser.setActive(false);
      this.checkGameEnd();
    });

    this.startLasers();


    // Test Group 1
    // (() => {
    //   const mirr1 = new BallMirror(this, TILE_SIZE * 5, TILE_SIZE * 3);
    //   mirr1.configureLaserCollider(this.lasers);
    //   this.blocks.add(mirr1);

    //   // tl
    //   const tl = new TopLeftMirror(this, TILE_SIZE * 5, TILE_SIZE * 5);
    //   tl.configureLaserCollider(this.lasers);
    //   this.blocks.add(tl);

    //   // br
    //   const br = new BottomRightMirror(this, TILE_SIZE * 5, TILE_SIZE * 1);
    //   br.configureLaserCollider(this.lasers);
    //   this.blocks.add(br);

    //   // bl
    //   const bl = new BottomLeftMirror(this, TILE_SIZE * 8, TILE_SIZE * 1);
    //   bl.configureLaserCollider(this.lasers);
    //   this.blocks.add(bl);

    //   // tr
    //   const tr = new TopRightMirror(this, TILE_SIZE * 8, TILE_SIZE * 5);
    //   tr.configureLaserCollider(this.lasers);
    //   this.blocks.add(tr);

    //   // block
    //   const block = new BlockingBlock(this, TILE_SIZE * 12, TILE_SIZE * 5);
    //   block.configureLaserCollider(this.lasers);
    //   this.blocks.add(block);

    //   // block 2
    //   const block2 = new BlockingBlock(this, TILE_SIZE * 2, TILE_SIZE * 5);
    //   block2.configureLaserCollider(this.lasers);
    //   this.blocks.add(block2);

    //   // coming from right:
    //   const actLaser = new HLaser(
    //     this,
    //     TILE_SIZE * 7,
    //     TILE_SIZE * 3,
    //     LaserDirection.LEFT
    //   );
    //   actLaser.configureLaserCollider(this.lasers);
    //   this.lasers.add(actLaser);
    // })();

    // Test Group 2
    // (() => {
    //   // tl
    //   const tl = new TopLeftMirror(this, TILE_SIZE * 5, TILE_SIZE * 10);
    //   tl.configureLaserCollider(this.lasers);
    //   this.blocks.add(tl);

    //   // br
    //   const br = new BottomRightMirror(this, TILE_SIZE * 5, TILE_SIZE * 7);
    //   br.configureLaserCollider(this.lasers);
    //   this.blocks.add(br);

    //   // mirror ball
    //   const mirr1 = new BallMirror(this, TILE_SIZE * 6, TILE_SIZE * 7);
    //   mirr1.configureLaserCollider(this.lasers);
    //   this.blocks.add(mirr1);

    //   // cross
    //   const cross1 = new Cross(this, TILE_SIZE * 5, TILE_SIZE * 8);
    //   cross1.configureLaserCollider(this.lasers);
    //   this.blocks.add(cross1);

    //   // bl
    //   const bl = new BottomLeftMirror(this, TILE_SIZE * 8, TILE_SIZE * 7);
    //   bl.configureLaserCollider(this.lasers);
    //   this.blocks.add(bl);

    //   // tr
    //   const tr = new TopRightMirror(this, TILE_SIZE * 8, TILE_SIZE * 10);
    //   tr.configureLaserCollider(this.lasers);
    //   this.blocks.add(tr);

    //   // block
    //   const block = new BlockingBlock(this, TILE_SIZE * 17, TILE_SIZE * 10);
    //   block.configureLaserCollider(this.lasers);
    //   this.blocks.add(block);

    //   const c1 = new TopRightMirror(this, TILE_SIZE * 2, TILE_SIZE * 10);
    //   c1.configureLaserCollider(this.lasers);
    //   this.blocks.add(c1);

    //   const c2 = new BottomRightMirror(this, TILE_SIZE * 2, TILE_SIZE * 8);
    //   c2.configureLaserCollider(this.lasers);
    //   this.blocks.add(c2);

    //   // coming from right:
    //   const actLaser = new VLaser(
    //     this,
    //     6 * TILE_SIZE,
    //     TILE_SIZE * 9,
    //     LaserDirection.UP
    //   );
    //   actLaser.configureLaserCollider(this.lasers!);
    //   this.lasers.add(actLaser);
    // })();

    // timed blocks:
    // const t1 = new TimedBlock(this, TILE_SIZE * 6, TILE_SIZE * 12);
    // t1.configureLaserCollider(this.lasers);
    // this.blocks.add(t1);
    // const t2 = new TimedBlock(this, TILE_SIZE * 7, TILE_SIZE * 12);
    // t2.configureLaserCollider(this.lasers);
    // this.blocks.add(t2);
    // const t3 = new TimedBlock(this, TILE_SIZE * 8, TILE_SIZE * 12);
    // t3.configureLaserCollider(this.lasers);
    // this.blocks.add(t3);

    // 2 lasers pointing at each other:
    // (() => {
    //   // coming from right:
    //   const rl = new HLaser(
    //     this,
    //     15 * TILE_SIZE,
    //     TILE_SIZE * 12,
    //     LaserDirection.LEFT
    //   );
    //   rl.configureLaserCollider(this.lasers!);
    //   this.lasers.add(rl);

    //   // coming from left:
    //   const ll = new HLaser(
    //     this,
    //     2 * TILE_SIZE,
    //     TILE_SIZE * 12,
    //     LaserDirection.RIGHT
    //   );
    //   ll.configureLaserCollider(this.lasers!);
    //   this.lasers.add(ll);
    // })();
  }

  update(time: number, delta: number): void {}

  laserDirChangedEvent(
    newDir: LaserDirection,
    block: Block,
    laser: Laser
  ): void {
    laser.setActive(false);
    this.laserDirChanged(laser, newDir, block);
  }

  mirrorBallHitEvent(block: Block, laser: Laser): void {
    laser.setActive(false);
    let nl1: Laser | null = null;
    let nl2: Laser | null = null;
    switch (laser.direction) {
      case LaserDirection.DOWN:
        nl1 = this.laserDirChanged(laser, LaserDirection.LEFT, block);
        nl1?.setY(snapToHalfGrid(laser.y + laser.height + TILE_SIZE / 2));
        nl2 = this.laserDirChanged(laser, LaserDirection.RIGHT, block);
        nl2?.setY(snapToHalfGrid(laser.y + laser.height + TILE_SIZE / 2));
        break;
      case LaserDirection.UP:
        nl1 = this.laserDirChanged(laser, LaserDirection.LEFT, block);
        nl1?.setY(snapToHalfGrid(laser.y - laser.height - TILE_SIZE / 2));
        nl2 = this.laserDirChanged(laser, LaserDirection.RIGHT, block);
        nl2?.setY(snapToHalfGrid(laser.y - laser.height - TILE_SIZE / 2));
        break;
      case LaserDirection.LEFT:
        nl1 = this.laserDirChanged(laser, LaserDirection.UP, block);
        nl1?.setX(snapToHalfGrid(laser.x - laser.width - TILE_SIZE / 2));
        nl2 = this.laserDirChanged(laser, LaserDirection.DOWN, block);
        nl2?.setX(snapToHalfGrid(laser.x - laser.width - TILE_SIZE / 2));
        break;
      case LaserDirection.RIGHT:
        nl1 = this.laserDirChanged(laser, LaserDirection.UP, block);
        nl1?.setX(snapToHalfGrid(laser.x + laser.width + TILE_SIZE / 2));
        nl2 = this.laserDirChanged(laser, LaserDirection.DOWN, block);
        nl2?.setX(snapToHalfGrid(laser.x + laser.width + TILE_SIZE / 2));
        break;
    }
    if (nl1 && nl2) {
      nl1.addSeenLaser(nl2);
      nl2.addSeenLaser(nl1);
    }
  }

  laserDirChanged(
    actLaser: Laser,
    newDir: LaserDirection,
    sourceBlock: Block | null
  ): Laser | null {
    let newLaserPart = this.turnLaser(actLaser, newDir);
    if (newLaserPart) {
      // The new laser is positioned so that it is in the collission zone
      // of the block that caused a new laser piece: so we
      // don't process a collision with the new laser piece, the laser should
      // be able to depart from the actual block:
      if (sourceBlock) {
        sourceBlock.addSeenLaser(newLaserPart);
      }
      this.lasers?.add(newLaserPart);
      return newLaserPart;
    }
    return null;
  }

  /**
   * This method is called when a laser bumps into a direction changing
   * mirror. It ends here, and emits a new laser in the new (given)
   * direction
   *
   * @param oldLaser
   * @param newDir
   * @returns
   */
  turnLaser(oldLaser: Laser, newDir: LaserDirection): Laser | null {
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
    console.log(x, y);
    oldLaser.setActive(false);
    // important: remove collider on now inactive laser:
    // only the head laser should have a collider:
    oldLaser.removeLaserCollider();

    let newLaser: Laser;
    // snap new laser to grid:
    x = snapToHalfGrid(x);
    y = snapToHalfGrid(y);
    console.log(x, y);
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

    // The new laser marks the old/source laser as 'seen', so that
    // no overlap collision is detected: The new laser touches the
    // old laser, as it starts at the end point of the old laser:
    newLaser.addSeenLaser(oldLaser);
    // ... and we attach a laser collider to the new laser to detect
    // when other lasers bump into it:
    newLaser.configureLaserCollider(this.lasers!);
    return newLaser;
  }

  protected findCrossBlockAt(point: Phaser.Geom.Point): Block | null {
    for (let b of this.blocks!.getChildren()) {
      if (b instanceof Cross) {
        if (Phaser.Geom.Rectangle.ContainsPoint(b.getBounds(), point)) {
          return b;
        }
      }
    }
    return null;
  }

  protected setupBlocks() {
    const map = this.make.tilemap({ key: GAME_TILEMAPS.level00.key });
    const tileset = map.getTileset("tileset")!;

    map.getLayer("Blocks")!.data.forEach((line: Phaser.Tilemaps.Tile[]) => {
      line.forEach((tile: Phaser.Tilemaps.Tile) => {
        const tileType = tileset.getTileData(
          (tile as Phaser.Tilemaps.Tile).index
        )?.type;
        let sprite = null;
        let x = tile.x * TILE_SIZE + TILE_SIZE / 2;
        let y = tile.y * TILE_SIZE + TILE_SIZE / 2;
        switch (tileType) {
          case "BlockingBlock":
            sprite = new BlockingBlock(this, x, y);
            break;
          case "Cross":
            sprite = new Cross(this, x, y);
            break;
          case "BallMirror":
            sprite = new BallMirror(this, x, y);
            break;
          case "BottomLeftMirror":
            sprite = new BottomLeftMirror(this, x, y);
            break;
          case "BottomRightMirror":
            sprite = new BottomRightMirror(this, x, y);
            break;
          case "TopLeftMirror":
            sprite = new TopLeftMirror(this, x, y);
            break;
          case "TopRightMirror":
            sprite = new TopRightMirror(this, x, y);
            break;
          case "TimedBlock":
            sprite = new TimedBlock(this, x, y);
            break;
          case "TimedBlock":
            sprite = new TimedBlock(this, x, y);
            break;
          case "LaserStartDown":
            sprite = new LaserCannon(this, x, y, "down");
            break;
          case "LaserStartUp":
            sprite = new LaserCannon(this, x, y, "up");
            break;
          case "LaserStartLeft":
            sprite = new LaserCannon(this, x, y, "left");
            break;
          case "LaserStartRight":
            sprite = new LaserCannon(this, x, y, "right");
            break;
          case "TargetUp":
            sprite = new Target(this, x, y, "up");
            break;
          case "TargetDown":
            sprite = new Target(this, x, y, "down");
            break;
          // fill the cases for left and right:
          case "TargetLeft":
            sprite = new Target(this, x, y, "left");
            break;
          case "TargetRight":
            sprite = new Target(this, x, y, "right");
            break;
        }
        if (sprite) {
          sprite.configureLaserCollider(this.lasers!);
          this.blocks!.add(sprite);
          this.blockLayer!.add(sprite);
        }
      });
    });
  }

  protected startLasers() {
    this.lasers?.clear(true, true);
    this.laserLayer!.removeAll();
    this.blocks!.getChildren().forEach((block) => {
      if (block instanceof LaserCannon) {
        let laser: Laser;
        switch (block.direction) {
          case "down":
            laser = new VLaser(this, block.x, block.y, LaserDirection.DOWN);
            break;
          case "up":
            laser = new VLaser(this, block.x, block.y, LaserDirection.UP);
            break;
          case "right":
            laser = new HLaser(this, block.x, block.y, LaserDirection.RIGHT);
            break;
          case "left":
            laser = new HLaser(this, block.x, block.y, LaserDirection.LEFT);
            break;
        }
        block.addSeenLaser(laser);
        laser.configureLaserCollider(this.lasers!);
        this.lasers!.add(laser);
        this.laserLayer!.add(laser);
      }
    });
  }

  protected checkGameEnd() {
    let allLasersStopped = true;
    let allTargetsReached = true;
    this.lasers?.getChildren().forEach((laser) => {
      if (laser instanceof Laser) {
        if (laser.active) {
          allLasersStopped = false;
          return false;
        }
      }
    });
    this.blocks?.getChildren().forEach((block) => {
      if (block instanceof Target) {
        if (!block.laserInTarget) {
          allTargetsReached = false;
          return false;
        }
      }
    });

    if (allTargetsReached) {
      console.log("============= YOU WIN !!! =============");
    } else if (allLasersStopped) {
      console.log("============= YOU LOSE !!! =============");
    }
  }
}
