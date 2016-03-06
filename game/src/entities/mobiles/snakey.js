BlueBall.Snakey = function (game, x, y) {
    BlueBall.Mobile.call(this, game, x, y, 'mobSprites', 'snakey4', {
        gid: BlueBall.Global.Entities.Snakey
    });

    this.level.onPhaseChanged.add(this.phaseChanged, this);
    this.level.onPlayerMoved.add(this.lookAt, this);
};

BlueBall.Snakey.prototype = Object.create(BlueBall.Mobile.prototype);
BlueBall.Snakey.prototype.constructor = BlueBall.Snakey;

BlueBall.Snakey.prototype.lookAt = function (player) {
    var diffX = this.cellPosition.x - player.cellPosition.x;
    var diffY = this.cellPosition.y - player.cellPosition.y;

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

BlueBall.Snakey.prototype.phaseChanged = function (currentPhase) {
    switch (currentPhase) {
    case BlueBall.Level.PHASES.EXITS:
    case BlueBall.Level.PHASES.ENDED:
        this.toDestroy = true;
        break;
    }
};
