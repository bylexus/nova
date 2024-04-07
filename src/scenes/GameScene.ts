import { Scene } from "phaser";
import {
  TILE_SIZE,
  GAME_IMAGES,
  EVENTS,
  GAME_TILEMAPS,
  GAME_SPRITESHEETS,
} from "../Constants";
import HLaser from "../sprites/HLaser";
import VLaser from "../sprites/VLaser";
import Laser from "../sprites/Laser";
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
import LaserDirection from "../lib/LaserDirection";
import LaserHead from "../sprites/LaserHead";
import GameEndStatus from "../lib/GameEndStatus";

export class GameScene extends Scene {
  private lasers: Phaser.GameObjects.Group | null = null;
  private laserHeads: Phaser.GameObjects.Group | null = null;
  private blocks: Phaser.GameObjects.Group | null = null;
  private selectOverlay: Phaser.GameObjects.Group | null = null;
  private laserLayer: Phaser.GameObjects.Layer | null = null;
  private blockLayer: Phaser.GameObjects.Layer | null = null;
  private uiLayer: Phaser.GameObjects.Layer | null = null;
  private blockCounter: AvailableTilesCounter | null = null;
  private state: "stopped" | "running" | "pause" = "stopped";

  constructor() {
    super("GameScene");
  }

  init() {
    // Reset all previously added assets, listeners et al,
    // to really remove everything from this scene and start from scratch
    console.log("GameScene init");
    this.events.removeListener(EVENTS.blockHit);
    this.events.removeListener(EVENTS.dirChange);
    this.events.removeListener(EVENTS.laserHit);
    this.events.removeListener(EVENTS.mirrorBallHit);
    this.events.removeListener(EVENTS.targetReached);
    this.events.removeListener(EVENTS.tileSelected);

    if (this.lasers) {
      this.lasers.destroy(true, true);
      this.lasers = null;
    }
    if (this.laserHeads) {
      this.laserHeads.destroy(true, true);
      this.laserHeads = null;
    }
    if (this.blocks) {
      this.blocks.destroy(true, true);
      this.blocks = null;
    }
    if (this.selectOverlay) {
      this.selectOverlay.destroy(true, true);
      this.selectOverlay = null;
    }
    if (this.laserLayer) {
      this.laserLayer.destroy(true);
      this.laserLayer = null;
    }
    if (this.blockLayer) {
      this.blockLayer.destroy(true);
      this.blockLayer = null;
    }
    if (this.uiLayer) {
      this.uiLayer.destroy(true);
      this.uiLayer = null;
    }
    if (this.blockCounter) {
      this.blockCounter = null;
    }
    this.state = "stopped";
  }

  preload() {
    console.log("Preloading Game Assets");
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

    const map = this.make.tilemap({ key: GAME_TILEMAPS.level03.key });

    this.laserLayer = this.add.layer().setDepth(1);
    this.blockLayer = this.add.layer().setDepth(2);
    this.uiLayer = this.add.layer().setDepth(3);

    this.lasers = this.add.group();
    this.laserHeads = this.add.group();
    this.blocks = this.add.group();
    this.selectOverlay = this.add.group();

    this.blockCounter = this.setupInfoArea(map);
    this.setupBlocks(map);
    this.setupTileSelectOverlay(map);

    // Setup event listeners
    // Solid block hit:
    this.events.addListener(
      EVENTS.blockHit,
      (_block: Block, laserHead: LaserHead) => {
        this.stopHead(laserHead);
        this.checkGameEnd();
      }
    );

    // mirror change through diagonal mirror:
    this.events.addListener(
      EVENTS.dirChange,
      this.laserDirChangedEvent.bind(this)
    );

    // split mirror hit:
    this.events.addListener(
      EVENTS.mirrorBallHit,
      this.mirrorBallHitEvent.bind(this)
    );

    // laser head hits laser:
    this.events.addListener(
      EVENTS.laserHit,
      (laserHead: LaserHead, _laserBeam: Laser) => {
        console.log("Laser hit laser beam");
        // check if the overlap happened within a cross tile:
        let crossBlock = this.findCrossBlockAt(
          new Phaser.Geom.Point(laserHead.x, laserHead.y)
        );
        if (crossBlock) {
          console.log("yes, cross");
        } else {
          console.log("no cross");
          this.stopHead(laserHead);
          this.checkGameEnd();
        }
      }
    );

    // Laser head hit target
    this.events.addListener(
      EVENTS.targetReached,
      (_: Target, laserHead: LaserHead) => {
        console.log("Target reached");
        this.stopHead(laserHead);
        this.checkGameEnd();
      }
    );

    this.events.addListener(EVENTS.tileSelected, (type: string) => {
      console.log("Tile selected: " + type);
    });

    this.state = "stopped";
  }

