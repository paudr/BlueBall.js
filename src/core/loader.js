BlueBall.Loader = function () {};

BlueBall.Loader.prototype = Object.create(Phaser.State.prototype);

BlueBall.Loader.prototype.preload = function () {
    var loadingBar = this.add.sprite(160,240,"loading");
    loadingBar.anchor.setTo(0.5,0.5);
    this.load.setPreloadSprite(loadingBar);

    if (this.game.device.android || this.game.device.iPhone) {
        this.game.load.script('joystick', 'libs/phaser-virtual-joystick.js');
        this.game.load.script('joystick-input', 'src/core/virtual-joystick.js');
        this.load.atlas('dpad', 'assets/skins/dpad.png', 'assets/skins/dpad.json');
    }

    this.game.load.image('AdventuresOfLolo3', 'assets/tilemaps/AdventuresOfLolo3.png');
    this.game.load.atlas('playerSprites', 'assets/sprites/playerSprites.png', 'assets/sprites/playerSprites.json');
    this.game.load.atlas('tileSprites', 'assets/tilemaps/AdventuresOfLolo3.png', 'assets/sprites/tileSprites.json');
    this.game.load.atlas('chestSprites', 'assets/sprites/chestSprites.png', 'assets/sprites/chestSprites.json');
    this.game.load.atlas('mobSprites', 'assets/sprites/mobSprites.png', 'assets/sprites/mobSprites.json');
    this.game.load.atlas('eggSprites', 'assets/sprites/eggSprites.png', 'assets/sprites/eggSprites.json');
};

BlueBall.Loader.prototype.create = function () {
    this.game.state.start(BlueBall.Config.firstLevel);
};
