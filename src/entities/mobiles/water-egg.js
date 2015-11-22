/*global Phaser, BlueBall */

BlueBall.WaterEgg = function (target) {

    BlueBall.Mobile.call(this, target.game, target.cellPosition.x, target.cellPosition.y, 'eggSprites', 2, {
        gid: 101
    });

    this.scale.set(32 / 16);

    this.level.onPhaseChanged.add(this.phaseChanged, this);

    this.level.entities.addAt(this, 0);
    this.level.waterEgg = this;

    this.target = target.target;

};

BlueBall.WaterEgg.prototype = Object.create(BlueBall.Mobile.prototype);

BlueBall.WaterEgg.prototype.collideIndexes = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 29, 30, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 73, 77, 81, 85, 89, 93, 97, 98, 99, 100, 117 ];

BlueBall.WaterEgg.prototype.sinkEgg = function(level) {

    if (level === 0) {

        if (this.isPlayerInWater()) {

            this.level.player.die();

        } else {

            this.event = this.game.time.events.add(Phaser.Timer.SECOND * 8, this.respawn, this);

        }

        this.kill();

    } else {

        this.scale.set((32 / 16) / (4.1 - level));

        this.event = this.game.time.events.add(Phaser.Timer.SECOND * 1, this.sinkEgg, this, level - 1);

    }

};

BlueBall.WaterEgg.prototype.isPlayerInWater = function() {

    var posMainX = this.level.player.cellPosition.x >> 1;
    var posMainY = this.level.player.cellPosition.y >> 1;
    var posAltX = (this.level.player.cellPosition.x + 1) >> 1;
    var posAltY = (this.level.player.cellPosition.y + 1) >> 1;

    var positions = [
        { x: posMainX, y: posMainY },
        { x: posMainX, y: posAltY },
        { x: posAltX, y: posMainY },
        { x: posAltX, y: posAltY }
    ];

    for (var i = 0; i < positions.length; i++) {
        if (this.level.map.getTile(positions[i].x, positions[i].y, 'environment', true).index === 22) {
            return true;
        }
    }

    return false;

};

BlueBall.WaterEgg.prototype.nextAction = function() {

    var tile = this.level.map.getTile(this.cellPosition.x >> 1, this.cellPosition.y >> 1, 'environment', true);
    var canMove = false;

    if (typeof tile.properties.direction === 'number') {

        canMove = this.moveTo(tile.properties.direction);

    }
    
    if (!canMove && !this.event) {

        this.sinkEgg(3);

    }

};

BlueBall.WaterEgg.prototype.kill = function() {

    this.level.waterEgg = null;
    this.toDestroy = true;
    return BlueBall.Mobile.prototype.kill.apply(this, arguments);

};

BlueBall.WaterEgg.prototype.respawn = function () {

    this.event = null;
    this.target.respawn();
    this.destroy();

};

BlueBall.WaterEgg.prototype.destroy = function () {

    this.level.onPhaseChanged.remove(this.phaseChanged, this);
    this.game.time.events.remove(this.event);
    this.event = null;

    BlueBall.Mobile.prototype.destroy.apply(this, arguments);

};

BlueBall.WaterEgg.prototype.phaseChanged = function () {

    switch (this.level.phase) {

    case BlueBall.Level.PHASE_EXITS:
    case BlueBall.Level.PHASE_ENDED:
        this.toDestroy = true;
        break;

    }

};
