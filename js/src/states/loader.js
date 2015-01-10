/*global Phaser, BlueBall, window */

BlueBall.Loader = function () {};

BlueBall.Loader.prototype = Object.create(Phaser.State.prototype);
BlueBall.Loader.prototype.constructor = BlueBall.Loader;

BlueBall.Loader.prototype.preload = function () {

    this.game.load.image('AdventuresOfLolo3', 'assets/tilemaps/tiles/AdventuresOfLolo3.png');
    this.game.load.image('AdventuresOfLolo3Attrib', 'assets/tilemaps/tiles/AdventuresOfLolo3Attrib.png');
    this.game.load.atlas('loloSprites', 'assets/sprites/loloSprites.png', 'assets/sprites/loloSprites.json');
    this.game.load.atlas('tileSprites', 'assets/tilemaps/tiles/AdventuresOfLolo3Attrib.png', 'assets/sprites/tileSprites.json');
    this.game.load.atlas('chestSprites', 'assets/sprites/chestSprites.png', 'assets/sprites/chestSprites.json');
    this.game.load.atlas('mobSprites', 'assets/sprites/mobSprites.png', 'assets/sprites/mobSprites.json');
    this.game.load.atlas('eggSprites', 'assets/sprites/eggSprites.png', 'assets/sprites/eggSprites.json');

};

BlueBall.Loader.prototype.create = function () {

    if (this.game.device.desktop)
    {

		var resizeCanvas = function() {

			this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.scale.setMinMax(129, 137, 1032, 1096);
			this.scale.pageAlignHorizontally = true;
			this.scale.pageAlignVertically = true;

		};

		resizeCanvas.apply(this);

		window.addEventListener('resize', resizeCanvas.bind(this));

    }

    this.game.state.start('level1-1');

};
