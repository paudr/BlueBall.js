BlueBall.Egg = function (target) {
    BlueBall.Mobile.call(this, target.game, target.cellPosition.x, target.cellPosition.y, 'eggSprites', 2, {
        gid: BlueBall.Global.Entities.Egg
    });

    this.scale.set(32 / 16);

    this.level.onPhaseChanged.add(this.phaseChanged, this);

    this.level.entities.addAt(this, 0);
    this.target = target;

    target.kill();

    this.event = this.game.time.events.add(Phaser.Timer.SECOND * 5, this.breakEgg, this);
};

BlueBall.Egg.prototype = Object.create(BlueBall.Mobile.prototype);

BlueBall.Egg.prototype.tilesThatCollideWithOutWater = BlueBall.Helper.getTileIds('Rock', 'Bush', 'Lava', 'Wall', 'Bridge', 'Arrow', 'LavaBridge', 'Grass');

BlueBall.Egg.prototype.tilesThatCollideWithWater = BlueBall.Helper.getTileIds('Rock', 'Bush', 'Lava', 'Wall', 'Water', 'Bridge', 'Arrow', 'LavaBridge', 'Grass');

Object.defineProperty(BlueBall.Egg.prototype, 'tilesThatCollide', {
    get: function () {
        if (this.level.waterEgg instanceof BlueBall.WaterEgg) {
            return BlueBall.Egg.prototype.tilesThatCollideWithWater;
        } else {
            return BlueBall.Egg.prototype.tilesThatCollideWithOutWater;
        }
    }
});

BlueBall.Egg.prototype.breakEgg = function () {
    this.frameName = 'eggBroken';
    this.event = this.game.time.events.add(Phaser.Timer.SECOND * 2, this.open, this);
};

BlueBall.Egg.prototype.open = function () {
    this.event = null;
    this.target.setCellPosition(this.cellPosition.x, this.cellPosition.y);
    this.target.revive();
    this.toDestroy = true;
};

BlueBall.Egg.prototype.die = function () {
    this.game.time.events.remove(this.event);

    this.event = this.game.time.events.add(Phaser.Timer.SECOND * 8, this.respawn, this);
    this.kill();
};

BlueBall.Egg.prototype.respawn = function () {
    this.event = null;
    this.target.respawn();
    this.toDestroy = true;
};

BlueBall.Egg.prototype.isInWater = function () {
    var posMainX = this.cellPosition.x >> 1;
    var posMainY = this.cellPosition.y >> 1;
    var posAltX = (this.cellPosition.x + 1) >> 1;
    var posAltY = (this.cellPosition.y + 1) >> 1;

    var positions = [{
        x: posMainX,
        y: posMainY
    }, {
        x: posMainX,
        y: posAltY
    }, {
        x: posAltX,
        y: posMainY
    }, {
        x: posAltX,
        y: posAltY
    }];

    var tileIndex;

    for (var i = 0; i < positions.length; i++) {
        tileIndex = this.level.map.getTile(positions[i].x, positions[i].y, 'environment', true).index;
        if (BlueBall.Global.Tiles.Water.indexOf(tileIndex) === -1) {
            return false;
        }
    }

    return true;
};

BlueBall.Egg.prototype.nextAction = function () {

    if (this.isInWater() && this.level.waterEgg === null) {

        new BlueBall.WaterEgg(this);
        this.toDestroy = true;
    }

};

BlueBall.Egg.prototype.destroy = function () {

    this.level.onPhaseChanged.remove(this.phaseChanged, this);
    this.game.time.events.remove(this.event);
    this.event = null;

    BlueBall.Mobile.prototype.destroy.apply(this, arguments);

};

BlueBall.Egg.prototype.phaseChanged = function (currentPhase) {
    switch (currentPhase) {
    case BlueBall.Level.PHASES.EXITS:
    case BlueBall.Level.PHASES.ENDED:
        this.toDestroy = true;
        break;
    }
};
