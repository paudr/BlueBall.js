/*global BlueBall */

BlueBall.Snakey = function (game, x, y, key, frame) {

    BlueBall.Mobile.call(this, game, x, y, key, frame);

    this.frameName = 'snakey3';

    this.gid = 97;

    this.level.onPhaseChanged.add(this.phaseChanged, this);
    this.level.onPlayerMovementEnded.add(this.lookAt, this);

};

BlueBall.Snakey.prototype = Object.create(BlueBall.Mobile.prototype);

BlueBall.Snakey.prototype.lookAt = function (player) {

    var diffX = this.cellPosition.x - player.cellPosition.x,
        diffY = this.cellPosition.y - player.cellPosition.y;

    if (diffY >= 0) {

        if (diffX >= 0) {

            this.frameName = 'snakey1';

        } else {

            this.frameName = 'snakey6';

        }
    } else if (diffX < 0) {

        if (diffX < diffY) {

            this.frameName = 'snakey5';

        } else {

            this.frameName = 'snakey4';

        }
    } else {

        if (diffX > -diffY) {

            this.frameName = 'snakey2';

        } else {

            this.frameName = 'snakey3';

        }

    }

};

BlueBall.Snakey.prototype.destroy = function () {

    this.level.onPhaseChanged.remove(this.phaseChanged, this);
    this.level.onPlayerMovementEnded.remove(this.lookAt, this);

    BlueBall.Mobile.prototype.destroy.apply(this, arguments);

};

BlueBall.Snakey.prototype.phaseChanged = function () {

    switch (this.level.phase) {

    case BlueBall.Level.PHASE_EXITS:
        this.toDestroy = true;
        break;

    }

};

BlueBall.Snakey.prototype.fired = function (projectile) {

    if (projectile instanceof BlueBall.ProjectileEgg) {

        new BlueBall.Egg(this);

    }

};