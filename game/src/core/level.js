BlueBall.Level = function () {
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
BlueBall.Level.prototype.constructor = BlueBall.Level;

BlueBall.Level.PHASES = {
    'INITIAL': 0,
    'HEARTS': 1,
    'PEARLS': 2,
    'EXITS': 3,
    'ENDED': 4
};

BlueBall.Level.prototype.init = function (level) {
    this.levelName = level.name;
    this.levelPath = level.path;
    this.levelNext = level.next;
};

BlueBall.Level.prototype.preload = function () {
    this.game.load.json('map-' + this.levelName, 'assets/tilemaps/' + this.levelPath);
};

BlueBall.Level.prototype.create = function () {
    BlueBall.Save.saveData('currentLevel', this.levelName);

    this.currentPhase = BlueBall.Level.PHASES.INITIAL;

    this.onPlayerMoved = new Phaser.Signal();
    this.onPlayerDead = new Phaser.Signal();
    this.onPhaseChanged = new Phaser.Signal();

    this.onPlayerDead.add(this.playerDead, this);

    if (this.game.device.desktop) {
        this.playerInput = new BlueBall.Keyboard(this.game);
    } else {
        this.playerInput = new BlueBall.VirtualJoystick(this.game);
    }

    var tilesetData = this.game.cache.getJSON('tileset-data');
    var mapData = this.game.cache.getJSON('map-' + this.levelName);

    this.tileSize = {
        width: tilesetData.tileWidth,
        height: tilesetData.tileHeight
    };

    this.cellSize = {
        width: this.tileSize.width / 2,
        height: this.tileSize.height / 2
    };

    this.layers = this.game.add.group();
    this.entities = this.game.add.group(this.layers);
    this.map = this.game.add.tilemap(null, tilesetData.tileWidth, tilesetData.tileHeight, mapData.width, mapData.height);
    this.map.properties = mapData.properties;

    var tileset = this.map.addTilesetImage('tileset-image');
    tileset.firstgid = 1;
    tileset.tileProperties = tilesetData.tileProperties;

    this.environment = this.map.create('environment', mapData.width, mapData.height, tilesetData.tileWidth, tilesetData.tileHeight, this.layers);

    this.gui = new BlueBall.Gui(this);

    mapData.environment.forEach(function (tile, index) {
        tile = this.map.putTile(tile, index % mapData.width, Math.floor(index / mapData.width), this.environment);
        Phaser.Utils.mixin(tileset.tileProperties[tile.index - tileset.firstgid], tile.properties);
    }, this);

    var entityNames = Object.keys(BlueBall.Global.Entities);
    this.entities.addMultiple(mapData.entities.map(function (object) {
        var entityName = entityNames.filter(function(name) { return BlueBall.Global.Entities[name] === object.gid; })[0];
        var sprite = new BlueBall[entityName](this.game, object.x, object.y);
        Object.keys(object.properties).forEach(function (property) {
            sprite[property] = this[property];
        }, object.properties);
        return sprite;
    }, this), true);

    this.player = this.entities.iterate('isPlayer', true, Phaser.Group.RETURN_CHILD);

    this.player.assignInput(this.playerInput);
    this.game.camera.follow(this.player);

    this.entities.bringToTop(this.player);
    this.layers.bringToTop(this.entities);
    this.layers.bringToTop(this.gui.layer);

    this.resize(this.game.width, this.game.height);
};

BlueBall.Level.prototype.shutdown = function () {
    this.entities.destroy(true);
    this.playerInput.destroy();

    this.onPlayerDead.remove(this.playerDead, this);

    this.onPlayerMoved.dispose();
    this.onPlayerDead.dispose();
    this.onPhaseChanged.dispose();
};

BlueBall.Level.prototype.update = function () {
    this.entities.iterate('toDestroy', true, Phaser.Group.RETURN_NONE, BlueBall.Helper.destroyEntity);

    this.playerInput.update();

    switch (this.currentPhase) {

    case BlueBall.Level.PHASES.INITIAL:
        if (this.player.isMoving === true) {
            this.setCurrentPhase(BlueBall.Level.PHASES.HEARTS);
        }
        break;

    case BlueBall.Level.PHASES.HEARTS:
        if (this.entities.iterate('isHeart', true, Phaser.Group.RETURN_CHILD) === null) {
            this.entities.iterate('isChest', true, Phaser.Group.RETURN_NONE, BlueBall.Helper.openEntity);
            this.setCurrentPhase(BlueBall.Level.PHASES.PEARLS);
        }
        break;

    case BlueBall.Level.PHASES.PEARLS:
        if (this.entities.iterate('isEmtpyChest', false, Phaser.Group.RETURN_CHILD) === null) {
            this.entities.iterate('isExit', true, Phaser.Group.RETURN_NONE, BlueBall.Helper.openEntity);
            this.setCurrentPhase(BlueBall.Level.PHASES.EXITS);
        }
        break;

    }
};

BlueBall.Level.prototype.resize = function (width, height) {
    this.layers.x = Math.max(0, width - this.map.widthInPixels) / 2;
    this.layers.y = Math.max(0, height - this.map.heightInPixels) / 2;
    this.environment.resize(width, height);

    var offsetX = width >= this.map.widthInPixels ? 0 : 50;
    var offsetY = height >= this.map.heightInPixels ? 0 : 50;

    this.world.setBounds(-offsetX, -offsetY, this.map.widthInPixels + (offsetX * 2), this.map.heightInPixels + (offsetY * 2));

    this.playerInput.resize(width, height);
    this.gui.resize(width, height);
};

BlueBall.Level.prototype.setCurrentPhase = function (phase) {
    this.currentPhase = phase;
    this.onPhaseChanged.dispatch(phase);
}

BlueBall.Level.prototype.getEntitesAt = function (x, y) {
    return this.entities.filter(function (entity) {
        return entity.occupy(x, y);
    }, true).list;
};

BlueBall.Level.prototype.catchExit = function () {
    this.setCurrentPhase(BlueBall.Level.PHASES.ENDED);
    this.player.win();
    this.game.time.events.add(Phaser.Timer.HALF, function () {
        BlueBall.Helper.startLevel.call(this, this.levelNext);
    }, this);
};

BlueBall.Level.prototype.playerDead = function () {
    this.setCurrentPhase(BlueBall.Level.PHASES.ENDED);
    this.game.time.events.add(Phaser.Timer.SECOND * 1, function () {
        BlueBall.Helper.startLevel.call(this, this.levelName);
    }, this);
};

BlueBall.Level.prototype.blinkHearts = function (start) {
    this.entities.iterate('isHeart', true, Phaser.Group.RETURN_NONE, function (entity) {
        entity.blink(start);
    });
};

BlueBall.Level.prototype.getCellPosition = function (x, y) {
    return {
        "x": (x + 1) * this.cellSize.width,
        "y": (y + 1) * this.cellSize.height
    };
};
