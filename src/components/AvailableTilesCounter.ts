import { EVENTS, GAME_IMAGES, TILE_SIZE } from "../Constants";

export default class AvailableTilesCounter {
  protected scene: Phaser.Scene;
  protected uiLayer: Phaser.GameObjects.Layer;
  protected availableBlocksLayer: Phaser.Tilemaps.TilemapLayer;
  protected blockCountMap = new Map<string, number>();
  protected blockTextMap = new Map<string, Phaser.GameObjects.Text>();
  protected selectionRect: Phaser.GameObjects.Rectangle;
  protected selectedTile: string | null = null;

  constructor(
    scene: Phaser.Scene,
    uiLayer: Phaser.GameObjects.Layer,
    availableBlocksLayer: Phaser.Tilemaps.TilemapLayer
  ) {
    this.scene = scene;
    this.uiLayer = uiLayer;
    this.availableBlocksLayer = availableBlocksLayer;
    this.selectionRect = scene.add.rectangle(
      0,
      0,
      TILE_SIZE + 8,
      TILE_SIZE + 8,
      0x00ffff,
      0.5
    );
    this.selectionRect.setVisible(false);
    // this.uiLayer.add(this.selectionRect);
  }

  public setupScene() {
    // configure interaction listeners to select a tile
    this.availableBlocksLayer.setInteractive();
    this.availableBlocksLayer.on("pointerdown", this.onPointerClick, this);

    // Configure the initial block counts in a map for each tile type:
    (this.availableBlocksLayer.layer.properties || []).forEach((p: any) => {
      if (p.type === "int") {
        this.blockCountMap.set(p.name, p.value as number);
      }
    });

    this.availableBlocksLayer.forEachTile((tile: Phaser.Tilemaps.Tile) => {
      const type = tile.getTileData()?.type;
      if (this.blockCountMap.has(type)) {
        // write the block count as a text object onto the tile:
        const count = this.blockCountMap.get(type)!;
        const tileRect = new Phaser.Geom.Rectangle();
        tile.getBounds(undefined, tileRect);
        const txtObj = this.scene.add.text(
          tileRect.x,
          tileRect.y + TILE_SIZE + 5,
          `${count}`
        );
        this.uiLayer.add(txtObj);
        this.blockTextMap.set(type, txtObj);
      }
    });
  }

  protected onPointerClick(e: Phaser.Input.Pointer, x: number, y: number) {
    const clickedTile = this.availableBlocksLayer.getTileAtWorldXY(x, y);
    if (clickedTile) {
      this.selectionRect.setX(clickedTile.x * TILE_SIZE + TILE_SIZE / 2);
      this.selectionRect.setY(clickedTile.y * TILE_SIZE + TILE_SIZE / 2);
      this.selectionRect.setVisible(true);
      this.selectedTile = clickedTile.getTileData()!.type;
      this.scene.events.emit(
        EVENTS.tileSelected,
        clickedTile.getTileData()!.type
      );
    }
  }

  public get selectedTileType(): string | null {
    return this.selectedTile;
  }

  public get selectedTileCount(): number {
    if (!this.selectedTile) return 0;
    if (!this.blockCountMap.has(this.selectedTile!)) return 0;
    return this.blockCountMap.get(this.selectedTile) || 0;
  }

  public decreaseTile(tileType: string): number {
    if (!this.blockCountMap.has(tileType)) return 0;
    let actCounter = Math.max(0, (this.blockCountMap.get(tileType) || 0) - 1);
    this.blockCountMap.set(tileType, actCounter);
	this.blockTextMap.get(tileType)?.setText(`${actCounter}`);
    return actCounter;
  }
}
