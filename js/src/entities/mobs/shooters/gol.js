/*global Phaser */

var BlueBall = BlueBall || {};

BlueBall.Gol = function (game, x, y, key, frame) {

    BlueBall.Shooter.call(this, game, x, y, key, frame);

    this.frameName = 'gol1';

    this.gid = 81;

    this.destroyOnExitOpen = true;

    //this.level.onPlayerMovementEnded.add(this.lookAt, this);

    this.lookingAt = Phaser.Tilemap.SOUTH;

};

BlueBall.Gol.prototype = Object.create(BlueBall.Shooter.prototype);
BlueBall.Gol.prototype.constructor = BlueBall.Gol;

Object.defineProperty(BlueBall.Gol.prototype, "lookingAt", {

    get: function () {

        return this._lookingAt;

    },

    set: function (value) {

        this._lookingAt = value;

        switch (value) {
        case Phaser.Tilemap.NORTH:
                this.angle = 180;
            break;
        case Phaser.Tilemap.EAST:
                this.angle = -90;
            break;
        case Phaser.Tilemap.SOUTH:
                this.angle = 0;
            break;
        case Phaser.Tilemap.WEST:
                this.angle = 90;
            break;
        }

    }

});

BlueBall.Gol.prototype.awake = function () {

    this.frameName = 'gol2';

};

BlueBall.Gol.prototype.destroy = function () {

    //this.level.onPlayerMovementEnded.remove(this.lookAt, this);

    BlueBall.Entity.prototype.destroy.apply(this, arguments);

};