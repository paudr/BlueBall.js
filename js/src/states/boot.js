/*global Phaser */

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

};

BlueBall.Boot.prototype.create = function () {

    this.game.state.start('level1-1');

};
