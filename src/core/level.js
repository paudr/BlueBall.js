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

BlueBall.Level.PHASES = {
    'INITIAL': 0,
    'HEARTS': 1,
    'PEARLS': 2,
    'EXITS': 3,
    'ENDED': 4
};

BlueBall.Level.prototype.preload = function () {
    this.game.load.tilemap(this.levelName, 'assets/tilemaps/' + BlueBall.Config.levelPrefix + this.levelName + '.json', null, Phaser.Tilemap.TILED_JSON);
};

BlueBall.Level.prototype.create = function () {
    this.currentPhase = BlueBall.Level.PHASES.INITIAL;

    this.onPlayerMoved = new Phaser.Signal();
    this.onPlayerDead = new Phaser.Signal();
    this.onPhaseChanged = new Phaser.Signal();

    this.onPlayerDead.add(this.playerDead, this);

    this.map = this.game.add.tilemap(this.levelName);

    this.layers = this.game.add.group();
    this.entities = this.game.add.group(this.layers);

    if (this.game.device.android) {
        this.resize(this.game.width, this.game.height);
    } else {
        this.layers.x = 50;
        this.layers.y = 50;
    }

    this.gui = new BlueBall.Gui(this);

    this.map.addTilesetImage('AdventuresOfLolo3', 'AdventuresOfLolo3');

    this.map.createLayer('environment', undefined, undefined, this.layers);

    this.map.createFromObjects('entities', BlueBall.Global.Entities.Chest, 'chestSprites', 0, true, false, this.entities, BlueBall.Chest, false);
    this.map.createFromObjects('entities', BlueBall.Global.Entities.Heart, 'tileSprites', 1, true, false, this.entities, BlueBall.Heart, false);
    this.map.createFromObjects('entities', BlueBall.Global.Entities.DoorClosed, 'tileSprites', 2, true, false, this.entities, BlueBall.Exit, false);
    this.map.createFromObjects('entities', BlueBall.Global.Entities.Block, 'tileSprites', 0, true, false, this.entities, BlueBall.Block, false);

    this.map.createFromObjects('entities', BlueBall.Global.Entities.Player, 'playerSprites', 10, true, false, this.entities, BlueBall.Player, false);
    this.player = this.entities.iterate('isPlayer', true, Phaser.Group.RETURN_CHILD);
    this.playerInput = new BlueBall.Keyboard(this.game);
    this.player.assignInput(this.playerInput);

    this.map.createFromObjects('entities', BlueBall.Global.Entities.Snakey, 'mobSprites', 3, true, false, this.entities, BlueBall.Snakey, false);
    this.map.createFromObjects('entities', BlueBall.Global.Entities.Gol, 'mobSprites', 6, true, false, this.entities, BlueBall.Gol, false);
    this.map.createFromObjects('entities', BlueBall.Global.Entities.Leeper, 'mobSprites', 14, true, false, this.entities, BlueBall.Leeper, false);
    this.map.createFromObjects('entities', BlueBall.Global.Entities.Skull, 'mobSprites', 24, true, false, this.entities, BlueBall.Skull, false);
    this.map.createFromObjects('entities', BlueBall.Global.Entities.Rocky, 'mobSprites', 38, true, false, this.entities, BlueBall.Rocky, false);
    this.map.createFromObjects('entities', BlueBall.Global.Entities.Alma, 'mobSprites', 46, true, false, this.entities, BlueBall.Alma, false);
    this.map.createFromObjects('entities', BlueBall.Global.Entities.Medusa, 'mobSprites', 51, true, false, this.entities, BlueBall.Medusa, false);
    this.map.createFromObjects('entities', BlueBall.Global.Entities.DonMedusa, 'mobSprites', 55, true, false, this.entities, BlueBall.DonMedusa, false);

    this.layers.bringToTop(this.entities);
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
    var gameBaseWidth = 50 + 416 + 50;
    var gameBaseHeight = 50 + 448 + 50;
    var ratio = this.scale.isLandscape ? height/gameBaseHeight : width/gameBaseWidth;

    this.layers.scale.x = ratio;
    this.layers.scale.y = ratio;
    this.layers.x = (width - (gameBaseWidth * ratio)) / 2;
    this.layers.y = (height - (gameBaseHeight * ratio)) / 2;
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
        this.game.state.start(this.map.properties.next);
    }, this);
};

BlueBall.Level.prototype.playerDead = function () {
    this.setCurrentPhase(BlueBall.Level.PHASES.ENDED);
    this.game.time.events.add(Phaser.Timer.SECOND * 1, function () {
        this.game.state.start(this.levelName, true, false);
    }, this);
};

BlueBall.Level.prototype.blinkHearts = function (start) {
    this.entities.iterate('isHeart', true, Phaser.Group.RETURN_NONE, function (entity) {
        entity.blink(start);
    });
};