  laserDirChangedEvent(
    newDir: LaserDirection,
    block: Block,
    laserHead: LaserHead
  ): void {
    this.laserDirChanged(laserHead, newDir, block);
  }

  mirrorBallHitEvent(block: Block, laserHead: LaserHead): void {
    this.stopHead(laserHead);
    let nl1: LaserHead | null = null;
    let nl2: LaserHead | null = null;
    switch (laserHead.direction) {
      case LaserDirection.DOWN:
      case LaserDirection.UP:
        nl1 = this.startLaserHead(
          LaserDirection.LEFT,
          snapToHalfGrid(block.x - TILE_SIZE / 2),
          snapToHalfGrid(block.y)
        );
        nl2 = this.startLaserHead(
          LaserDirection.RIGHT,
          snapToHalfGrid(block.x + TILE_SIZE / 2),
          snapToHalfGrid(block.y)
        );
        break;
      case LaserDirection.LEFT:
      case LaserDirection.RIGHT:
        nl1 = this.startLaserHead(
          LaserDirection.UP,
          snapToHalfGrid(block.x),
          snapToHalfGrid(block.y - TILE_SIZE / 2)
        );
        nl2 = this.startLaserHead(
          LaserDirection.DOWN,
          snapToHalfGrid(block.x),
          snapToHalfGrid(block.y + TILE_SIZE / 2)
        );
        break;
    }
    if (nl1) {
      block.addSeenLaserHead(nl1);
    }
    if (nl2) {
      block.addSeenLaserHead(nl2);
    }
  }

  laserDirChanged(
    laserHead: LaserHead,
    newDir: LaserDirection,
    _sourceBlock: Block | null
  ): Laser | null {
    console.log("Laser dir changed: " + newDir);
    laserHead.correctToHalfGrid();
    let newLaserPart = this.turnLaser(laserHead, newDir);
    if (newLaserPart) {
      this.lasers?.add(newLaserPart);
      return newLaserPart;
    }
    return null;
  }

