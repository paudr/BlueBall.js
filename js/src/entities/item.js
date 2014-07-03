var BlueBall = BlueBall || {};

BlueBall.Item = function (game, x, y, key, frame) {

    BlueBall.Entity.call(this, game, x, y, key, frame);

};

BlueBall.Item.prototype = Object.create(BlueBall.Entity.prototype);
BlueBall.Item.prototype.constructor = BlueBall.Item;

BlueBall.Item.prototype.onPlayerEnter = function () {};

BlueBall.Item.prototype.update = function () {

    if (this.level.player.lastPosition.x === this.cellX && this.level.player.lastPosition.y === this.cellY) {

        this.onPlayerEnter(this);

    }

};
