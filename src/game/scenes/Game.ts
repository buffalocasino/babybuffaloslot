import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene {
  camera!: Phaser.Cameras.Scene2D.Camera;
  background!: Phaser.GameObjects.Image;
  gameText!: Phaser.GameObjects.Text;
  reelSprites: Phaser.GameObjects.Sprite[][] = [];
  reelRects: Phaser.GameObjects.Rectangle[] = [];

  // All symbols including expanded wild for spins
  symbolKeys: string[] = [
    'sym_bear', 'sym_wolf', 'sym_buffalo', 'sym_elk',
    'sym_card_9', 'sym_card_10', 'sym_card_a', 'sym_card_j',
    'sym_card_k', 'sym_card_q', 'sym_scatter_free_spins',
    'sym_wild', 'sym_wild_expanded'
  ];

  // Only normal symbols for initial placeholders
  placeholderKeys: string[] = [
    'sym_bear', 'sym_wolf', 'sym_buffalo', 'sym_elk',
    'sym_card_9', 'sym_card_10', 'sym_card_a', 'sym_card_j',
    'sym_card_k', 'sym_card_q',
    'sym_scatter_free_spins',
    'sym_wild'
  ];

  constructor() {
    super('Game');
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x00ff00);

    this.background = this.add.image(512, 384, 'background').setAlpha(0.5);

    this.gameText = this.add.text(
      512,
      50,
      'Baby Buffalo Slot Demo',
      {
        fontFamily: 'Arial Black',
        fontSize: 38,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
        align: 'center'
      }
    ).setOrigin(0.5).setDepth(100);

    EventBus.emit('current-scene-ready', this);

    // --- Draw 5 reel rectangles ---
    const reelWidth = 129;
    const reelHeight = 385;
    const startX = 150;
    const spacing = 10;
    const topY = 200;

    for (let col = 0; col < 5; col++) {
      const rect = this.add.rectangle(
        startX + col * (reelWidth + spacing) + reelWidth / 2,
        topY + reelHeight / 2,
        reelWidth,
        reelHeight,
        0xff0000,
        0.3
      ).setStrokeStyle(2, 0xff0000);
      this.reelRects.push(rect);
    }

    // --- Create 5x3 grid of placeholder symbols ---
    const rows = 3;
    const symbolHeight = 128;
    const symbolWidth = 128;
    const paddingY = (reelHeight - rows * symbolHeight) / (rows + 1);

    for (let col = 0; col < 5; col++) {
      this.reelSprites[col] = [];
      for (let row = 0; row < rows; row++) {
        const x = this.reelRects[col].x;
        const y = topY + paddingY + row * (symbolHeight + paddingY) + symbolHeight / 2;
        const initialFrame = Phaser.Utils.Array.GetRandom(this.placeholderKeys);
        const sprite = this.add.sprite(x, y, 'symbols', initialFrame);
        this.reelSprites[col][row] = sprite;
      }
    }

    // --- Spin button ---
    const spinBtn = this.add.text(512, 600, 'SPIN', {
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { left: 20, right: 20, top: 10, bottom: 10 },
      align: 'center'
    })
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        this.spinReels();
      });

    // --- Spacebar input ---
    this.input.keyboard!.on('keydown-SPACE', () => {
      this.spinReels();
    });
  }

  spinReels() {
    for (let col = 0; col < 5; col++) {
      for (let row = 0; row < 3; row++) {
        // Optional: Conditional expanded wild (5% chance)
        let frame: string;
        if (Math.random() < 0.05) {
          frame = 'sym_wild_expanded'; // small chance for expanded wild
        } else {
          frame = Phaser.Utils.Array.GetRandom(this.symbolKeys);
        }
        this.reelSprites[col][row].setFrame(frame);
      }
    }
  }

  changeScene() {
    this.scene.start('GameOver');
  }
}
