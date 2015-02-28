/*global BlueBall */

BlueBall.Chest = function (game, x, y, key, frame) {

    BlueBall.Goal.call(this, game, x, y, key, frame, {
        gid: 117
    });

    this.status = BlueBall.Chest.CLOSED;

    this.anchor.set(0.5, 0.33);

    this.scale.x = (2 * BlueBall.Config.cellSize.width) / 44;
    this.scale.y = (3 * BlueBall.Config.cellSize.height) / 48;

    this.y -= BlueBall.Config.cellSize.height;

};

BlueBall.Chest.prototype = Object.create(BlueBall.Goal.prototype);

BlueBall.Chest.CLOSED = 'closed';
BlueBall.Chest.OPENED = 'opened';
BlueBall.Chest.EMPTY = 'empty';

BlueBall.Chest.prototype.status = null;

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
