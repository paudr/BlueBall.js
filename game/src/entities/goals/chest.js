BlueBall.Chest = function (game, x, y) {
    BlueBall.Goal.call(this, game, x, y, 'chestSprites', BlueBall.Chest.CLOSED, {
        gid: BlueBall.Global.Entities.Chest
    });

    this.isChest = true;

    this.anchor.set(0.5, 0.33);

    this.height = this.level.tileSize.height + this.level.cellSize.height;

    this.y -= this.level.cellSize.height;
};

BlueBall.Chest.prototype = Object.create(BlueBall.Goal.prototype);
BlueBall.Chest.prototype.constructor = BlueBall.Chest;

BlueBall.Chest.CLOSED = 'closed';
BlueBall.Chest.OPENED = 'opened';
BlueBall.Chest.EMPTY = 'empty';

Object.defineProperty(BlueBall.Chest.prototype, 'isEmtpyChest', {
    get: function () {
        return this.frameName === BlueBall.Chest.EMPTY;
    }
});

BlueBall.Chest.prototype.open = function () {
    this.frameName = BlueBall.Chest.OPENED;
};

BlueBall.Chest.prototype.getPearl = function () {
    this.frameName = BlueBall.Chest.EMPTY;
};

BlueBall.Chest.prototype.onPlayerEnter = function () {
    if (this.frameName === BlueBall.Chest.OPENED) {
        this.getPearl();
    }
};
