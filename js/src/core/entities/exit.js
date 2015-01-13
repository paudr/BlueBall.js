/*global BlueBall */

BlueBall.Exit = function (game, x, y, key, frame) {

    BlueBall.Item.call(this, game, x, y, key, frame);

    this.frameName = 'doorClosed';

    this.gid = 18;

};

BlueBall.Exit.prototype = Object.create(BlueBall.Item.prototype);

BlueBall.Exit.prototype.open = function () {

    this.frameName = 'doorOpened';
    this.gid = 17;

};

BlueBall.Exit.prototype.onPlayerEnter = function () {

    if (this.gid === 17) {

        this.level.catchExit();

    }

};