/*global Phaser, BlueBall */

BlueBall.Gol = function (game, x, y, key, frame) {

    BlueBall.Shooter.call(this, game, x, y, key, frame, {
        gid: 81
    });

    this.isAwaken = false;
    this.isPlayerVisible = false;

    this.projectileClass = BlueBall.ProjectileGol;

    this.level.onPhaseChanged.add(this.phaseChanged, this);
    this.level.onPlayerMovementEnded.add(this.checkPlayerVisibleIn, this);
    this.level.onPlayerMovementStarted.add(this.checkPlayerVisibleOut, this);

    this.lookingAt = Phaser.Tilemap.SOUTH;

};

BlueBall.Gol.prototype = Object.create(BlueBall.Shooter.prototype);

Object.defineProperty(BlueBall.Gol.prototype, "lookingAt", {

    get: function () {

        return this._lookingAt;

    },

    set: function (value) {

        this._lookingAt = value;

        switch (value) {
        case Phaser.Tilemap.NORTH:
            this.angle = 180;
            break;
        case Phaser.Tilemap.EAST:
            this.angle = -90;
            break;
        case Phaser.Tilemap.SOUTH:
            this.angle = 0;
            break;
        case Phaser.Tilemap.WEST:
            this.angle = 90;
            break;
        }

    }

});

BlueBall.Gol.prototype.checkPlayerVisibleIn = function (player) {

    if (this.isPlayerVisible === false && this.checkShoot(player.cellPosition)) {

        this.isPlayerVisible = true;

    }

};

BlueBall.Gol.prototype.checkPlayerVisibleOut = function (player, direction) {

    if (this.isPlayerVisible === true && !this.checkShoot(player.cellsAt(direction)[0])) {

        this.isPlayerVisible = false;

    }

};

BlueBall.Gol.prototype.checkShoot = function (position) {

    switch (this._lookingAt) {
    case Phaser.Tilemap.NORTH:
        if (position.y < this.cellPosition.y) {
            if (this.cellPosition.x - 1 <= position.x && position.x <= this.cellPosition.x + 1) {
                return true;
            }
        }
        break;
    case Phaser.Tilemap.EAST:
        if (position.x > this.cellPosition.x) {
            if (this.cellPosition.y - 1 <= position.y && position.y <= this.cellPosition.y + 1) {
                return true;
            }
        }
        break;
    case Phaser.Tilemap.SOUTH:
        if (position.y > this.cellPosition.y) {
            if (this.cellPosition.x - 1 <= position.x && position.x <= this.cellPosition.x + 1) {
                return true;
            }
        }
        break;
    case Phaser.Tilemap.WEST:
        if (position.x < this.cellPosition.x) {
            if (this.cellPosition.y - 1 <= position.y && position.y <= this.cellPosition.y + 1) {
                return true;
            }
        }
        break;
    }

    return false;

};

BlueBall.Gol.prototype.phaseChanged = function () {

    switch (this.level.phase) {

    case BlueBall.Level.PHASE_PEARLS:
        this.frameName = 'gol2';
        this.isAwaken = true;
        break;

    case BlueBall.Level.PHASE_EXITS:
        this.toDestroy = true;
        break;

    }

};

BlueBall.Gol.prototype.destroy = function () {

    this.level.onPhaseChanged.remove(this.phaseChanged, this);
    this.level.onPlayerMovementEnded.remove(this.checkPlayerVisibleIn, this);
    this.level.onPlayerMovementEnded.remove(this.checkPlayerVisibleOut, this);

    BlueBall.Shooter.prototype.destroy.apply(this, arguments);

};

BlueBall.Gol.prototype.update = function () {

    if (this.alive && this.isAwaken && this.isPlayerVisible) {

        this.shoot(this.lookingAt);

    }

    BlueBall.Shooter.prototype.update.call(this);

};

BlueBall.Gol.prototype.fired = function (projectile) {

    if (projectile instanceof BlueBall.ProjectileEgg) {

        new BlueBall.Egg(this);

    }

};