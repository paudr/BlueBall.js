/*global Phaser, BlueBall */

BlueBall.Leeper = function (game, x, y, key, frame) {

    BlueBall.Mobile.call(this, game, x, y, key, frame, {
        gid: BlueBall.Global.Entities.Lepper
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

    this.isAwaken = false;

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

    if (this.isAwaken === true && !this.isSleeping) {

        if (this.canTouch(this.level.player) > 0) {

            this.isSleeping = true;
            this.canBeCaptured = false;
            this.animations.play('Sleep');

        }
        else {

            var directionToPlayer = BlueBall.Helper.getDirectionTo(this, this.level.player);

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

    case BlueBall.Level.PHASES.HEARTS:
        this.isAwaken = true;
        break;

    case BlueBall.Level.PHASES.EXITS:
    case BlueBall.Level.PHASES.ENDED:
        this.toDestroy = true;
        break;

    }

};
