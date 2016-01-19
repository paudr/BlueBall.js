/*global BlueBall */

BlueBall.Block = function (game, x, y, key, frame) {

    BlueBall.Mobile.call(this, game, x, y, key, frame, {
        gid: BlueBall.Global.Entities.Block
    });

};

BlueBall.Block.prototype = Object.create(BlueBall.Mobile.prototype);
