BlueBall.Chest = function (game, x, y, key, frame) {
    BlueBall.Goal.call(this, game, x, y, key, frame, {
        gid: BlueBall.Global.Entities.Chest
    });

    this.isChest = true;

    this.status = BlueBall.Chest.CLOSED;

    this.anchor.set(0.5, 0.33);

    this.height = this.level.tileSize.height + this.level.cellSize.height;

    this.y -= this.level.cellSize.height;
};

BlueBall.Chest.prototype = Object.create(BlueBall.Goal.prototype);
BlueBall.Chest.prototype.constructor = BlueBall.Chest;

BlueBall.Chest.CLOSED = 'closed';
BlueBall.Chest.OPENED = 'opened';
BlueBall.Chest.EMPTY = 'empty';

BlueBall.Chest.prototype.status = null;

Object.defineProperty(BlueBall.Chest.prototype, 'isEmtpyChest', {
    get: function () {
        return this.status === BlueBall.Chest.EMPTY;
    }
});

BlueBall.Chest.prototype.open = function () {
    this.frameName = BlueBall.Chest.OPENED;
    this.status = BlueBall.Chest.OPENED;
};

BlueBall.Chest.prototype.getPearl = function () {
    this.frameName = BlueBall.Chest.EMPTY;
    this.status = BlueBall.Chest.EMPTY;
};

BlueBall.Chest.prototype.onPlayerEnter = function () {
    if (this.status === BlueBall.Chest.OPENED) {
        this.getPearl();
    }
};
