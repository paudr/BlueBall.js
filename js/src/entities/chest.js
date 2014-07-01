var BlueBall = BlueBall || {};

BlueBall.Chest = function (game, x, y, key, frame) {

    BlueBall.Entity.call(this, game, x, y, key, frame);

    this.frameName = BlueBall.Chest.CLOSED;
    this.status = BlueBall.Chest.CLOSED;

    this.gid = 117;

    this.scale.x = (2 * BlueBall.Entity.cellWidth) / 44;
    this.scale.y = (3 * BlueBall.Entity.cellWidth) / 48;

    this.y -= BlueBall.Entity.cellHeight;

};

BlueBall.Chest.prototype = Object.create(BlueBall.Entity.prototype);
BlueBall.Chest.prototype.constructor = BlueBall.Chest;

BlueBall.Chest.CLOSED = 'closed';
BlueBall.Chest.OPENED = 'opened';
BlueBall.Chest.EMPTY = 'empty';

BlueBall.Chest.prototype.status = null;

BlueBall.Chest.prototype.open = function() {

    this.frameName = BlueBall.Chest.OPENED;
    this.status = BlueBall.Chest.OPENED;

};

BlueBall.Chest.prototype.getPearl = function() {

    this.frameName = BlueBall.Chest.EMPTY;
    this.status = BlueBall.Chest.EMPTY;

};