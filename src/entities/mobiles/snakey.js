/*global BlueBall */

BlueBall.Snakey = function (game, x, y, key, frame) {

    BlueBall.Mobile.call(this, game, x, y, key, frame, {
        gid: 97
    });

    this.level.onPhaseChanged.add(this.phaseChanged, this);
    this.level.onPlayerMoved.add(this.lookAt, this);

    this.lookAt(this.level.player);
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
    this.level.onPlayerMoved.remove(this.lookAt, this);

    BlueBall.Mobile.prototype.destroy.apply(this, arguments);

};

BlueBall.Snakey.prototype.phaseChanged = function () {

    switch (this.level.phase) {

    case BlueBall.Level.PHASE_EXITS:
    case BlueBall.Level.PHASE_ENDED:
        this.toDestroy = true;
        break;

    }

};