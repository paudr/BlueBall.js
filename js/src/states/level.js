/*global Phaser */

var BlueBall = BlueBall || {};

BlueBall.Level = function (name) {

    this.levelName = name;
    this.map = null;
    this.layers = null;
    this.entities = null;
    this.player = null;
    this.exit = null;
    this.eggCounterText = null;

    this.phase = BlueBall.Level.PHASE_INITIAL;

    this.onPlayerMovementStarted = null;
    this.onPlayerMovementEnded = null;
    this.onPhaseChanged = null;

};

BlueBall.Level.prototype = Object.create(Phaser.State.prototype);
BlueBall.Level.prototype.constructor = BlueBall.Level;

BlueBall.Level.PHASE_INITIAL = 0;
BlueBall.Level.PHASE_HEARTS = 1;
BlueBall.Level.PHASE_PEARLS = 2;
BlueBall.Level.PHASE_EXISTS = 3;

BlueBall.Level.prototype.preload = function () {

    this.game.load.tilemap(this.levelName, 'assets/tilemaps/maps/' + this.levelName + '.json', null, Phaser.Tilemap.TILED_JSON);

};

BlueBall.Level.prototype.create = function () {

    this.onPlayerMovementStarted = new Phaser.Signal();
    this.onPlayerMovementEnded = new Phaser.Signal();
    this.onPhaseChanged = new Phaser.Signal();

    this.map = this.game.add.tilemap(this.levelName);

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
    this.map.createFromObjects('entities', 81, 'mobSprites', 7, true, false, this.entities, BlueBall.Gol, false);
    this.map.createFromObjects('entities', 99, 'loloSprites', 10, true, false, this.entities, BlueBall.Lolo, false);

    var eggCounterImage = this.game.add.sprite(420, 128, 'eggSprites', 1, this.layers);
    eggCounterImage.scale.set(2);

    this.eggCounterText = this.game.add.text(426, 156, '0', {
        'font': '32px Arial',
        'fill': '#ffffff',
        'align': 'center'
    }, this.layers);
    this.eggCounterText.setShadow(2, 0, '#666666');

    this.layers.bringToTop(this.entities);

    this.phase = BlueBall.Level.PHASE_HEARTS;

};

BlueBall.Level.prototype.shutdown = function() {

    this.entities.destroy(true);

    this.onPlayerMovementStarted.dispose();
    this.onPlayerMovementEnded.dispose();
    this.onPhaseChanged.dispose();
};

BlueBall.Level.prototype.update = function() {

    switch(this.phase) {

        case BlueBall.Level.PHASE_HEARTS:
            if(this.countHearts() === 0) {

                this.phase = BlueBall.Level.PHASE_PEARLS;
                this.openChests();
                this.onPhaseChanged.dispatch(this);

            }
            break;

        case BlueBall.Level.PHASE_PEARLS:
            if(this.countPearls() === 0) {

                this.phase = BlueBall.Level.PHASE_EXISTS;
                this.openExits();
                this.onPhaseChanged.dispatch(this);

            }
            break;
            
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

        if(typeof current.awake === 'function') {

            current.awake();

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

        if(current.destroyOnExitOpen === true) {

            current.destroy(true);

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

BlueBall.Level.prototype.catchHeart = function (heart, player) {

    player.eggs = player.eggs + heart.eggs;

    heart.destroy(true);

};

BlueBall.Level.prototype.catchPearl = function (chest) {

    chest.getPearl();

};

BlueBall.Level.prototype.catchExit = function () {

    this.game.state.start(this.map.properties.next);

};

BlueBall.Level.prototype.fired = function(shooter, impacted) {

    var i,
        length,
        current;

    for(i = 0, length = impacted.length; i < length; i++) {

        current = impacted[i];

        if(current instanceof BlueBall.Lolo) {

            // Hay que matar a Lolo

        }
        else if(current instanceof BlueBall.Egg) {

            current.fired();

        }
        else {

            new BlueBall.Egg(current);

        }

    }

};
