BlueBall.DoorOpened = function (game, x, y) {
    BlueBall.Goal.call(this, game, x, y, 'tileSprites', 'doorOpened', {
        gid: BlueBall.Global.Entities.DoorOpened
    });

    this.isExit = true;
};

BlueBall.DoorOpened.prototype = Object.create(BlueBall.Goal.prototype);
BlueBall.DoorOpened.prototype.constructor = BlueBall.DoorOpened;

BlueBall.DoorOpened.prototype.onPlayerEnter = function () {
    if (this.gid === BlueBall.Global.Entities.DoorOpened) {
        this.level.catchExit();
    }
};

BlueBall.DoorOpened.prototype.open = function () {};
