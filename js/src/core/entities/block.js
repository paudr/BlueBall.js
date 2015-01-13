/*global BlueBall */

BlueBall.Block = function (game, x, y, key, frame) {

    BlueBall.Mobile.call(this, game, x, y, key, frame);

    this.frameName = 'block';

    this.gid = 29;

    this.collideIndexes.push(1, 2, 23, 30, 117, 97, 81);

};

BlueBall.Block.prototype = Object.create(BlueBall.Mobile.prototype);