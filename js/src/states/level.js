/*global Phaser */

var BlueBall = BlueBall || {};

BlueBall.Level = function (name) {

    this.levelName = name;

};

BlueBall.Level.prototype = Object.create(Phaser.State.prototype);
BlueBall.Level.prototype.constructor = BlueBall.Level;

BlueBall.Level.prototype.levelName = '';
BlueBall.Level.prototype.floor = 0;
BlueBall.Level.prototype.level = 0;
BlueBall.Level.prototype.map = null;
BlueBall.Level.prototype.layers = null;
BlueBall.Level.prototype.entities = null;
BlueBall.Level.prototype.hearts = 0;
BlueBall.Level.prototype.player = null;
BlueBall.Level.prototype.exit = null;

BlueBall.Level.prototype.preload = function () {

    this.game.load.tilemap(this.levelName, 'assets/tilemaps/maps/' + this.levelName + '.json', null, Phaser.Tilemap.TILED_JSON);

};

BlueBall.Level.prototype.create = function () {

    this.map = this.game.add.tilemap(this.levelName);

    this.floor = this.map.properties.world;
    this.level = this.map.properties.level;

    this.layers = this.game.add.group();
    this.entities = this.game.add.group(this.layers);

    this.layers.x = 50;
    this.layers.y = 50;

    this.map.addTilesetImage('AdventuresOfLolo3', 'AdventuresOfLolo3');

    this.map.createLayer('environment', undefined, undefined, this.layers);

    this.map.createFromObjects('entities', 117, 'chestSprites', 0, true, false, this.entities, BlueBall.Chest, false);
    this.map.createFromObjects('entities', 30, 'tileSprites', 0, true, false, this.entities, BlueBall.Heart, false);
    this.map.createFromObjects('entities', 15, 'tileSprites', 3, true, false, this.entities, BlueBall.Exit, false);
    this.map.createFromObjects('entities', 29, 'tileSprites', 1, true, false, this.entities, BlueBall.Block, false);
    this.map.createFromObjects('entities', 97, 'mobSprites', 3, true, false, this.entities, BlueBall.Snakey, false);
    this.map.createFromObjects('entities', 99, 'smallLolo', 10, true, false, this.entities, BlueBall.Lolo, false);

    this.entities.forEach(function (entity) {

        var self = this;

        if (entity instanceof BlueBall.Lolo) {

            this.player = entity;

        } else if (entity instanceof BlueBall.Exit) {

            this.exit = entity;

            entity.onPlayerEnter = function(exit) {

                if(exit.gid === 17) {

                    self.game.state.start(self.map.properties.next);

                }

            };

        } else if (entity instanceof BlueBall.Heart) {

            entity.onPlayerEnter = function (heart) {

                heart.destroy(true);
                self.countHearts();

            };

        } else if (entity instanceof BlueBall.Chest) {

            entity.onPlayerEnter = function (chest) {

                if (chest.status === BlueBall.Chest.OPENED) {

                    chest.getPearl();
                    self.exit.open();

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