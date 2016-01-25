BlueBall.DonMedusa = function (game, x, y, key, frame) {
    BlueBall.Mobile.call(this, game, x, y, key, frame, {
        gid: BlueBall.Global.Entities.DonMedusa
    });

    this.level.onPhaseChanged.add(this.phaseChanged, this);
    this.level.onPlayerMoved.add(this.checkShoot, this);

    this.frameName = 'donmedusa1';
    this.playerTargeteableAt = null;
    this.projectile = null;
    this.lastDirection = null;
    this.isAwaken = false;
};

BlueBall.DonMedusa.prototype = Object.create(BlueBall.Mobile.prototype);

Object.defineProperty(BlueBall.DonMedusa.prototype, "lookingAt", {
    get: function () {
        return this._lookingAt;
    },
    set: function (value) {
        this._lookingAt = value;
        this.lastDirection = value;
    }
});

BlueBall.DonMedusa.prototype.checkShoot = function (player) {
    var diffX = this.cellPosition.x - player.cellPosition.x;
    var diffY = this.cellPosition.y - player.cellPosition.y;

    this.frameName = Math.abs(diffX) <= 1 || Math.abs(diffY) <= 1 ? 'donmedusa2' : 'donmedusa1';

    if (this.projectile === null) {
        this.projectile = BlueBall.ProjectileMedusa.shootTo(this, player);
    }
};

BlueBall.DonMedusa.prototype.nextAction = function () {
    if (this.isAwaken === true) {
        this.checkShoot(this.level.player);

        if (this.projectile === null && this.lastDirection !== null) {
            if (!this.moveTo(this.lastDirection)) {
                this.lastDirection = (this.lastDirection + 2) % 4;
            }
        }
    }
};

BlueBall.DonMedusa.prototype.destroy = function () {
    this.level.onPhaseChanged.remove(this.phaseChanged, this);
    this.level.onPlayerMoved.remove(this.checkShoot, this);

    BlueBall.Mobile.prototype.destroy.apply(this, arguments);
};

BlueBall.DonMedusa.prototype.phaseChanged = function (currentPhase) {
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
