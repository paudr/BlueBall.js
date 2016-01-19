/*global Phaser, BlueBall */

BlueBall.WaterEgg = function (target) {

    BlueBall.Mobile.call(this, target.game, target.cellPosition.x, target.cellPosition.y, 'eggSprites', 2, {
        gid: BlueBall.Global.Entities.WaterEgg
    });

    this.speed.x /= 2;
    this.speed.y /= 2;

    this.scale.set(32 / 16);

    this.level.onPhaseChanged.add(this.phaseChanged, this);

    this.level.entities.addAt(this, 0);
    this.level.waterEgg = this;

    this.target = target.target;

};

BlueBall.WaterEgg.prototype = Object.create(BlueBall.Mobile.prototype);

BlueBall.WaterEgg.prototype.collideIndexes = BlueBall.Helper.getTileIds('Rock', 'Bush', 'Lava', 'Wall', 'Bridge', 'Arrow', 'LavaBridge', 'Floor', 'Sand', 'Grass');

BlueBall.WaterEgg.prototype.sinkEgg = function(level) {

    if (level === 0) {

        if (this.isPlayerInWater()) {

            this.level.player.die();

        } else {

            this.event = this.game.time.events.add(Phaser.Timer.SECOND * 8, this.respawn, this);
            this.level.waterEgg = null;
            this.kill();

        }


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

BlueBall.WaterEgg.prototype.isPlayerAbove = function() {

    var distanceX = Math.abs(this.level.player.cellPosition.x - this.cellPosition.x);
    var distanceY = Math.abs(this.level.player.cellPosition.y - this.cellPosition.y);

    if (distanceX === 0 && distanceY === 0) {
        return 2; // Full above
    }

    if (distanceX <= 1 && distanceY <= 1) {
        return 1; // Partially above
    }

    return 0;

};

BlueBall.WaterEgg.prototype.nextAction = function() {

    var tile = this.level.map.getTile(this.cellPosition.x >> 1, this.cellPosition.y >> 1, 'environment', true);
    var canMove = false;
    var playerAbove = this.isPlayerAbove();

    if (playerAbove !== 1) {

        if (typeof tile.properties.direction === 'number' && playerAbove !== 1) {

            // TODO: Falta empujar a Player
            canMove = this.moveTo(tile.properties.direction);

        }

        if (!canMove && !this.event && playerAbove !== 1) {

            this.sinkEgg(3);

        }

    }

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
