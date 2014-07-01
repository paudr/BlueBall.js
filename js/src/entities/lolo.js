/*global Phaser */

var BlueBall = BlueBall || {};

BlueBall.Lolo = function (game, x, y, key, frame) {

    BlueBall.Entity.call(this, game, x, y, key, frame);

    this.gid = 99;

    this.collideIndexes.push(1, 2);
    this.pushIndexes.push(29);

    this.animations.add('Top', Phaser.Animation.generateFrameNames('loloTop', 0, 4, '', 4), 5, true);
    this.animations.add('Right', Phaser.Animation.generateFrameNames('loloRight', 0, 4, '', 4), 5, true);
    this.animations.add('Down', Phaser.Animation.generateFrameNames('loloDown', 0, 4, '', 4), 5, true);
    this.animations.add('Left', Phaser.Animation.generateFrameNames('loloLeft', 0, 4, '', 4), 5, true);

    this.scale.set(32 / 17);

    this.cursors = game.input.keyboard.createCursorKeys();

};

BlueBall.Lolo.prototype = Object.create(BlueBall.Entity.prototype);
BlueBall.Lolo.prototype.constructor = BlueBall.Lolo;

BlueBall.Lolo.prototype.onMoved = function (direction) {

    var stopAnim = false;

    switch (direction) {
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

        this.animations.stop();
        this.frame = 10;

    }

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

            this.animations.stop();
            this.frame = 10;

        }

    }

    BlueBall.Entity.prototype.update.call(this);

};