  /**
   * This method is called when a laser head bumps into a direction changing
   * mirror. It ends here, and emits a new laser beam in the new (given)
   * direction, while changing the head's moving direction
   *
   * @param laserHead
   * @param newDir
   * @returns
   */
  turnLaser(laserHead: LaserHead, newDir: LaserDirection): Laser | null {
    // snap laser head to grid:
    laserHead.setX(snapToHalfGrid(laserHead.x));
    laserHead.setY(snapToHalfGrid(laserHead.y));
    let x: number = laserHead.x,
      y: number = laserHead.y;

    // switch head direction:
    laserHead.direction = newDir;
    laserHead.startMoving();

    // switch (laserHead.direction) {
    //   case LaserDirection.LEFT:
    //     x = laserHead.x - laserHead.width;
    //     break;
    //   case LaserDirection.RIGHT:
    //     x = laserHead.x + laserHead.width;
    //     break;
    //   case LaserDirection.UP:
    //     y = laserHead.y - laserHead.height;
    //     break;
    //   case LaserDirection.DOWN:
    //     y = laserHead.y + laserHead.height;
    //     break;
    // }
    // oldLaser.setActive(false);
    // important: remove collider on now inactive laser:
    // only the head laser should have a collider:
    // oldLaser.removeLaserCollider();
    // setTimeout(() => {
    // }, 20);
    const newBeam = this.startNewLaserBeam(laserHead, x, y);
    return newBeam;
  }
  protected startNewLaserBeam(
    laserHead: LaserHead,
    x: number,
    y: number
  ): Laser {
    let newLaser: Laser;
    // snap new laser to grid:
    x = snapToHalfGrid(x);
    y = snapToHalfGrid(y);
    switch (laserHead.direction) {
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

    // The new laser beam is added to the head's tailBeams array, to track
    // collission later:
    laserHead.tailBeams.push(newLaser);

    // The new laser beam marks the laser head as 'seen', so that it
    // does not collide with its own beam.
    // newLaser.addSeenLaserHead(laserHead);
    // ... and we attach a laser collider to the new laser to detect
    // when other lasers bump into it:
    newLaser.configureLaserHeadCollider(this.laserHeads!);
    this.lasers?.add(newLaser);
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

    // add reset btn:
    const resetBtn = this.add.sprite(
      this.cameras.default.width - 2 * TILE_SIZE - 5 - 5,
      TILE_SIZE / 2,
      GAME_IMAGES.resetBtn.key
    );
    resetBtn.setInteractive();
    resetBtn.setAlpha(0.5);
    resetBtn.on(Phaser.Input.Events.POINTER_OVER, () => resetBtn.setAlpha(1));
    resetBtn.on(Phaser.Input.Events.POINTER_OUT, () => resetBtn.setAlpha(0.5));
    resetBtn.on(Phaser.Input.Events.POINTER_UP, () => this.restartLevel());
    this.uiLayer!.add(resetBtn);

    return tilesCounter;
  }

  protected setupBlocks(map: Phaser.Tilemaps.Tilemap) {
    const tileset = map.getTileset("tileset")!;

    map.getLayer("Blocks")!.data.forEach((line: Phaser.Tilemaps.Tile[]) => {
      line.forEach((tile: Phaser.Tilemaps.Tile) => {
        const tileType = (<{ type: string }>tileset.getTileData(tile.index))
          ?.type;
        if (tileType) {
          this.addBlock(tileType, tile.x * TILE_SIZE, tile.y * TILE_SIZE);
        }
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
        sprite = new LaserCannon(this, x, y, LaserDirection.DOWN);
        break;
      case "LaserStartUp":
        sprite = new LaserCannon(this, x, y, LaserDirection.UP);
        break;
      case "LaserStartLeft":
        sprite = new LaserCannon(this, x, y, LaserDirection.LEFT);
        break;
      case "LaserStartRight":
        sprite = new LaserCannon(this, x, y, LaserDirection.RIGHT);
        break;
      case "TargetUp":
        sprite = new Target(this, x, y, LaserDirection.UP);
        break;
      case "TargetDown":
        sprite = new Target(this, x, y, LaserDirection.DOWN);
        break;
      case "TargetLeft":
        sprite = new Target(this, x, y, LaserDirection.LEFT);
        break;
      case "TargetRight":
        sprite = new Target(this, x, y, LaserDirection.RIGHT);
        break;
    }
    if (sprite) {
      sprite.configureLaserHeadCollider(this.laserHeads!);
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
              const selectionTween = this.add.tween({
                targets: selection,
                duration: 500,
                loop: -1,
                yoyo: true,
                alpha: 0.0001,
              });
              selection.setData("pulseTween", selectionTween);
            });
            selection.on(Phaser.Input.Events.POINTER_OUT, () => {
              const tween = selection.getData("pulseTween");
              if (tween instanceof Phaser.Tweens.Tween) {
                selection.setData("pulseTween", null);
                tween.destroy();
              }
              selection.setAlpha(0.0001);
            });

            // on click on the game area we have to check if
            // - the game state is i stopped state
            // - a tile to place is selected
            // - the selected tile has more than 0 blocks left
            // - at the clicked position is nothing
            selection.on(
              Phaser.Input.Events.POINTER_DOWN,
              (e: Phaser.Input.Pointer, _x: number, _y: number) => {
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
    this.laserHeads?.clear(true, true);
    this.laserLayer!.removeAll();
    this.blocks!.getChildren().forEach((block) => {
      if (block instanceof LaserCannon) {
        const laserHead = this.startLaserHead(
          block.direction,
          block.x,
          block.y
        );
        block.addSeenLaserHead(laserHead);
      }
    });
    this.state = "running";
  }

  protected startLaserHead(
    dir: LaserDirection,
    x: number,
    y: number
  ): LaserHead {
    let laserHead: LaserHead = new LaserHead(this, x, y, dir);
    this.laserHeads!.add(laserHead);
    this.laserLayer!.add(laserHead);
    this.startNewLaserBeam(laserHead, x, y);
    laserHead.startMoving();
    return laserHead;
  }

  protected checkGameEnd() {
    let allLasersStopped = true;
    let allTargetsReached = true;
    this.laserHeads?.getChildren().forEach((laserHead) => {
      if (laserHead instanceof LaserHead) {
        if (laserHead.active) {
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
      this.scene.pause(this);
      console.log("============= YOU WIN !!! =============");
      this.scene.launch("GameEndScene", {
        status: GameEndStatus.WON,
        restartCallback: () => {
          this.restartLevel();
        },
        nextLevelCallback: () => {
          this.restartLevel();
        },
      });
    } else if (allLasersStopped) {
      this.scene.pause(this);
      console.log("============= YOU LOSE !!! =============");
      this.scene.launch("GameEndScene", {
        status: GameEndStatus.LOST,
        restartCallback: () => {
          this.restartLevel();
        },
      });
    }
  }

  protected restartLevel() {
    this.scene.restart();
  }

  protected stopHead(laserHead: LaserHead) {
    laserHead.setActive(false);
    laserHead.stopMoving();
  }
}
