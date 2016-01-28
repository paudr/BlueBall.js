BlueBall.Block = function (game, x, y, key, frame) {
    BlueBall.Mobile.call(this, game, x, y, key, frame, {
        gid: BlueBall.Global.Entities.Block
    });
};

BlueBall.Block.prototype = Object.create(BlueBall.Mobile.prototype);

BlueBall.Block.prototype.tilesThatCollide = BlueBall.Helper.getTileIds('Rock', 'Bush', 'Lava', 'Wall', 'Water', 'Bridge', 'LavaBridge', 'Grass');
BlueBall.Block.prototype.tilesThatArrow = BlueBall.Helper.getTileIds('Arrow');
