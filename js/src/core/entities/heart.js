/*global BlueBall */

BlueBall.Heart = function (game, x, y, key, frame) {

    BlueBall.Item.call(this, game, x, y, key, frame);

    this.frameName = 'heart';

    this.gid = 30;

};

BlueBall.Heart.prototype = Object.create(BlueBall.Item.prototype);

/**
 * @property {number} eggs - Cantidad de disparos que obtiene Lolo por coger el Heart
 * @static
 */
BlueBall.Heart.prototype.eggs = 0;

BlueBall.Heart.prototype.onPlayerEnter = function (player) {

    this.level.catchHeart(this, player);

};