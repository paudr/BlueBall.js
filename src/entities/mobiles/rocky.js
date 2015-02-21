/*global Phaser, BlueBall */

BlueBall.Rocky = function (game, x, y, key, frame) {

    BlueBall.Mobile.call(this, game, x, y, key, frame, {
        gid: 73
    });

    this.collideIndexes.push(29, 30, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 73, 81, 93, 97, 100, 117);
    this.pushIndexes.push(99);

    this.animations.add('Top', Phaser.Animation.generateFrameNames('rockyUp', 1, 5, '', 1), 5, true);
    this.animations.add('Right', Phaser.Animation.generateFrameNames('rockyRight', 1, 4, '', 1), 5, true);
    this.animations.add('Down', Phaser.Animation.generateFrameNames('rockyDown', 1, 5, '', 1), 5, true);
    this.animations.add('Left', Phaser.Animation.generateFrameNames('rockyLeft', 1, 4, '', 1), 5, true);

    this._isRunning = false; // Inicializamos el valor de la variable privada
    this._isWaiting = false; // Inicializamos el valor de la variable privada

    this.lastDirection = null;

    this.level.onPhaseChanged.add(this.phaseChanged, this);

    this.currentOptions = null;

};

BlueBall.Rocky.prototype = Object.create(BlueBall.Mobile.prototype);

Object.defineProperty(BlueBall.Rocky.prototype, "lookingAt", {

    get: function () {

        return this._lookingAt;

    },

    set: function (value) {

        this._lookingAt = value;
        this.lastDirection = value;

    }

});

Object.defineProperty(BlueBall.Rocky.prototype, "isRunning", {

    get: function () {

        return this._isRunning;

    },

    set: function (value) {

        if (this._isRunning !== value) {

            if (value) {
                this.speed.x *= 1.5;
                this.speed.y *= 1.5;
            }
            else {
                this.speed.x /= 1.5;
                this.speed.y /= 1.5;
            }

            this._isRunning = value;

        }

    }

});

Object.defineProperty(BlueBall.Rocky.prototype, "isWaiting", {

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

BlueBall.Rocky.prototype.checkIfCanRunToPlayer = function () {

    if (!this.isRunning && !this.isWaiting) {

        if (!this.canTouch(this.level.player) && this.cellPosition.x === this.level.player.cellPosition.x) {

            this.lastDirection = this.cellPosition.y > this.level.player.cellPosition.y ? Phaser.Tilemap.NORTH : Phaser.Tilemap.SOUTH;
            this.isRunning = true;

        }

    }

};

BlueBall.Rocky.prototype.checkIfCanWaitForPlayer = function () {

    if (!this.isRunning) {

        if (Math.abs(this.cellPosition.y - this.level.player.cellPosition.y) > 1 || Math.abs(this.cellPosition.x - this.level.player.cellPosition.x) > 6) {

            this.isWaiting = false;

        }
        else if ((Math.abs(this.cellPosition.y - this.level.player.cellPosition.y) <= 1 && Math.abs(this.cellPosition.x - this.level.player.cellPosition.x) <= 6) || this.canTouch(this.level.player)) {

            this.isWaiting = true;

        }

    }

};

BlueBall.Rocky.prototype.performMovement = function() {

    var changeDirections = [ 0, 1, 2, -1 ];
    var i;

    if (this.isRunning) {

        if (!this.moveTo(this.lastDirection)) {
            this.isRunning = false;
        }

    }
    else if (!this.isWaiting) {

        for (i = 0; i < changeDirections.length; i++) {

            this.lastDirection = this.lastDirection + changeDirections[i];

            if (this.lastDirection >= 4) {
                this.lastDirection -= 4;
            }
            else if (this.lastDirection < 0) {
                this.lastDirection += 4;
            }

            if (this.canMoveTo(this.lastDirection)) {
                break;
            }

        }

        this.moveTo(this.lastDirection);

    }

};

BlueBall.Rocky.prototype.nextAction = function () {

    if (this.lastDirection === null) {

        this.lastDirection = this.lookingAt;

    }

    this.checkIfCanRunToPlayer();
    this.checkIfCanWaitForPlayer();

    this.performMovement();

};

BlueBall.Rocky.prototype.destroy = function () {

    this.level.onPhaseChanged.remove(this.phaseChanged, this);

    BlueBall.Mobile.prototype.destroy.apply(this, arguments);

};

BlueBall.Rocky.prototype.respawn = function () {

    BlueBall.Mobile.prototype.respawn.apply(this, arguments);

    this.lastDirection = this.lookingAt;

};

BlueBall.Rocky.prototype.phaseChanged = function () {

    switch (this.level.phase) {

    case BlueBall.Level.PHASE_EXITS:
    case BlueBall.Level.PHASE_ENDED:
        this.toDestroy = true;
        break;

    }

};