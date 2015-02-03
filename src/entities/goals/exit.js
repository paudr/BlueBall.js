/*global BlueBall */

BlueBall.Exit = function (game, x, y, key, frame) {

    BlueBall.Goal.call(this, game, x, y, key, frame, {
        gid: 15
    });

};

BlueBall.Exit.prototype = Object.create(BlueBall.Goal.prototype);

BlueBall.Exit.prototype.open = function () {

    this.frameName = 'doorOpened';
    this.gid = 16;

};

BlueBall.Exit.prototype.onPlayerEnter = function () {

    if (this.gid === 16) {

        this.level.catchExit();

    }

};