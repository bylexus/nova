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
import { floorToGrid, snapToHalfGrid } from "../lib/tools";
import Cross from "../sprites/Cross";
import TimedBlock from "../sprites/TimedBlock";
import LaserCannon from "../sprites/LaserCannon";
import Target from "../sprites/Target";
import AvailableTilesCounter from "../components/AvailableTilesCounter";

export class GameScene extends Scene {
  private lasers: Phaser.GameObjects.Group | null = null;
  private blocks: Phaser.GameObjects.Group | null = null;
  private selectOverlay: Phaser.GameObjects.Group | null = null;
  private laserLayer: Phaser.GameObjects.Layer | null = null;
  private blockLayer: Phaser.GameObjects.Layer | null = null;
  private uiLayer: Phaser.GameObjects.Layer | null = null;
  private blockCounter: AvailableTilesCounter | null = null;
  private state: "stopped" | "running" | "pause" = "stopped";

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

    const map = this.make.tilemap({ key: GAME_TILEMAPS.level00.key });

    this.laserLayer = this.add.layer().setDepth(1);
    this.blockLayer = this.add.layer().setDepth(2);
    this.uiLayer = this.add.layer().setDepth(3);

    this.lasers = this.add.group();
    this.blocks = this.add.group();
    this.selectOverlay = this.add.group();

    this.blockCounter = this.setupInfoArea(map);
    this.setupBlocks(map);
    this.setupTileSelectOverlay(map);

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

    this.events.addListener(EVENTS.tileSelected, (type: string) => {
      console.log("Tile selected: " + type);
    });

    // this.startLasers();
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
    oldLaser.setActive(false);
    // important: remove collider on now inactive laser:
    // only the head laser should have a collider:
    oldLaser.removeLaserCollider();

    let newLaser: Laser;
    // snap new laser to grid:
    x = snapToHalfGrid(x);
    y = snapToHalfGrid(y);
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

  protected setupInfoArea(map: Phaser.Tilemaps.Tilemap): AvailableTilesCounter {
    // draw the block tiles:
    const tileset = map.addTilesetImage("tileset", "tileset");
    const layer = map.createLayer("Info", tileset!, 0, 0)!;
    this.uiLayer!.add(layer);

    // setup counters
    const tilesCounter = new AvailableTilesCounter(this, this.uiLayer!, layer);
    tilesCounter.setupScene();

    // add start btn:
    const startBtn = this.add.sprite(
      this.cameras.default.width - TILE_SIZE - 5,
      TILE_SIZE / 2,
      GAME_IMAGES.startBtn.key
    );
    startBtn.setInteractive();
    startBtn.setAlpha(0.5);
    startBtn.on(Phaser.Input.Events.POINTER_OVER, () => startBtn.setAlpha(1));
    startBtn.on(Phaser.Input.Events.POINTER_OUT, () => startBtn.setAlpha(0.5));
    startBtn.on(Phaser.Input.Events.POINTER_UP, () => this.startLasers());
    this.uiLayer!.add(startBtn);
    return tilesCounter;
  }

  protected setupBlocks(map: Phaser.Tilemaps.Tilemap) {
    const tileset = map.getTileset("tileset")!;

    map.getLayer("Blocks")!.data.forEach((line: Phaser.Tilemaps.Tile[]) => {
      line.forEach((tile: Phaser.Tilemaps.Tile) => {
        const tileType = tileset.getTileData(
          (tile as Phaser.Tilemaps.Tile).index
        )?.type;
        this.addBlock(tileType!, tile.x * TILE_SIZE, tile.y * TILE_SIZE);
      });
    });
  }

  /**
   * Adds a block to the scene, snapping it to the grid if necessary.
   * Type must be one of the known block types (block class names).
   *
   * @param type
   * @param worldX
   * @param worldY
   * @returns Block | null
   */
  protected addBlock(
    type: string,
    worldX: number,
    worldY: number
  ): Block | null {
    let sprite = null;
    let x = floorToGrid(worldX) + TILE_SIZE / 2;
    let y = floorToGrid(worldY) + TILE_SIZE / 2;
    switch (type) {
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
    return sprite;
  }

  protected setupTileSelectOverlay(map: Phaser.Tilemaps.Tilemap) {
    const layerData = map.getLayer("SelectionArea");
    if (layerData) {
      layerData.data.forEach((line: Phaser.Tilemaps.Tile[]) => {
        line.forEach((tile: Phaser.Tilemaps.Tile) => {
          if (tile.index >= 0) {
            const x = tile.x * TILE_SIZE + TILE_SIZE / 2;
            const y = tile.y * TILE_SIZE + TILE_SIZE / 2;
            const selection = this.add.sprite(x, y, GAME_IMAGES.tileSelect.key);
            // selection sprite is larger than grid: limit hit box:
            const hitBoxoffsetX = (selection.width - TILE_SIZE) / 2;
            const hitBoxoffsetY = (selection.height - TILE_SIZE) / 2;
            selection.setActive(false);
            selection.setAlpha(0.0001);
            selection.setInteractive(
              new Phaser.Geom.Rectangle(
                hitBoxoffsetX,
                hitBoxoffsetY,
                TILE_SIZE,
                TILE_SIZE
              ),
              Phaser.Geom.Rectangle.Contains
            );
            selection.on(Phaser.Input.Events.POINTER_OVER, () => {
              selection.setAlpha(1);
            });
            selection.on(Phaser.Input.Events.POINTER_OUT, () => {
              selection.setAlpha(0.0001);
            });

            // on click on the game area we have to check if
            // - the game state is i stopped state
            // - a tile to place is selected
            // - the selected tile has more than 0 blocks left
            // - at the clicked position is nothing
            selection.on(
              Phaser.Input.Events.POINTER_DOWN,
              (e: Phaser.Input.Pointer, x: number, y: number) => {
                if (this.state !== "stopped") {
                  return;
                }
                if (!this.blockCounter!.selectedTileType) {
                  // TODO: BEEP: no placement possible, no block selected
                  console.log("no block selected");
                  return;
                }

                if (!this.blockCounter!.selectedTileCount) {
                  // TODO: BEEP: no placement possible, no blocks left
                  console.log("no more blocks");
                  return;
                }

                let foundBlock = false;
                for (let block of this.blocks!.getChildren()) {
                  if (
                    block instanceof Block &&
                    Phaser.Geom.Rectangle.ContainsPoint(
                      block.getBounds(),
                      new Phaser.Geom.Point(e.worldX, e.worldY)
                    )
                  ) {
                    foundBlock = true;
                    break;
                  }
                }
                if (foundBlock) {
                  // TODO: BEEP: block already placed
                  console.log("block already placed");
                } else {
                  const blockType = this.blockCounter?.selectedTileType!;
                  this.blockCounter?.decreaseTile(blockType);
                  this.addBlock(blockType, e.worldX, e.worldY);
                }
              }
            );
            this.selectOverlay!.add(selection);
            this.uiLayer?.add(selection);
          }
        });
      });
    }
  }

  protected startLasers() {
    if (this.state !== "stopped") {
      return;
    }
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
    this.state = "running";
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
