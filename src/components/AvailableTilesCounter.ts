import { EVENTS, TILE_SIZE } from "../Constants";

export default class AvailableTilesCounter {
  protected scene: Phaser.Scene;
  protected uiLayer: Phaser.GameObjects.Layer;
  protected uiGroup: Phaser.GameObjects.Group;
  protected availableBlocksLayer: Phaser.Tilemaps.TilemapLayer;
  protected blockCountMap = new Map<string, number>();
  protected blockTextMap = new Map<string, Phaser.GameObjects.Text>();
  protected totalTiles: number = 0;
  protected selectionRect: Phaser.GameObjects.Rectangle;
  protected pointerMoveRect: Phaser.GameObjects.Rectangle;
  protected selectedTile: string | null = null;

  constructor(
    scene: Phaser.Scene,
    uiLayer: Phaser.GameObjects.Layer,
    uiGroup: Phaser.GameObjects.Group,
    availableBlocksLayer: Phaser.Tilemaps.TilemapLayer
  ) {
    this.scene = scene;
    this.uiLayer = uiLayer;
    this.uiGroup = uiGroup;
    this.availableBlocksLayer = availableBlocksLayer;
    this.selectionRect = scene.add.rectangle(
      0,
      0,
      TILE_SIZE + 8,
      TILE_SIZE + 8,
      0x00ffff,
      0.5
    );
    this.pointerMoveRect = scene.add.rectangle(
      0,
      0,
      TILE_SIZE + 8,
      TILE_SIZE + 8,
      0x00ffff,
      0.3
    );
    this.uiLayer.add(this.selectionRect);
    this.uiLayer.add(this.pointerMoveRect);
    this.uiGroup.add(this.selectionRect);
    this.uiGroup.add(this.pointerMoveRect);
    this.selectionRect.setVisible(false);
    this.pointerMoveRect.setVisible(false);
  }

  public setupScene() {
    // configure interaction listeners to select a tile
    this.availableBlocksLayer.setInteractive();
    this.availableBlocksLayer.on("pointerdown", this.onPointerClick, this);
    this.availableBlocksLayer.on("pointermove", this.onPointerMove, this);

    // Configure the initial block counts in a map for each tile type:
    (this.availableBlocksLayer.layer.properties || []).forEach((p: any) => {
      if (p.type === "int") {
        this.blockCountMap.set(p.name, p.value as number);
      }
    });

    // Available blocks counters:
    let lastBlockX = 0;
    this.availableBlocksLayer.forEachTile((tile: Phaser.Tilemaps.Tile) => {
      const type = (<{ type: string }>tile.getTileData())?.type;
      if (this.blockCountMap.has(type)) {
        // write the block count as a text object onto the tile:
        const count = this.blockCountMap.get(type)!;
        const tileRect = new Phaser.Geom.Rectangle();
        tile.getBounds(undefined, tileRect);
        const txtObj = this.scene.add
          .text(
            tileRect.x + TILE_SIZE / 2,
            tileRect.y + TILE_SIZE + 5,
            `${count}`
          )
          .setOrigin(0.5, 0);
        lastBlockX = tileRect.x + TILE_SIZE;
        this.uiLayer.add(txtObj);
        this.uiGroup.add(txtObj);
        this.blockTextMap.set(type, txtObj);
      } else if (type === "Eraser") {
        const tileRect = new Phaser.Geom.Rectangle();
        tile.getBounds(undefined, tileRect);
        lastBlockX = tileRect.x + TILE_SIZE;
      }
    });

    // setup max counter:
    this.totalTiles = this.blockCountMap.get("MaxItems") || 0;
    const totalTxtObj = this.scene.add.text(
      lastBlockX + 5,
      5,
      `Items left: \n${this.totalTiles}`
    );
    this.uiGroup.add(totalTxtObj);
    this.blockTextMap.set("TotalItems", totalTxtObj);
  }

  protected onPointerClick(_e: Phaser.Input.Pointer, x: number, y: number) {
    const clickedTile = this.availableBlocksLayer.getTileAtWorldXY(x, y);
    if (clickedTile) {
      this.selectionRect.setX(clickedTile.x * TILE_SIZE + TILE_SIZE / 2);
      this.selectionRect.setY(clickedTile.y * TILE_SIZE + TILE_SIZE / 2);
      this.selectionRect.setVisible(true);
      this.selectedTile = (<{ type: string }>clickedTile.getTileData())!.type;
      this.scene.events.emit(EVENTS.tileSelected, this.selectedTile);
    }
  }

  protected onPointerMove(_e: Phaser.Input.Pointer, x: number, y: number) {
    const blockTile = this.availableBlocksLayer.getTileAtWorldXY(x, y);
    if (blockTile) {
      this.pointerMoveRect.setX(blockTile.x * TILE_SIZE + TILE_SIZE / 2);
      this.pointerMoveRect.setY(blockTile.y * TILE_SIZE + TILE_SIZE / 2);
      this.pointerMoveRect.setVisible(true);
    } else {
      this.pointerMoveRect.setVisible(false);
    }
  }

  public get selectedTileType(): string | null {
    return this.selectedTile;
  }

  public get selectedTileCount(): number {
    if (!this.selectedTile) return 0;
    if (this.totalTiles <= 0) return 0;
    if (!this.blockCountMap.has(this.selectedTile!)) return 0;
    return this.blockCountMap.get(this.selectedTile) || 0;
  }

  public decreaseTile(tileType: string): number {
    if (!this.blockCountMap.has(tileType)) return 0;
    if (this.totalTiles <= 0) return 0;

    let actCounter = this.blockCountMap.get(tileType) || 0;
    if (actCounter > 0) {
      this.decreaseTotalTiles();
      actCounter = Math.max(0, actCounter - 1);
    }
    this.blockCountMap.set(tileType, actCounter);
    this.blockTextMap.get(tileType)?.setText(`${actCounter}`);
    return actCounter;
  }

  public increaseTile(tileType: string): number {
    if (!this.blockCountMap.has(tileType)) return 0;

    let actCounter = this.blockCountMap.get(tileType) || 0;
    this.increaseTotalTiles();
    actCounter = actCounter + 1;
    this.blockCountMap.set(tileType, actCounter);
    this.blockTextMap.get(tileType)?.setText(`${actCounter}`);
    return actCounter;
  }

  public decreaseTotalTiles(): number {
    this.totalTiles--;
    this.updateTotalTileCountText();
    return this.totalTiles;
  }

  public increaseTotalTiles(): number {
    this.totalTiles++;
    this.updateTotalTileCountText();
    return this.totalTiles;
  }

  protected updateTotalTileCountText() {
    this.blockTextMap
      .get("TotalItems")
      ?.setText(`Items left: \n${this.totalTiles}`);
    if (this.totalTiles === 0) {
      this.scene.events.emit(EVENTS.allTilesUsed);
    }
  }
}
