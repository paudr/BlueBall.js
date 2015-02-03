/*global Phaser, BlueBall */

BlueBall.Gol = function (game, x, y, key, frame) {

    BlueBall.Shooter.call(this, game, x, y, key, frame, {
        gid: 81
    });

    this.isAwaken = false;
    this.isPlayerVisible = false;

    this.projectileClass = BlueBall.ProjectileGol;

    this.level.onPhaseChanged.add(this.phaseChanged, this);
    this.level.onPlayerMoved.add(this.checkShoot, this);

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

BlueBall.Gol.prototype.checkShoot = function (player) {

    this.isPlayerVisible = false;

    switch (this._lookingAt) {
    case Phaser.Tilemap.NORTH:
        if (player.cellPosition.y < this.cellPosition.y) {
            if (this.cellPosition.x - 1 <= player.cellPosition.x && player.cellPosition.x <= this.cellPosition.x + 1) {
                this.isPlayerVisible = true;
            }
        }
        break;
    case Phaser.Tilemap.EAST:
        if (player.cellPosition.x > this.cellPosition.x) {
            if (this.cellPosition.y - 1 <= player.cellPosition.y && player.cellPosition.y <= this.cellPosition.y + 1) {
                this.isPlayerVisible = true;
            }
        }
        break;
    case Phaser.Tilemap.SOUTH:
        if (player.cellPosition.y > this.cellPosition.y) {
            if (this.cellPosition.x - 1 <= player.cellPosition.x && player.cellPosition.x <= this.cellPosition.x + 1) {
                this.isPlayerVisible = true;
            }
        }
        break;
    case Phaser.Tilemap.WEST:
        if (player.cellPosition.x < this.cellPosition.x) {
            if (this.cellPosition.y - 1 <= player.cellPosition.y && player.cellPosition.y <= this.cellPosition.y + 1) {
                this.isPlayerVisible = true;
            }
        }
        break;
    }

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
    this.level.onPlayerMoved.remove(this.checkShoot, this);

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