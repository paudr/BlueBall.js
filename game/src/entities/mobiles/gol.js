BlueBall.Gol = function (game, x, y, key, frame) {
    BlueBall.Mobile.call(this, game, x, y, key, frame, {
        gid: BlueBall.Global.Entities.Gol
    });

    this.isAwaken = false;
    this.isPlayerVisible = false;
    this.lookingAt = Phaser.Tilemap.SOUTH;
    this.projectile = null;

    this.level.onPhaseChanged.add(this.phaseChanged, this);
    this.level.onPlayerMoved.add(this.checkShoot, this);
};

BlueBall.Gol.prototype = Object.create(BlueBall.Mobile.prototype);
BlueBall.Gol.prototype.constructor = BlueBall.Gol;

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

BlueBall.Gol.prototype.shoot = function (direction) {
    if (this.projectile === null) {
        this.projectile = new BlueBall.ProjectileGol(this, direction);
        return true;
    }

    return false;
};

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

BlueBall.Gol.prototype.phaseChanged = function (currentPhase) {
    switch (currentPhase) {
    case BlueBall.Level.PHASES.PEARLS:
        this.frameName = 'gol2';
        this.isAwaken = true;
        break;
    case BlueBall.Level.PHASES.EXITS:
    case BlueBall.Level.PHASES.ENDED:
        this.toDestroy = true;
        if (this.projectile !== null) {
            this.projectile.destroy();
        }
        break;
    }
};

BlueBall.Gol.prototype.destroy = function () {
    this.level.onPhaseChanged.remove(this.phaseChanged, this);
    this.level.onPlayerMoved.remove(this.checkShoot, this);

    BlueBall.Mobile.prototype.destroy.apply(this, arguments);
};

BlueBall.Gol.prototype.nextAction = function () {
    if (this.alive && this.isAwaken && this.isPlayerVisible) {
        this.shoot(this.lookingAt);
    }
};
