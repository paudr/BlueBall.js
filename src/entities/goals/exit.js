/*global BlueBall */

BlueBall.Exit = function (game, x, y, key, frame) {

    BlueBall.Goal.call(this, game, x, y, key, frame, {
        gid: BlueBall.Global.Entities.DoorClosed
    });

};

BlueBall.Exit.prototype = Object.create(BlueBall.Goal.prototype);

BlueBall.Exit.prototype.open = function () {

    this.frameName = 'doorOpened';
    this.gid = BlueBall.Global.Entities.DoorOpened;

};

BlueBall.Exit.prototype.onPlayerEnter = function () {

    if (this.gid === BlueBall.Global.Entities.DoorOpened) {

        this.level.catchExit();

    }

};
