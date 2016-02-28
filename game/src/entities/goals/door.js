BlueBall.Door = function (game, x, y, key, frame) {
    BlueBall.Goal.call(this, game, x, y, key, frame, {
        gid: BlueBall.Global.Entities.DoorClosed
    });

    this.isExit = true;
};

BlueBall.Door.prototype = Object.create(BlueBall.Goal.prototype);
BlueBall.Door.prototype.constructor = BlueBall.Door;

BlueBall.Door.prototype.open = function () {
    this.frameName = 'doorOpened';
    this.gid = BlueBall.Global.Entities.DoorOpened;
};

BlueBall.Door.prototype.onPlayerEnter = function () {
    if (this.gid === BlueBall.Global.Entities.DoorOpened) {
        this.level.catchExit();
    }
};
