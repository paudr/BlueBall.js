/*global Phaser */

var BlueBall = BlueBall || {};

BlueBall.Egg = function (target) {

    BlueBall.Mob.call(this, target.game, target.cellPosition.x, target.cellPosition.y, 'eggSprites', 2);

    this.frameName = 'eggNormal';

    this.scale.set(32 / 16);

    this.gid = 100;

    this.destroyOnExitOpen = true;

    this.collideIndexes.push(1, 2, 23, 30, 117, 97, 81);

    this.level.entities.add(this);

    this.target = target;

    target.kill();

    this.event = this.game.time.events.add(Phaser.Timer.SECOND * 5, this.break, this);
};

BlueBall.Egg.prototype = Object.create(BlueBall.Mob.prototype);
BlueBall.Egg.prototype.constructor = BlueBall.Egg;

BlueBall.Egg.prototype.break = function () {

    this.frameName = 'eggBroken';

    this.event = this.game.time.events.add(Phaser.Timer.SECOND * 2, this.open, this);

};

BlueBall.Egg.prototype.open = function () {

    this.event = null;

    this.target.setPosition(this.cellPosition.x, this.cellPosition.y);

    this.target.revive();

    this.destroy(true);

};

BlueBall.Egg.prototype.fired = function() {

    this.game.time.events.add(Phaser.Timer.SECOND * 8, this.respawn, this.target);
    this.destroy();

};

BlueBall.Egg.prototype.destroy = function () {

    this.game.time.events.remove(this.event);
    this.event = null;

    BlueBall.Entity.prototype.destroy.apply(this, arguments);

};
