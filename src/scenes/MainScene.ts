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

export class MainScene extends Scene {
  private lasers: Phaser.GameObjects.Group | null = null;
  private blocks: Phaser.GameObjects.Group | null = null;
  private actLaser: Laser | null = null;

  preload() {
    Object.values(GAME_ASSETS).forEach((value) => {
      this.load.image(value.key, value.url);
    });
  }

  create() {
    console.log("Main scene created");
    this.lasers = this.add.group();
    this.blocks = this.add.group();

    // Test Group 1
    (() => {
      // tl
      const tl = new TopLeftMirror(this, TILE_SIZE * 5, TILE_SIZE * 5);
      tl.configureLaserCollider(this.lasers);
      tl.addListener(EVENTS.blockHit, (block: any) => {
        console.log("laser collides and stops:", block);
      });
      tl.addListener(EVENTS.dirChange, (newDir: LaserDirection, block: any) => {
        if (this.actLaser?.active) {
          this.laserDirChanged(this.actLaser, newDir, block);
        }
      });
      this.blocks.add(tl);

      // br
      const br = new BottomRightMirror(this, TILE_SIZE * 5, TILE_SIZE * 2);
      br.configureLaserCollider(this.lasers);
      br.addListener(EVENTS.blockHit, (block: any) => {
        console.log("laser collides and stops:", block);
      });
      br.addListener(EVENTS.dirChange, (newDir: LaserDirection, block: any) => {
        if (this.actLaser?.active) {
          this.laserDirChanged(this.actLaser, newDir, block);
        }
      });
      this.blocks.add(br);

      // bl
      const bl = new BottomLeftMirror(this, TILE_SIZE * 8, TILE_SIZE * 2);
      bl.configureLaserCollider(this.lasers);
      bl.addListener(EVENTS.blockHit, (block: any) => {
        console.log("laser collides and stops:", block);
      });
      bl.addListener(EVENTS.dirChange, (newDir: LaserDirection, block: any) => {
        if (this.actLaser?.active) {
          this.laserDirChanged(this.actLaser, newDir, block);
        }
      });
      this.blocks.add(bl);

      // tr
      const tr = new TopRightMirror(this, TILE_SIZE * 8, TILE_SIZE * 5);
      tr.configureLaserCollider(this.lasers);
      tr.addListener(EVENTS.blockHit, (block: any) => {
        console.log("laser collides and stops:", block);
      });
      tr.addListener(EVENTS.dirChange, (newDir: LaserDirection, block: any) => {
        if (this.actLaser?.active) {
          this.laserDirChanged(this.actLaser, newDir, block);
        }
      });
      this.blocks.add(tr);

      // block
      const block = new BlockingBlock(this, TILE_SIZE * 12, TILE_SIZE * 5);
      block.configureLaserCollider(this.lasers);
      block.addListener(EVENTS.blockHit, (block: any) => {
        console.log("laser collides and stops:", block);
      });
      this.blocks.add(block);

      // block 2
      const block2 = new BlockingBlock(this, TILE_SIZE * 2, TILE_SIZE * 5);
      block2.configureLaserCollider(this.lasers);
      block2.addListener(EVENTS.blockHit, (block: any) => {
        console.log("laser collides and stops:", block);
      });
      this.blocks.add(block2);

      // this.block.body!.setSize(
      //   this.block.getBounds().width / 2,
      //   this.block.getBounds().height / 2,
      //   false
      // );
      // (this.block.body as Phaser.Physics.Arcade.Body).setOffset(
      //   0,
      //   this.block.getBounds().height / 2
      // );
      // const coll = this.physics.add.overlap(
      //   this.block,
      //   this.lasers,
      //   (ob1, ob2) => {
      //     console.log("collide with block");
      //     console.log(ob2);
      //     if (ob2 instanceof Phaser.GameObjects.TileSprite) {
      //       ob2.setActive(false);
      //       coll.destroy();
      //     }
      //   }
      // );

      // coming from left:
      this.actLaser = new HLaser(
        this,
        TILE_SIZE * 3,
        TILE_SIZE * 5,
        LaserDirection.RIGHT
      );
      this.lasers.add(this.actLaser);

      // coming from right:
      // this.actLaser = new HLaser(this, 15*TILE_SIZE, TILE_SIZE * 5, LaserDirection.LEFT);
      // this.lasers.add(this.actLaser);
    })();

    // Test Group 2
    // (() => {
    //   // tl
    //   const tl = new TopLeftMirror(this, TILE_SIZE * 5, TILE_SIZE * 10);
    //   tl.configureLaserCollider(this.lasers);
    //   tl.addListener(EVENTS.blockHit, (block: any) => {
    //     console.log("laser collides and stops:", block);
    //   });
    //   tl.addListener(EVENTS.dirChange, (newDir: LaserDirection, block: any) => {
    //     if (this.actLaser?.active) {
    //       this.laserDirChanged(this.actLaser, newDir, block);
    //     }
    //   });
    //   this.blocks.add(tl);

    //   // br
    //   const br = new BottomRightMirror(this, TILE_SIZE * 5, TILE_SIZE * 7);
    //   br.configureLaserCollider(this.lasers);
    //   br.addListener(EVENTS.blockHit, (block: any) => {
    //     console.log("laser collides and stops:", block);
    //   });
    //   br.addListener(EVENTS.dirChange, (newDir: LaserDirection, block: any) => {
    //     if (this.actLaser?.active) {
    //       this.laserDirChanged(this.actLaser, newDir, block);
    //     }
    //   });
    //   this.blocks.add(br);

    //   // bl
    //   const bl = new BottomLeftMirror(this, TILE_SIZE * 8, TILE_SIZE * 7);
    //   bl.configureLaserCollider(this.lasers);
    //   bl.addListener(EVENTS.blockHit, (block: any) => {
    //     console.log("laser collides and stops:", block);
    //   });
    //   bl.addListener(EVENTS.dirChange, (newDir: LaserDirection, block: any) => {
    //     if (this.actLaser?.active) {
    //       this.laserDirChanged(this.actLaser, newDir, block);
    //     }
    //   });
    //   this.blocks.add(bl);

    //   // tr
    //   const tr = new TopRightMirror(this, TILE_SIZE * 8, TILE_SIZE * 10);
    //   tr.configureLaserCollider(this.lasers);
    //   tr.addListener(EVENTS.blockHit, (block: any) => {
    //     console.log("laser collides and stops:", block);
    //   });
    //   tr.addListener(EVENTS.dirChange, (newDir: LaserDirection, block: any) => {
    //     if (this.actLaser?.active) {
    //       this.laserDirChanged(this.actLaser, newDir, block);
    //     }
    //   });
    //   this.blocks.add(tr);

    //   // block
    //   const block = new BlockingBlock(this, TILE_SIZE * 12, TILE_SIZE * 10);
    //   block.configureLaserCollider(this.lasers);
    //   block.addListener(EVENTS.blockHit, (block: any) => {
    //     console.log("laser collides and stops:", block);
    //   });
    //   this.blocks.add(block);

    //   // block 2
    //   const block2 = new BlockingBlock(this, TILE_SIZE * 2, TILE_SIZE * 10);
    //   block2.configureLaserCollider(this.lasers);
    //   block2.addListener(EVENTS.blockHit, (block: any) => {
    //     console.log("laser collides and stops:", block);
    //   });
    //   this.blocks.add(block2);

    //   // coming from right:
    //   this.actLaser = new HLaser(
    //     this,
    //     15 * TILE_SIZE,
    //     TILE_SIZE * 10,
    //     LaserDirection.LEFT
    //   );
    //   this.lasers.add(this.actLaser);
    // })();
  }

