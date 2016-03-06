BlueBall.Block = function (game, x, y) {
    BlueBall.Mobile.call(this, game, x, y, 'tileSprites', 'block', {
        gid: BlueBall.Global.Entities.Block
    });
};

BlueBall.Block.prototype = Object.create(BlueBall.Mobile.prototype);
BlueBall.Block.prototype.constructor = BlueBall.Block;

BlueBall.Block.prototype.tilesThatCollide = BlueBall.Helper.getTileIds('Rock', 'Bush', 'Lava', 'Wall', 'Water');
