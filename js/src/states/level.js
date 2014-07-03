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
BlueBall.Level.prototype.hearts = 0;
BlueBall.Level.prototype.player = null;

BlueBall.Level.prototype.preload = function () {

    this.game.load.tilemap('level' + this.floor + '-' + this.level, 'assets/tilemaps/maps/level' + this.floor + '-' + this.level + '.json', null, Phaser.Tilemap.TILED_JSON);

};

BlueBall.Level.prototype.create = function () {

    var self = this;

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

        var self = this;

        entity.level = this;

        if (entity instanceof BlueBall.Lolo) {

            this.player = entity;

        } else if (entity instanceof BlueBall.Heart) {

            entity.onPlayerEnter = function (heart) {

                    heart.destroy(true);
                    self.countHearts();

            };

        } else if (entity instanceof BlueBall.Chest) {

            entity.onPlayerEnter = function (chest) {

                if (chest.status === BlueBall.Chest.OPENED) {

                    chest.getPearl();

                }

            };

        }

    }, this);

    this.layers.bringToTop(this.entities);

};

BlueBall.Level.prototype.countHearts = function () {

    var quantity = 0,
        i;

    for (i = 0; i < this.entities.length; i++) {

        if (this.entities.getAt(i) instanceof BlueBall.Heart) {

            quantity++;

        }

    }

    this.hearts = quantity;

    if (this.hearts === 0) {

        this.openChests();

    }

};

BlueBall.Level.prototype.openChests = function () {

    var i,
        current;

    for (i = 0; i < this.entities.length; i++) {

        current = this.entities.getAt(i);

        if (current instanceof BlueBall.Chest && current.status === BlueBall.Chest.CLOSED) {

            current.open();

        }

    }

};