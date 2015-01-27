/*global BlueBall */

BlueBall.Heart = function (game, x, y, key, frame) {

    BlueBall.Goal.call(this, game, x, y, key, frame);

    this.frameName = 'heart';

    this.gid = 30;

};

BlueBall.Heart.prototype = Object.create(BlueBall.Goal.prototype);

/**
 * @property {number} eggs - Cantidad de disparos que obtiene Lolo por coger el Heart
 * @static
 */
BlueBall.Heart.prototype.eggs = 0;

BlueBall.Heart.prototype.onPlayerEnter = function (player) {

    player.eggs = player.eggs + this.eggs;

    this.toDestroy = true;

};