/*global Phaser, BlueBall */

BlueBall.Leeper = function (game, x, y, key, frame) {

    BlueBall.Mobile.call(this, game, x, y, key, frame, {
        gid: 69
    });

    this.animations.add('Top', Phaser.Animation.generateFrameNames('leeperUp', 1, 2, '', 1), 5, true);
    this.animations.add('Right', Phaser.Animation.generateFrameNames('leeperRight', 1, 2, '', 1), 5, true);
    this.animations.add('Down', Phaser.Animation.generateFrameNames('leeperDown', 1, 2, '', 1), 5, true);
    this.animations.add('Left', Phaser.Animation.generateFrameNames('leeperLeft', 1, 2, '', 1), 5, true);
    this.animations.add('Sleep', Phaser.Animation.generateFrameNames('leeperSleep', 1, 2, '', 1), 1, true);

    this.isSleeping = false;

    this.lastDirection = null;

    this.level.onPhaseChanged.add(this.phaseChanged, this);

    this.currentOptions = null;

};

BlueBall.Leeper.prototype = Object.create(BlueBall.Mobile.prototype);

Object.defineProperty(BlueBall.Leeper.prototype, "lookingAt", {

    get: function () {

        return this._lookingAt;

    },

    set: function (value) {

        this._lookingAt = value;
        this.lastDirection = value;

    }

});

BlueBall.Leeper.prototype.getDirectionToPlayer = function () {

    var distanceX = this.level.player.cellPosition.x - this.cellPosition.x,
        distanceY = this.level.player.cellPosition.y - this.cellPosition.y,
        firstDirection,
        secondDirection;

    if (Math.abs(distanceX) >= Math.abs(distanceY)) {

        if (distanceX >= 0) {
            firstDirection = Phaser.Tilemap.EAST;
        }
        else {
            firstDirection = Phaser.Tilemap.WEST;
        }

        if(distanceY >= 0) {
            secondDirection = Phaser.Tilemap.SOUTH;
        }
        else {
            secondDirection = Phaser.Tilemap.NORTH;
        }

    }
    else {

        if (distanceY >= 0) {
            firstDirection = Phaser.Tilemap.SOUTH;
        }
        else {
            firstDirection = Phaser.Tilemap.NORTH;
        }

        if (distanceX >= 0) {
            secondDirection = Phaser.Tilemap.EAST;
        }
        else {
            secondDirection = Phaser.Tilemap.WEST;
        }

    }

    return {
        'principal': firstDirection,
        'secondary': secondDirection
    };

};

BlueBall.Leeper.prototype.performMovement = function(playerPosition) {

    var turnback = (this.lastDirection + 2) % 4;

    if (this.canMoveTo(playerPosition.principal) && playerPosition.principal !== turnback)
    {
        this.lastDirection = playerPosition.principal;
        this.moveTo(this.lastDirection);
        return;
    }

    if (this.canMoveTo(playerPosition.secondary) && playerPosition.secondary !== turnback)
    {
        this.lastDirection = playerPosition.secondary;
        this.moveTo(this.lastDirection);
        return;
    }

    if (this.canMoveTo(this.lastDirection))
    {
        this.moveTo(this.lastDirection);
        return;
    }

    var thirdDirection = 6 - (playerPosition.principal + playerPosition.secondary);

    if(this.lastDirection === playerPosition.principal || this.lastDirection === playerPosition.secondary) {
        thirdDirection -= turnback;
    }
    else {
        thirdDirection -= this.lastDirection;
    }

    this.lastDirection = this.canMoveTo(thirdDirection) ? thirdDirection : turnback;
    this.moveTo(this.lastDirection);

};

BlueBall.Leeper.prototype.nextAction = function () {

    if (!this.isSleeping) {

        if (this.canTouch(this.level.player) > 0) {

            this.isSleeping = true;
            this.canBeCaptured = false;
            this.animations.play('Sleep');

        }
        else {

            var directionToPlayer = this.getDirectionToPlayer();

            if (this.lastDirection === null) {

                this.lastDirection = directionToPlayer.principal;

            }

            this.performMovement(directionToPlayer);

        }

    }

};

BlueBall.Leeper.prototype.destroy = function () {

    this.level.onPhaseChanged.remove(this.phaseChanged, this);

    BlueBall.Mobile.prototype.destroy.apply(this, arguments);

};

BlueBall.Leeper.prototype.respawn = function () {

    BlueBall.Mobile.prototype.respawn.apply(this, arguments);

    this.lastDirection = this.lookingAt;

};

BlueBall.Leeper.prototype.phaseChanged = function () {

    switch (this.level.phase) {

    case BlueBall.Level.PHASE_EXITS:
    case BlueBall.Level.PHASE_ENDED:
        this.toDestroy = true;
        break;

    }

};