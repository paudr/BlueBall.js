BlueBall.Loader = function () {};

BlueBall.Loader.prototype = Object.create(Phaser.State.prototype);
BlueBall.Loader.prototype.constructor = BlueBall.Loader;

BlueBall.Loader.prototype.preload = function () {
    var loadingBar = this.add.sprite(160, 240, 'loading');
    loadingBar.anchor.setTo(0.5, 0.5);
    this.load.setPreloadSprite(loadingBar);

    this.game.load.script('joystick', 'libs/phaser-virtual-joystick.js');
    this.game.load.script('joystick-input', 'src/core/virtual-joystick.js');
    this.load.atlas('dpad', 'assets/skins/dpad.png', 'assets/skins/dpad.json');

    this.game.load.json('world', 'assets/worlds/' + BlueBall.Config.world);

    this.game.load.image('menu_title', 'assets/sprites/menu_title.png');
    this.game.load.image('menu_start', 'assets/sprites/menu_start.png');
    this.game.load.image('menu_continue', 'assets/sprites/menu_continue.png');
    this.game.load.image('menu_erease', 'assets/sprites/menu_erease.png');

    this.game.load.json('tileset-data', 'assets/tilesets/' + BlueBall.Config.tileset + '.json');
    this.game.load.image('tileset-image', 'assets/tilesets/' + BlueBall.Config.tileset + '.png');

    this.game.load.image('stairs', 'assets/sprites/stairs.png');
    this.game.load.atlas('playerSprites', 'assets/sprites/playerSprites.png', 'assets/sprites/playerSprites.json');
    this.game.load.atlas('tileSprites', 'assets/tilesets/aol3.png', 'assets/sprites/tileSprites.json');
    this.game.load.atlas('chestSprites', 'assets/sprites/chestSprites.png', 'assets/sprites/chestSprites.json');
    this.game.load.atlas('mobSprites', 'assets/sprites/mobSprites.png', 'assets/sprites/mobSprites.json');
    this.game.load.atlas('eggSprites', 'assets/sprites/eggSprites.png', 'assets/sprites/eggSprites.json');
};

BlueBall.Loader.prototype.create = function () {
    BlueBall.Config.world = this.game.cache.getJSON('world');
    this.game.state.start('menu');
};
