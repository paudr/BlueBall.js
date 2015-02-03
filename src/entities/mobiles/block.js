/*global BlueBall */

BlueBall.Block = function (game, x, y, key, frame) {

    BlueBall.Mobile.call(this, game, x, y, key, frame);

    this.frameName = 'block';

    this.gid = 29;

    this.collideIndexes.push(29, 30, 69, 81, 93, 97, 100, 117);

};

BlueBall.Block.prototype = Object.create(BlueBall.Mobile.prototype);