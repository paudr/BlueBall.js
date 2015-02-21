/*global Phaser, BlueBall */

BlueBall.Skull = function (game, x, y, key, frame) {

    BlueBall.Mobile.call(this, game, x, y, key, frame, {
        gid: 93
    });

    this.collideIndexes.push(29, 30, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 73, 81, 93, 97, 100, 117);

    this.animations.add('Top', Phaser.Animation.generateFrameNames('skullUp', 1, 2, '', 1), 5, true);
    this.animations.add('Right', Phaser.Animation.generateFrameNames('skullRight', 1, 2, '', 1), 5, true);
    this.animations.add('Down', Phaser.Animation.generateFrameNames('skullDown', 1, 2, '', 1), 5, true);
    this.animations.add('Left', Phaser.Animation.generateFrameNames('skullLeft', 1, 2, '', 1), 5, true);

    this.lastDirection = null;

    this.isAwaken = false;

    this.level.onPhaseChanged.add(this.phaseChanged, this);

};

BlueBall.Skull.prototype = Object.create(BlueBall.Mobile.prototype);

Object.defineProperty(BlueBall.Skull.prototype, "lookingAt", {

    get: function () {

        return this._lookingAt;

    },

    set: function (value) {

        this._lookingAt = value;
        this.lastDirection = value;

    }

});

BlueBall.Skull.prototype.getDirectionToPlayer = function () {

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

BlueBall.Skull.prototype.performMovement = function(playerPosition) {

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


BlueBall.Skull.prototype.nextAction = function () {

    if (this.isAwaken && this.alive) {

        if (this.canTouch(this.level.player) > 0) {

            this.level.player.die();

        }
        else {

            var directionToLolo = this.getDirectionToPlayer();

            if (this.lastDirection === null) {

                this.lastDirection = directionToLolo.principal;

            }

            this.performMovement(directionToLolo);

        }

    }

};

BlueBall.Skull.prototype.destroy = function () {

    this.level.onPhaseChanged.remove(this.phaseChanged, this);

    BlueBall.Mobile.prototype.destroy.apply(this, arguments);

};

BlueBall.Skull.prototype.respawn = function () {

    BlueBall.Mobile.prototype.respawn.apply(this, arguments);

    this.lastDirection = this.lookingAt;

};

BlueBall.Skull.prototype.phaseChanged = function () {

    switch (this.level.phase) {

    case BlueBall.Level.PHASE_PEARLS:
        this.isAwaken = true;
        break;


    case BlueBall.Level.PHASE_EXITS:
    case BlueBall.Level.PHASE_ENDED:
        this.toDestroy = true;
        break;

    }

};