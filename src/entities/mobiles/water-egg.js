/*global Phaser, BlueBall */

BlueBall.WaterEgg = function (target) {
window.we = this;
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

    this.swampLevel = 3;
    this.swampTimer = this.game.time.create(false);
    this.swampTimer.repeat(Phaser.Timer.SECOND * 1, this.swampLevel + 1, this.swampEgg, this);
    this.swampTimer.start();
    this.swampTimer.pause();

};

BlueBall.WaterEgg.prototype = Object.create(BlueBall.Mobile.prototype);

BlueBall.WaterEgg.prototype.collideIndexes = BlueBall.Helper.getTileIds('Rock', 'Bush', 'Lava', 'Wall', 'Bridge', 'Arrow', 'LavaBridge', 'Floor', 'Sand', 'Grass');

BlueBall.WaterEgg.prototype.swampEgg = function() {

    if (this.swampLevel === 0) {

        if (this.isPlayerInWater()) {

            this.level.player.die();

        } else {

            this.event = this.game.time.events.add(Phaser.Timer.SECOND * 8, this.respawn, this);
            this.level.waterEgg = null;
            this.kill();

        }


    } else {

        this.scale.set((32 / 16) / (4.1 - this.swampLevel));
        this.swampLevel--;

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
        if (BlueBall.Global.Tiles.Water.indexOf(this.level.map.getTile(positions[i].x, positions[i].y, 'environment', true).index) > -1) {
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

    if (typeof tile.properties.direction === 'number') {

        if (playerAbove === 0) {

            canMove = this.moveTo(tile.properties.direction);

        } else if (playerAbove === 2 && !this.level.player.isMoving) {

            this.level.player.nextAction();

            if (!this.level.player.isMoving) {

                canMove = this.moveTo(tile.properties.direction);

                if (canMove) {

                    this._pushing.push(this.level.player);
                    this.level.player.isMoving = true;
                    this.level.player.wasPushed = true;
                    this.level.player.cellPosition.x = this.cellPosition.x;
                    this.level.player.cellPosition.y = this.cellPosition.y;
                }

            }

        }

    }

    if (!canMove && !this.isMoving && playerAbove !== 1) {

        this.swampTimer.resume();

    } else {

        this.swampTimer.pause();

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
    this.swampTimer.destroy();
    if (this.level.waterEgg === this) {
        this.level.waterEgg = null;
    }

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
