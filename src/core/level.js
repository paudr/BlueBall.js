/*global Phaser, BlueBall */

BlueBall.Level = function (name) {

    this.levelName = name;
    this.map = null;
    this.layers = null;
    this.entities = null;
    this.player = null;
    this.exit = null;
    this.waterEgg = null;

    this.onPlayerMoved = null;
    this.onPlayerDead = null;
    this.onPhaseChanged = null;

    this.gui = null;

};

BlueBall.Level.prototype = Object.create(Phaser.State.prototype);

BlueBall.Level.PHASE_INITIAL = 0;
BlueBall.Level.PHASE_HEARTS = 1;
BlueBall.Level.PHASE_PEARLS = 2;
BlueBall.Level.PHASE_EXITS = 3;
BlueBall.Level.PHASE_ENDED = 4;

BlueBall.Level.prototype.preload = function () {

    this.game.load.tilemap(this.levelName, 'assets/tilemaps/' + BlueBall.Config.levelPrefix + this.levelName + '.json', null, Phaser.Tilemap.TILED_JSON);

};

BlueBall.Level.prototype.create = function () {

    this.phase = BlueBall.Level.PHASE_INITIAL;

    this.onPlayerMoved = new Phaser.Signal();
    this.onPlayerDead = new Phaser.Signal();
    this.onPhaseChanged = new Phaser.Signal();

    this.onPlayerDead.add(this.playerDead, this);

    this.map = this.game.add.tilemap(this.levelName);

    this.layers = this.game.add.group();
    this.entities = this.game.add.group(this.layers);

    this.layers.x = 50;
    this.layers.y = 50;

    this.gui = new BlueBall.Gui(this);

    this.map.addTilesetImage('AdventuresOfLolo3', 'AdventuresOfLolo3');

    this.map.createLayer('environment', undefined, undefined, this.layers);

    this.map.createFromObjects('entities', 117, 'chestSprites', 0, true, false, this.entities, BlueBall.Chest, false);
    this.map.createFromObjects('entities', 30, 'tileSprites', 1, true, false, this.entities, BlueBall.Heart, false);
    this.map.createFromObjects('entities', 15, 'tileSprites', 2, true, false, this.entities, BlueBall.Exit, false);
    this.map.createFromObjects('entities', 29, 'tileSprites', 0, true, false, this.entities, BlueBall.Block, false);

    this.map.createFromObjects('entities', 99, 'playerSprites', 10, true, false, this.entities, BlueBall.Player, false);
    this.player = this.entities.filter(function (entity) { return entity instanceof BlueBall.Player; }).first;

    this.map.createFromObjects('entities', 97, 'mobSprites', 3, true, false, this.entities, BlueBall.Snakey, false);
    this.map.createFromObjects('entities', 81, 'mobSprites', 6, true, false, this.entities, BlueBall.Gol, false);
    this.map.createFromObjects('entities', 69, 'mobSprites', 14, true, false, this.entities, BlueBall.Leeper, false);
    this.map.createFromObjects('entities', 93, 'mobSprites', 24, true, false, this.entities, BlueBall.Skull, false);
    this.map.createFromObjects('entities', 73, 'mobSprites', 38, true, false, this.entities, BlueBall.Rocky, false);
    this.map.createFromObjects('entities', 77, 'mobSprites', 46, true, false, this.entities, BlueBall.Alma, false);
    this.map.createFromObjects('entities', 98, 'mobSprites', 51, true, false, this.entities, BlueBall.Medusa, false);
    this.map.createFromObjects('entities', 85, 'mobSprites', 55, true, false, this.entities, BlueBall.DonMedusa, false);

    this.layers.bringToTop(this.entities);

};

BlueBall.Level.prototype.shutdown = function () {

    this.entities.destroy(true);

    this.onPlayerDead.remove(this.playerDead, this);

    this.onPlayerMoved.dispose();
    this.onPhaseChanged.dispose();

};

BlueBall.Level.prototype.update = function () {

    this.checkEntitiesToDestroy();

    switch (this.phase) {

    case BlueBall.Level.PHASE_INITIAL:
        if (this.player.isMoving === true) {

            this.phase = BlueBall.Level.PHASE_HEARTS;
            this.onPhaseChanged.dispatch(this);

        }
        break;

    case BlueBall.Level.PHASE_HEARTS:
        if (this.countHearts() === 0) {

            this.phase = BlueBall.Level.PHASE_PEARLS;
            this.openChests();
            this.onPhaseChanged.dispatch(this);

        }
        break;

    case BlueBall.Level.PHASE_PEARLS:
        if (this.countPearls() === 0) {

            this.phase = BlueBall.Level.PHASE_EXITS;
            this.openExits();
            this.onPhaseChanged.dispatch(this);

        }
        break;

    }

};

BlueBall.Level.prototype.checkEntitiesToDestroy = function () {

    var i,
        current;

    for (i = 0; i < this.entities.length; i++) {

        current = this.entities.getAt(i);

        if (current.toDestroy === true) {

            current.destroy(true);

        }

    }

};

BlueBall.Level.prototype.countHearts = function () {

    var quantity = 0,
        i;

    for (i = 0; i < this.entities.length; i++) {

        if (this.entities.getAt(i) instanceof BlueBall.Heart) {

            quantity++;

        }

    }

    return quantity;

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

BlueBall.Level.prototype.countPearls = function () {

    var quantity = 0,
        i,
        current;

    for (i = 0; i < this.entities.length; i++) {

        current = this.entities.getAt(i);

        if (current instanceof BlueBall.Chest && current.status !== BlueBall.Chest.EMPTY) {

            quantity++;

        }

    }

    return quantity;

};

BlueBall.Level.prototype.openExits = function () {

    var i,
        current;

    for (i = 0; i < this.entities.length; i++) {

        current = this.entities.getAt(i);

        if (current instanceof BlueBall.Exit) {

            current.open();

        }

    }

};

BlueBall.Level.prototype.getEntitesAt = function (x, y) {

    var entities = [],
        i,
        length,
        current;

    length = this.entities.length;

    for (i = 0; i < length; i++) {

        current = this.entities.getAt(i);

        if (current.exists && current.occupy(x, y)) {

            entities.push(current);

        }

    }

    return entities;

};

BlueBall.Level.prototype.catchExit = function () {

    this.phase = BlueBall.Level.PHASE_ENDED;
    this.onPhaseChanged.dispatch(this);

    this.player.win();

    this.game.time.events.add(Phaser.Timer.HALF, function() {

        this.game.state.start(this.map.properties.next);

    }, this);

};

BlueBall.Level.prototype.playerDead = function () {

    this.phase = BlueBall.Level.PHASE_ENDED;
    this.onPhaseChanged.dispatch(this);

    this.game.time.events.add(Phaser.Timer.SECOND * 1, function() {

        this.game.state.start(this.levelName, true, false);

    }, this);

};

BlueBall.Level.prototype.blinkHearts = function(start) {

    for (var i = 0; i < this.entities.length; i++) {

        if (this.entities.getAt(i) instanceof BlueBall.Heart) {

            this.entities.getAt(i).blink(start);

        }

    }

}