BlueBall.Block = function (game, x, y, key, frame) {
    BlueBall.Mobile.call(this, game, x, y, key, frame, {
        gid: BlueBall.Global.Entities.Block
    });
};

BlueBall.Block.prototype = Object.create(BlueBall.Mobile.prototype);
BlueBall.Block.prototype.constructor = BlueBall.Block;

BlueBall.Block.prototype.tilesThatCollide = BlueBall.Helper.getTileIds('Rock', 'Bush', 'Lava', 'Wall', 'Water');
