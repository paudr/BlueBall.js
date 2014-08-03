/*global Phaser, $ */

var BlueBall = BlueBall || {};

BlueBall.Boot = function () {};

BlueBall.Boot.prototype = Object.create(Phaser.State.prototype);
BlueBall.Boot.prototype.constructor = BlueBall.Boot;

BlueBall.Boot.prototype.preload = function () {

    this.game.load.image('AdventuresOfLolo3', 'assets/tilemaps/tiles/AdventuresOfLolo3.png');
    this.game.load.image('AdventuresOfLolo3Attrib', 'assets/tilemaps/tiles/AdventuresOfLolo3Attrib.png');
    this.game.load.atlas('loloSprites', 'assets/sprites/loloSprites.png', 'assets/sprites/loloSprites.json');
    this.game.load.atlas('tileSprites', 'assets/tilemaps/tiles/AdventuresOfLolo3Attrib.png', 'assets/sprites/tileSprites.json');
    this.game.load.atlas('chestSprites', 'assets/sprites/chestSprites.png', 'assets/sprites/chestSprites.json');
    this.game.load.atlas('mobSprites', 'assets/sprites/mobSprites.png', 'assets/sprites/mobSprites.json');
    this.game.load.atlas('eggSprites', 'assets/sprites/eggSprites.png', 'assets/sprites/eggSprites.json');

};

BlueBall.Boot.prototype.create = function () {

    if (this.game.device.desktop)
    {

		var $layer = $(this.game.parent ? '#' + this.game.parent : 'body');

		var resizeCanvas = function() {

			var width = $layer.width(),
				height = $layer.height();

			var multiplier = Math.min((height / this.game.height), (width / this.game.width));

			this.scale.width = Math.round(this.game.width * multiplier);
			this.scale.height = Math.round(this.game.height * multiplier);

			this.scale.margin.x = Math.round((width - this.scale.width) / 2);
			this.scale.margin.y = Math.round((height - this.scale.height) / 2);

			this.game.canvas.style.marginLeft = this.scale.margin.x + 'px';
			this.game.canvas.style.marginTop = this.scale.margin.y + 'px';

			this.scale.setSize();

		};

		resizeCanvas.apply(this);

		window.addEventListener('resize', resizeCanvas.bind(this));

    }

    this.game.state.start('level1-1');

};
