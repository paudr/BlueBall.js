/*global BlueBall */

BlueBall.Goal = function (game, x, y, key, frame) {

    BlueBall.Entity.call(this, game, x, y, key, frame);

    this.level.onPlayerMovementEnded.add(this.checkPlayerPosition, this);

};

BlueBall.Goal.prototype = Object.create(BlueBall.Entity.prototype);

BlueBall.Goal.prototype.checkPlayerPosition = function (player) {

    if (this.cellPosition.x === player.cellPosition.x && this.cellPosition.y === player.cellPosition.y) {

        this.onPlayerEnter(player);

    }

};

BlueBall.Goal.prototype.onPlayerEnter = function () {};

BlueBall.Goal.prototype.destroy = function () {

    this.level.onPlayerMovementEnded.remove(this.checkPlayerPosition, this);

    BlueBall.Entity.prototype.destroy.apply(this, arguments);

};