  update(time: number, delta: number): void {
    if (!this.actLaser) return;
    // if (this.lasers!.getLength() > 2) return;
    if (!this.actLaser.active) {
      return;
    }

    let grow = (150 * delta) / 1000;
    this.actLaser.grow(grow);
    // if (this.actLaser.width < 48 * 5) {
    //   this.actLaser.grow(grow);
    // } else {
    //   const newLaser = new VLaser(
    //     this,
    //     this.actLaser.x + this.actLaser.width,
    //     this.actLaser.y,
    //     LaserDirection.DOWN
    //   );
    //   this.lasers?.add(newLaser);
    //   this.actLaser = newLaser;
    // }
  }

  laserDirChanged(
    actLaser: Laser,
    newDir: LaserDirection,
    sourceBlock: Block | null
  ) {
    console.log("laser changes dir to:", newDir);
    let newLaserPart = this.continueLaser(this.actLaser!, newDir);
    if (newLaserPart) {
      // The new laser is positioned so that it is in the collission zone
      // of the block that caused a new laser piece: so we
      // don't process a collision with the new laser piece, the laser should
      // be able to depart from the actual block:
      if (sourceBlock) {
        sourceBlock.addSeenLaser(newLaserPart);
      }
      this.lasers?.add(newLaserPart);
      this.actLaser = newLaserPart;
    }
  }

  continueLaser(oldLaser: Laser, newDir: LaserDirection): Laser | null {
    if (!oldLaser.active) {
      return null;
    }

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

    let newLaser: Laser;
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
    return newLaser;
  }
}
