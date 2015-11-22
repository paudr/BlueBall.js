/*global Phaser, BlueBall */

BlueBall.Egg = function (target) {

    BlueBall.Mobile.call(this, target.game, target.cellPosition.x, target.cellPosition.y, 'eggSprites', 2, {
        gid: 100
    });

    this.scale.set(32 / 16);

    this.level.onPhaseChanged.add(this.phaseChanged, this);

    this.level.entities.addAt(this, 0);

    this.target = target;

    target.kill();

    this.event = this.game.time.events.add(Phaser.Timer.SECOND * 5, this.breakEgg, this);

};

BlueBall.Egg.prototype = Object.create(BlueBall.Mobile.prototype);

BlueBall.Egg.prototype.collideIndexesWithOutWater = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 29, 30, 69, 73, 77, 81, 85, 89, 93, 97, 98, 99, 100, 117 ];

BlueBall.Egg.prototype.collideIndexesWithWater = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 22, 29, 30, 69, 73, 77, 81, 85, 89, 93, 97, 98, 99, 100, 117 ];

Object.defineProperty(BlueBall.Egg.prototype, 'collideIndexes', {
    get: function() {

        if (this.level.waterEgg instanceof BlueBall.WaterEgg) {

            return BlueBall.Egg.prototype.collideIndexesWithWater;

        } else {

            return BlueBall.Egg.prototype.collideIndexesWithOutWater;

        }

    }
});

BlueBall.Egg.prototype.breakEgg = function () {

    this.frameName = 'eggBroken';

    this.event = this.game.time.events.add(Phaser.Timer.SECOND * 2, this.open, this);

};

BlueBall.Egg.prototype.open = function () {

    this.event = null;

    this.target.setPosition(this.cellPosition.x, this.cellPosition.y);

    this.target.revive();

    this.destroy(true);

};

BlueBall.Egg.prototype.die = function () {

    this.game.time.events.remove(this.event);

    this.event = this.game.time.events.add(Phaser.Timer.SECOND * 8, this.respawn, this);
    this.kill();

};

BlueBall.Egg.prototype.respawn = function () {

    this.event = null;
    this.target.respawn();
    this.destroy();

};

BlueBall.Egg.prototype.isInWater = function() {

    var posMainX = this.cellPosition.x >> 1;
    var posMainY = this.cellPosition.y >> 1;
    var posAltX = (this.cellPosition.x + 1) >> 1;
    var posAltY = (this.cellPosition.y + 1) >> 1;

    var positions = [
        { x: posMainX, y: posMainY },
        { x: posMainX, y: posAltY },
        { x: posAltX, y: posMainY },
        { x: posAltX, y: posAltY }
    ];

    for (var i = 0; i < positions.length; i++) {
        if (this.level.map.getTile(positions[i].x, positions[i].y, 'environment', true).index !== 22) {
            return false;
        }
    }

    return true;

};

BlueBall.Egg.prototype.nextAction = function() {

    if (this.isInWater()) {

        var newEgg = new BlueBall.WaterEgg(this);
        this.toDestroy = true;
    }

};

BlueBall.Egg.prototype.destroy = function () {

    this.level.onPhaseChanged.remove(this.phaseChanged, this);
    this.game.time.events.remove(this.event);
    this.event = null;

    BlueBall.Mobile.prototype.destroy.apply(this, arguments);

};

BlueBall.Egg.prototype.phaseChanged = function () {

    switch (this.level.phase) {

    case BlueBall.Level.PHASE_EXITS:
    case BlueBall.Level.PHASE_ENDED:
        this.toDestroy = true;
        break;

    }

};
