/*global BlueBall */

BlueBall.Block = function (game, x, y, key, frame) {

    BlueBall.Mobile.call(this, game, x, y, key, frame, {
        gid: 29
    });

};

BlueBall.Block.prototype = Object.create(BlueBall.Mobile.prototype);

BlueBall.Block.prototype.collideIndexes = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 29, 30, 69, 73, 77, 81, 85, 89, 93, 97, 98, 99, 100, 117 ];
