var BlueBall = BlueBall || {};

BlueBall.Snakey = function (game, x, y, key, frame) {

    BlueBall.Mob.call(this, game, x, y, key, frame);

    this.frameName = 'snakey3';

    this.gid = 97;

};

BlueBall.Snakey.prototype = Object.create(BlueBall.Mob.prototype);
BlueBall.Snakey.prototype.constructor = BlueBall.Snakey;

BlueBall.Snakey.prototype.update = function () {

    var diffX = this.cellPosition.x - this.level.player.cellPosition.x,
        diffY = this.cellPosition.y - this.level.player.cellPosition.y;

    if (diffY >= 0) {

        if (diffX >= 0) {

            this.frameName = 'snakey1';

        } else {

            this.frameName = 'snakey6';

        }
    } else if (diffX < 0) {

        if (diffX < diffY) {

            this.frameName = 'snakey5';

        } else {

            this.frameName = 'snakey4';

        }
    } else {

        if (diffX > -diffY) {

            this.frameName = 'snakey2';

        } else {

            this.frameName = 'snakey3';

        }

    }

};
