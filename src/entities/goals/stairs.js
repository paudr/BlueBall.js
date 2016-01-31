BlueBall.Stairs = function (game, x, y, key, frame) {
    BlueBall.Goal.call(this, game, x, y, key, frame, {
        gid: BlueBall.Global.Entities.Stairs
    });

    this.isExit = true;
    this.isOpened = false;
};

BlueBall.Stairs.prototype = Object.create(BlueBall.Goal.prototype);

Object.defineProperty(BlueBall.Stairs.prototype, 'visible', {
    get: function () {
        return this.isOpened;
    }
});

BlueBall.Stairs.prototype.open = function () {
    this.isOpened = true;
};

BlueBall.Stairs.prototype.onPlayerEnter = function () {
    if (this.isOpened) {
        this.level.catchExit();
    }
};
