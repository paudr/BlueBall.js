BlueBall.DoorClosed = function (game, x, y) {
    BlueBall.Goal.call(this, game, x, y, 'tileSprites', 'doorClosed', {
        gid: BlueBall.Global.Entities.DoorClosed
    });

    this.isExit = true;
};

BlueBall.DoorClosed.prototype = Object.create(BlueBall.Goal.prototype);
BlueBall.DoorClosed.prototype.constructor = BlueBall.DoorClosed;

BlueBall.DoorClosed.prototype.open = function () {
    this.toDestroy = true;
    this.level.entities.addAt(new BlueBall.DoorOpened(this.game, this.cellPosition.x, this.cellPosition.y, 'tileSprites', 'doorOpened'), this.level.entities.getChildIndex(this.level.player), true);
    //this.level.entities.bringToTop(this.level.player);
};
