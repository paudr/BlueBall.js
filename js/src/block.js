/*global Phaser */

var BlueBall = BlueBall || {};

BlueBall.Block = function (game, x, y, key, frame) {

    BlueBall.Entity.call(this, game, x, y, key, frame);

    this.gid = 29;

    this.collideIndexes.push(1, 2);

};

BlueBall.Block.prototype = Object.create(BlueBall.Entity.prototype);
BlueBall.Block.prototype.constructor = BlueBall.Block;
