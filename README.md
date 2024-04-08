# Nova - C64 remake

!!!Work in Progress!!!

This is a remake of the old C64 game(s) [Nova](https://www.lemon64.com/game/nova) and [Nova 2](https://www.lemon64.com/game/nova-2), published 1993 and 194 by CP Verlag. This is a
fun project of mine, and has no claim of accuracy or completeness.

## Own Goals

- recreate the original levels of all Nova 1 and Nova 2
- create all game assets by myself
- refresh my knowledge of [Phaser 3](https://phaser.io/)


## Technical decisions

- using Phaser 3 as Web game engine
- canvas size: 1024x768 (4:3)
- block size: 48px
	- a total of 20x16 blocks
	- play field area is 20x12 blocks (960x576px), as the original game

## Game architecture


## Creating the game assets

### Blocks

The blocks are just 48x48px images, or, if animations needed,
sprite sheets packed with [TexturePacker](https://www.codeandweb.com/texturepacker).
Then, the images are registered in `src/Constants.ts` in the `GAME_IMAGES` object, where they all will
be auto-loaded when the `GameScene` starts.

### Levels

Levels are created with [Tiled](https://www.mapeditor.org/), and exported as JSON tilemaps.
A default level is provided in `game-art/levels/level-00.tmx`.

Add levels to the `src/Constants.ts` file:

- in the `GAME_TILEMAPS` constant, add an entry for the level json tilemap
- in the `LEVELS` array, add a reference to the `GAME_TILEMAPS` entry

#### Layers

Each level consists of 4 layers:

- SelectionArea: The area where the player can place blocks. This is a 20x12 block area, marking the play field.
  It should normally not be edited.
- Info: The information area, containing all the blocks the user can select from. It should not be edited.
- Blocks: This is where the fixed blocks are placed per level. It contains all the start blocks of the level.
  It is a 20x12 area, which matches the SelectionArea. This is where you put the level content.

#### Level Data

The level data goes into the Custom Properties of the `Info` layer. The following properties must be
provided by each level. The properties are read during the runtime of the game.

- "BallMirror", type="int": Nr of laser splitters
- "BlockingBlock", type="int": Nr of Blocking Blocks
- "BottomLeftMirror", type="int": Nr of Bottom left mirrors
- "BottomRightMirror", type="int": Nr of Bottom right mirrors
- "Cross", type="int": Nr of Laser crosses
- "LevelName", type="string": The displayed name of the level
- "TimedBlock", type="int": Nr of Timed Blocks
- "TopLeftMirror", type="int": Nr of Top left mirrors
- "TopRightMirror", type="int": Nr of Top right mirrors

#### Embedded Tileset

Each level must **embed its blocks in a tileset called `tileset`**: The game will parse it and
create sprites for each block. The tileset tiles must define its underlying Class name in the
"type" (or "Class") field in the tileset editor in Tiled

Also, the corresponding `tileset.png` must be provided with all the blocks, otherwise the
tileset parsing may not work as expected. The tileset image can be created using [TexturePacker](https://www.codeandweb.com/texturepacker).


YouTube Walkthrough of the original:
https://www.youtube.com/watch?v=YbfMREGx-1A



