/*global Phaser */

var BlueBall = BlueBall || {};

BlueBall.Entity = function (game, x, y, key, frame) {

    Phaser.Sprite.call(this, game, x, y, key, frame);

};

BlueBall.Entity.prototype = Object.create(Phaser.Sprite.prototype);
BlueBall.Entity.prototype.constructor = BlueBall.Entity;
