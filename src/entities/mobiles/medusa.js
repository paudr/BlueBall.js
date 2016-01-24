/*global BlueBall, Phaser */

BlueBall.Medusa = function (game, x, y, key, frame) {

    BlueBall.Mobile.call(this, game, x, y, key, frame, {
        gid: BlueBall.Global.Entities.Medusa
    });

    this.level.onPhaseChanged.add(this.phaseChanged, this);
    this.level.onPlayerMoved.add(this.playerMoved, this);

    this.frameName = 'medusa1';

    this.playerTargeteableAt = null;

    this.projectile = null;

};

BlueBall.Medusa.prototype = Object.create(BlueBall.Mobile.prototype);

BlueBall.Medusa.prototype.playerMoved = function (player) {

    var diffX = this.cellPosition.x - player.cellPosition.x,
        diffY = this.cellPosition.y - player.cellPosition.y;

    this.frameName = Math.abs(diffX) <= 1 || Math.abs(diffY) <= 1 ? 'medusa2' : 'medusa1';

    if (this.projectile === null) {

        this.projectile = BlueBall.ProjectileMedusa.shootTo(this, player);

    }

};

BlueBall.Medusa.prototype.destroy = function () {

    this.level.onPhaseChanged.remove(this.phaseChanged, this);
    this.level.onPlayerMoved.remove(this.playerMoved, this);

    BlueBall.Mobile.prototype.destroy.apply(this, arguments);

};

BlueBall.Medusa.prototype.phaseChanged = function (currentPhase) {

    switch (currentPhase) {

    case BlueBall.Level.PHASES.EXITS:
    case BlueBall.Level.PHASES.ENDED:
        this.toDestroy = true;
        break;

    }

};
