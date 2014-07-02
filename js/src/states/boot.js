/*global Phaser */

var BlueBall = BlueBall || {};

BlueBall.Boot = function () {};

BlueBall.Boot.prototype = Object.create(Phaser.State.prototype);
BlueBall.Boot.prototype.constructor = BlueBall.Boot;

BlueBall.Boot.prototype.preload = function () {

    this.game.load.image('AdventuresOfLolo3', 'assets/tilemaps/tiles/AdventuresOfLolo3.png');
    this.game.load.atlas('smallLolo', 'assets/sprites/smallLolo.png', 'assets/sprites/smallLolo.json');
    this.game.load.atlas('tileSprites', 'assets/tilemaps/tiles/AdventuresOfLolo3.png', 'assets/sprites/tileSprites.json');
    this.game.load.atlas('chestSprites', 'assets/sprites/chestSprites.png', 'assets/sprites/chestSprites.json');

};

BlueBall.Boot.prototype.create = function () {

    this.game.state.start('level_1_1');

};
