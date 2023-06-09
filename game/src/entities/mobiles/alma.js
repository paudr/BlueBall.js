BlueBall.Alma = function (game, x, y) {
    BlueBall.Mobile.call(this, game, x, y, 'mobSprites', 'alma1', {
        gid: BlueBall.Global.Entities.Alma
    });

    this.animations.add('Walking', Phaser.Animation.generateFrameNames('alma', 1, 3, '', 1), 5, true);
    this.animations.add('Running', Phaser.Animation.generateFrameNames('almaRunning', 1, 2, '', 1), 5, true);

    this._isRunning = false;

    this.lastDirection = null;
    this.level.onPhaseChanged.add(this.phaseChanged, this);
    this.currentOptions = null;
    this.isAwaken = false;

    this.normalMovementDuration = this.movementDuration;
    this.runMovementDuration = this.movementDuration * 0.75;

    this.setAnimationNames(false);
};

BlueBall.Alma.prototype = Object.create(BlueBall.Mobile.prototype);
BlueBall.Alma.prototype.constructor = BlueBall.Alma;

BlueBall.Alma.prototype.entitiesThatCollide = BlueBall.Helper.getEntityIds('Alma', 'Block', 'DonMedusa', 'Egg', 'Gol', 'Leeper', 'Medusa', 'Rocky', 'Skull', 'Snakey', 'Chest', 'DoorClosed', 'DoorOpened', 'Heart');

Object.defineProperty(BlueBall.Alma.prototype, "lookingAt", {
    get: function () {
        return this._lookingAt;
    },
    set: function (value) {
        this._lookingAt = value;
        this.lastDirection = value;
    }
});

Object.defineProperty(BlueBall.Alma.prototype, "isRunning", {
    get: function () {
        return this._isRunning;
    },
    set: function (value) {
        if (this._isRunning !== value) {
            this._isRunning = value;
            this.movementDuration = value ? this.runMovementDuration : this.normalMovementDuration;
            this.setAnimationNames(value);
        }
    }
});

BlueBall.Alma.prototype.setAnimationNames = function (isRunning) {
    if (isRunning) {
        this.animationNames[Phaser.Tilemap.NORTH] = 'Running';
        this.animationNames[Phaser.Tilemap.EAST] = 'Running';
        this.animationNames[Phaser.Tilemap.SOUTH] = 'Running';
        this.animationNames[Phaser.Tilemap.WEST] = 'Running';
    } else {
        this.animationNames[Phaser.Tilemap.NORTH] = 'Walking';
        this.animationNames[Phaser.Tilemap.EAST] = 'Walking';
        this.animationNames[Phaser.Tilemap.SOUTH] = 'Walking';
        this.animationNames[Phaser.Tilemap.WEST] = 'Walking';
    }
};

BlueBall.Alma.prototype.checkIfCanRunToPlayer = function () {
    if (!this.isRunning) {
        if (this.cellPosition.y === this.level.player.cellPosition.y) {
            var direction = this.cellPosition.x > this.level.player.cellPosition.x ? Phaser.Tilemap.WEST : Phaser.Tilemap.EAST;
            if (this.canMoveTo(direction)) {
                this.lastDirection = direction;
                this.isRunning = true;
            }
        }
    }
};

BlueBall.Alma.prototype.performMovement = function (playerPosition) {
    if (this.isRunning) {
        if (!this.moveTo(this.lastDirection)) {
            this.isRunning = false;
        }
    } else {
        var turnback = (this.lastDirection + 2) % 4;

        if (this.canMoveTo(playerPosition.principal) && playerPosition.principal !== turnback) {
            this.lastDirection = playerPosition.principal;
            this.moveTo(this.lastDirection);
            return;
        }

        if (this.canMoveTo(playerPosition.secondary) && playerPosition.secondary !== turnback) {
            this.lastDirection = playerPosition.secondary;
            this.moveTo(this.lastDirection);
            return;
        }

        if (this.canMoveTo(this.lastDirection)) {
            this.moveTo(this.lastDirection);
            return;
        }

        var thirdDirection = 6 - (playerPosition.principal + playerPosition.secondary);

        if (this.lastDirection === playerPosition.principal || this.lastDirection === playerPosition.secondary) {
            thirdDirection -= turnback;
        } else {
            thirdDirection -= this.lastDirection;
        }

        this.lastDirection = this.canMoveTo(thirdDirection) ? thirdDirection : turnback;
        this.moveTo(this.lastDirection);
    }
};

BlueBall.Alma.prototype.nextAction = function () {
    if (this.isAwaken === true && this.alive) {
        var playerPosition = BlueBall.Helper.getDirectionTo(this, this.level.player);

        if (this.canTouch(this.level.player) > 0 && this.canMoveTo(playerPosition.principal)) {
            this.level.player.die();
        } else {
            if (this.lastDirection === null) {
                this.lastDirection = this.lookingAt;
            }

            this.checkIfCanRunToPlayer();

            if (this.lastDirection === null) {
                this.lastDirection = playerPosition.principal;
            }

            this.performMovement(playerPosition);
        }
    }
};

BlueBall.Alma.prototype.destroy = function () {
    this.level.onPhaseChanged.remove(this.phaseChanged, this);
    BlueBall.Mobile.prototype.destroy.apply(this, arguments);
};

BlueBall.Alma.prototype.respawn = function () {
    BlueBall.Mobile.prototype.respawn.apply(this, arguments);
    this.lastDirection = this.lookingAt;
};

BlueBall.Alma.prototype.phaseChanged = function (currentPhase) {
    switch (currentPhase) {
    case BlueBall.Level.PHASES.HEARTS:
        this.isAwaken = true;
        break;
    case BlueBall.Level.PHASES.EXITS:
    case BlueBall.Level.PHASES.ENDED:
        this.toDestroy = true;
        break;
    }
};
