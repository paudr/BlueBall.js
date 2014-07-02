/*global Phaser */

var BlueBall = BlueBall || {};

BlueBall.Level = function (floor, level) {

    this.floor = floor;
    this.level = level;

};

BlueBall.Level.prototype = Object.create(Phaser.State.prototype);
BlueBall.Level.prototype.constructor = BlueBall.Level;

BlueBall.Level.prototype.floor = 0;
BlueBall.Level.prototype.level = 0;
BlueBall.Level.prototype.map = null;
BlueBall.Level.prototype.layers = null;
BlueBall.Level.prototype.entities = null;

BlueBall.Level.prototype.preload = function () {

    this.game.load.tilemap('level' + this.floor + '-' + this.level, 'assets/tilemaps/maps/level' + this.floor + '-' + this.level + '.json', null, Phaser.Tilemap.TILED_JSON);

};

BlueBall.Level.prototype.create = function () {

    this.map = this.game.add.tilemap('level1-1');
    this.layers = this.game.add.group();
    this.entities = this.game.add.group(this.layers);

    this.layers.x = 50;
    this.layers.y = 50;

    this.map.addTilesetImage('AdventuresOfLolo3', 'AdventuresOfLolo3');

    this.map.createLayer('environment', undefined, undefined, this.layers);

    this.map.createFromObjects('entities', 117, 'chestSprites', 0, true, false, this.entities, BlueBall.Chest, false);
    this.map.createFromObjects('entities', 30, 'tileSprites', 0, true, false, this.entities, BlueBall.Heart, false);
    this.map.createFromObjects('entities', 99, 'smallLolo', 10, true, false, this.entities, BlueBall.Lolo, false);

    this.entities.forEach(function (entity) {
        entity.level = this;
    }, this);

    this.layers.bringToTop(this.entities);

};