var BlueBall = BlueBall || {};

BlueBall.Block = function (game, x, y, key, frame) {

    BlueBall.Mob.call(this, game, x, y, key, frame);

    this.frameName = 'block';

    this.gid = 29;

    this.collideIndexes.push(1, 2, 30, 117);

};

BlueBall.Block.prototype = Object.create(BlueBall.Mob.prototype);
BlueBall.Block.prototype.constructor = BlueBall.Block;
