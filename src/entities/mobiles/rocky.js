/*global Phaser, BlueBall */

BlueBall.Rocky = function (game, x, y, key, frame) {

    BlueBall.Mobile.call(this, game, x, y, key, frame, {
        gid: BlueBall.Global.Entities.Rocky
    });

    this.animations.add('Top', Phaser.Animation.generateFrameNames('rockyUp', 1, 5, '', 1), 5, true);
    this.animations.add('Right', Phaser.Animation.generateFrameNames('rockyRight', 1, 4, '', 1), 5, true);
    this.animations.add('Down', Phaser.Animation.generateFrameNames('rockyDown', 1, 5, '', 1), 5, true);
    this.animations.add('Left', Phaser.Animation.generateFrameNames('rockyLeft', 1, 4, '', 1), 5, true);

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
};

BlueBall.Rocky.prototype = Object.create(BlueBall.Mobile.prototype);

BlueBall.Rocky.prototype.collideIndexes = BlueBall.Helper.getTileIds('Rock', 'Bush', 'Lava', 'Wall', 'Water', 'Bridge', 'Arrow', 'LavaBridge', 'Grass').concat(BlueBall.Helper.getEntityIds('Alma', 'Block', 'DonMedusa', 'Egg', 'Gol', 'Leper', 'Medusa', 'Rocky', 'Skull', 'Snakey', 'Chest', 'DoorClosed', 'DoorOpened', 'Heart'));

BlueBall.Rocky.prototype.pushIndexes = BlueBall.Helper.getEntityIds('Player');;

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
                this.speed.x += this.runSpeed.x;
                this.speed.y += this.runSpeed.y;
            }
            else {
                this.speed.x -= this.runSpeed.x;
                this.speed.y -= this.runSpeed.y;
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
        else if (Math.abs(this.cellPosition.y - this.level.player.cellPosition.y) <= 1 && Math.abs(this.cellPosition.x - this.level.player.cellPosition.x) <= 6) {

            this.isWaiting = true;

        }

        if (this.canTouch(this.level.player)) {

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
            this.checkIfCanWaitForPlayer();
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

    if (this.isAwaken === true) {

        if (this.lastDirection === null) {

            this.lastDirection = this.lookingAt;

        }

        this.checkIfCanRunToPlayer();
        this.checkIfCanWaitForPlayer();

        this.performMovement();

    }

};

BlueBall.Rocky.prototype.destroy = function () {

    this.level.onPhaseChanged.remove(this.phaseChanged, this);

    BlueBall.Mobile.prototype.destroy.apply(this, arguments);

};

BlueBall.Rocky.prototype.respawn = function () {

    BlueBall.Mobile.prototype.respawn.apply(this, arguments);

    this.lastDirection = this.lookingAt;

};

BlueBall.Rocky.prototype.phaseChanged = function (currentPhase) {

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
