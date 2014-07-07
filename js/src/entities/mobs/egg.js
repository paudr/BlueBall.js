var BlueBall = BlueBall || {};

BlueBall.Egg = function (target) {

    BlueBall.Mob.call(this, target.game, target.cellPosition.x, target.cellPosition.y, 'eggSprites', 2);

    this.frameName = 'eggNormal';

    this.scale.set(32 / 16);

    this.gid = 100;

    this.destroyOnExitOpen = true;

    this.collideIndexes.push(1, 2, 23, 30, 117, 97);

    this.level.entities.add(this);

    target.kill();

};

BlueBall.Egg.prototype = Object.create(BlueBall.Mob.prototype);
BlueBall.Egg.prototype.constructor = BlueBall.Egg;
