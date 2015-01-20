/*global Phaser, BlueBall */

BlueBall.Egg = function (target) {

    BlueBall.Mobile.call(this, target.game, target.cellPosition.x, target.cellPosition.y, 'eggSprites', 2);

    this.frameName = 'eggNormal';

    this.scale.set(32 / 16);

    this.gid = 100;

    this.level.onPhaseChanged.add(this.phaseChanged, this);

    this.collideIndexes.push(29, 30, 69, 81, 93, 97, 100, 117);

    this.level.entities.add(this);

    this.target = target;

    target.kill();

    this.event = this.game.time.events.add(Phaser.Timer.SECOND * 5, this.breakEgg, this);
};

BlueBall.Egg.prototype = Object.create(BlueBall.Mobile.prototype);

BlueBall.Egg.prototype.breakEgg = function () {

    this.frameName = 'eggBroken';

    this.event = this.game.time.events.add(Phaser.Timer.SECOND * 2, this.open, this);

};

BlueBall.Egg.prototype.open = function () {

    this.event = null;

    this.target.setPosition(this.cellPosition.x, this.cellPosition.y);

    this.target.revive();

    this.destroy(true);

};

BlueBall.Egg.prototype.fired = function (projectile) {

    if (projectile instanceof BlueBall.ProjectileEgg) {

        this.game.time.events.remove(this.event);

        this.event = this.game.time.events.add(Phaser.Timer.SECOND * 8, this.respawn, this);
        this.kill();

    }

};

BlueBall.Egg.prototype.respawn = function () {

    this.event = null;
    this.target.respawn();
    this.destroy();

};

BlueBall.Egg.prototype.destroy = function () {

    this.level.onPhaseChanged.remove(this.phaseChanged, this);
    this.game.time.events.remove(this.event);
    this.event = null;

    BlueBall.Mobile.prototype.destroy.apply(this, arguments);

};

BlueBall.Egg.prototype.phaseChanged = function () {

    switch (this.level.phase) {

    case BlueBall.Level.PHASE_EXITS:
        this.toDestroy = true;
        break;

    }

};