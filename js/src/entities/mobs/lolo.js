/*global Phaser */

var BlueBall = BlueBall || {};

BlueBall.Lolo = function (game, x, y, key, frame) {

    BlueBall.Mob.call(this, game, x, y, key, frame);

    this.gid = 99;

    this.collideIndexes.push(1, 2, 97);
    this.pushIndexes.push(29);

    this.animations.add('Top', Phaser.Animation.generateFrameNames('loloUp', 0, 6, '', 1), 10, true);
    this.animations.add('Right', Phaser.Animation.generateFrameNames('loloRight', 0, 6, '', 1), 10, true);
    this.animations.add('Down', Phaser.Animation.generateFrameNames('loloDown', 0, 6, '', 1), 10, true);
    this.animations.add('Left', Phaser.Animation.generateFrameNames('loloLeft', 0, 6, '', 1), 10, true);

    this.scale.set(32 / 17);

    this.cursors = game.input.keyboard.createCursorKeys();

    this.lastPosition = {
        'x': this.cellPosition.x,
        'y': this.cellPosition.y
    };
};

BlueBall.Lolo.prototype = Object.create(BlueBall.Mob.prototype);
BlueBall.Lolo.prototype.constructor = BlueBall.Lolo;

BlueBall.Lolo.prototype.lastDirection = Phaser.Tilemap.SOUTH;
BlueBall.Lolo.prototype.lastPosition = null;

BlueBall.Lolo.prototype.onMoved = function (direction) {

    this.lastDirection = direction;

    this.lastPosition.x = this.cellPosition.x;
    this.lastPosition.y = this.cellPosition.y;

    this.checkNextMovement();

};

BlueBall.Lolo.prototype.update = function () {

    if (!this.isMoving) {

        if (this.cursors.up.isDown) {

            this.animations.play('Top');
            this.moveTo(Phaser.Tilemap.NORTH);

        } else if (this.cursors.right.isDown) {

            this.animations.play('Right');
            this.moveTo(Phaser.Tilemap.EAST);

        } else if (this.cursors.down.isDown) {

            this.animations.play('Down');
            this.moveTo(Phaser.Tilemap.SOUTH);

        } else if (this.cursors.left.isDown) {

            this.animations.play('Left');
            this.moveTo(Phaser.Tilemap.WEST);

        } else {

            this.stopAnimation(this.lastDirection);

        }

    }

    BlueBall.Mob.prototype.update.call(this);

};

BlueBall.Lolo.prototype.checkNextMovement = function () {

    var stopAnim = false;

    switch (this.lastDirection) {
    case Phaser.Tilemap.NORTH:
        if (this.cursors.up.isDown) {
            this.moveTo(Phaser.Tilemap.NORTH);
        } else {
            stopAnim = true;
        }
        break;
    case Phaser.Tilemap.EAST:
        if (this.cursors.right.isDown) {
            this.moveTo(Phaser.Tilemap.EAST);
        } else {
            stopAnim = true;
        }
        break;
    case Phaser.Tilemap.SOUTH:
        if (this.cursors.down.isDown) {
            this.moveTo(Phaser.Tilemap.SOUTH);
        } else {
            stopAnim = true;
        }
        break;
    case Phaser.Tilemap.WEST:
        if (this.cursors.left.isDown) {
            this.moveTo(Phaser.Tilemap.WEST);
        } else {
            stopAnim = true;
        }
        break;
    default:
        stopAnim = true;
    }

    if (stopAnim) {

        this.stopAnimation(this.lastDirection);

    }

};

BlueBall.Lolo.prototype.stopAnimation = function (direction) {

    this.animations.stop();

    switch (direction) {
    case Phaser.Tilemap.NORTH:
        this.frame = 0;
        break;
    case Phaser.Tilemap.EAST:
        this.frame = 5;
        break;
    case Phaser.Tilemap.SOUTH:
        this.frame = 10;
        break;
    case Phaser.Tilemap.WEST:
        this.frame = 15;
        break;
    default:
        this.frame = 10;
    }

}