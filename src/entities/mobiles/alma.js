/*global Phaser, BlueBall */

BlueBall.Alma = function (game, x, y, key, frame) {

    BlueBall.Mobile.call(this, game, x, y, key, frame, {
        gid: 77
    });

    this.pushIndexes.push(99);

    this.animations.add('Walking', Phaser.Animation.generateFrameNames('alma', 1, 3, '', 1), 5, true);
    this.animations.add('Running', Phaser.Animation.generateFrameNames('almaRunning', 1, 2, '', 1), 5, true);

    this._isRunning = false; // Inicializamos el valor de la variable privada
    this._isWaiting = false; // Inicializamos el valor de la variable privada

    this.lastDirection = null;

    this.level.onPhaseChanged.add(this.phaseChanged, this);

    this.currentOptions = null;

    this.isAwaken = false;

    this.runSpeed = {
        x: this.speed.x / 2,
        y: this.speed.y / 2,
    };

    this.setAnimationNames(false);
};

BlueBall.Alma.prototype = Object.create(BlueBall.Mobile.prototype);

BlueBall.Alma.prototype.collideIndexes = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 29, 30, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 73, 77, 81, 85, 89, 93, 97, 98, 100, 117 ];

BlueBall.Alma.prototype.pushIndexes = [ 99 ];

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

            if (value) {
                this.speed.x += this.runSpeed.x;
                this.speed.y += this.runSpeed.y;
            }
            else {
                this.speed.x -= this.runSpeed.x;
                this.speed.y -= this.runSpeed.y;
            }

            this._isRunning = value;
            this.setAnimationNames(value);

        }

    }

});

Object.defineProperty(BlueBall.Alma.prototype, "isWaiting", {

    get: function () {

        return this._isWaiting;

    },

    set: function (value) {

        if (this._isWaiting !== value) {

            if (!value) {

                this.animations.stop();

            }

            this._isWaiting = value;

        }

    }

});

BlueBall.Alma.prototype.setAnimationNames = function(isRunning) {

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

    if (!this.isRunning && !this.isWaiting) {

        if (!this.canTouch(this.level.player) && this.cellPosition.y === this.level.player.cellPosition.y) {

            var direction = this.cellPosition.x > this.level.player.cellPosition.x ? Phaser.Tilemap.WEST : Phaser.Tilemap.EAST;

            if (this.canMoveTo(direction)) {

                this.lastDirection = direction;
                this.isRunning = true;

            }

        }

    }

};

BlueBall.Alma.prototype.performMovement = function(playerPosition) {

    if (this.isRunning) {

        if (!this.moveTo(this.lastDirection)) {
            this.isRunning = false;
        }

    }
    else if (!this.isWaiting) {

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
    }

};

BlueBall.Alma.prototype.nextAction = function () {

    if (this.isAwaken === true && this.alive) {

        if (this.canTouch(this.level.player) > 0) {

            this.level.player.die();

        } else {

            if (this.lastDirection === null) {

                this.lastDirection = this.lookingAt;

            }

            this.checkIfCanRunToPlayer();

            var playerPosition = BlueBall.Helper.getDirectionTo(this, this.level.player);

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

BlueBall.Alma.prototype.phaseChanged = function () {

    switch (this.level.phase) {

    case BlueBall.Level.PHASE_HEARTS:
        this.isAwaken = true;
        break;

    case BlueBall.Level.PHASE_EXITS:
    case BlueBall.Level.PHASE_ENDED:
        this.toDestroy = true;
        break;

    }

};
