var BlueBall = BlueBall || {};

BlueBall.Item = function (game, x, y, key, frame) {

    BlueBall.Entity.call(this, game, x, y, key, frame);

    this.level.onPlayerMovementEnded.add(this.checkPlayerPosition, this);

};

BlueBall.Item.prototype = Object.create(BlueBall.Entity.prototype);
BlueBall.Item.prototype.constructor = BlueBall.Item;

BlueBall.Item.prototype.checkPlayerPosition = function (player) {

    if (this.cellPosition.x === player.cellPosition.x && this.cellPosition.y === player.cellPosition.y) {

        this.onPlayerEnter(player);

    }

};

BlueBall.Item.prototype.onPlayerEnter = function () {};

BlueBall.Item.prototype.destroy = function() {

    this.level.onPlayerMovementEnded.remove(this.checkPlayerPosition, this);

    BlueBall.Entity.prototype.destroy.apply(this, arguments);

};