import { Scene } from 'phaser';

export class Preloader extends Scene {
  constructor() {
    super('Preloader');
  }

  init() {
    // Optional: display background image
    this.add.image(512, 384, 'background');

    // Progress bar outline
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    // Progress bar fill
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    // Update progress bar as assets load
    this.load.on('progress', (progress: number) => {
      bar.width = 4 + (460 * progress);
    });
  }

  preload() {
    // Load atlas and other assets from static/assets/
    this.load.atlas('symbols', '/assets/reelicons.png', '/assets/reelicons.json');
    this.load.image('background', '/assets/background.png');
    this.load.image('logo', '/assets/logo.png');
    this.load.image('star', '/assets/star.png');
  }

  create() {
    this.scene.start('MainMenu');
  }
}
