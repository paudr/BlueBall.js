/*global Phaser */

var BlueBall = BlueBall || {};

BlueBall.ProjectileGol = function (shooter, direction) {

    BlueBall.Projectile.call(this, shooter, direction, 'mobSprites', 8);

    this.animations.add('anim', Phaser.Animation.generateFrameNames('projectileGol', 0, 1, '', 1), 10, true);

    switch (direction) {
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

    this.collideIndexes.push(97, 81, 99, 100);
    this.impactIndexes.push(99);

    this.animations.play('anim');

};

BlueBall.ProjectileGol.prototype = Object.create(BlueBall.Projectile.prototype);
BlueBall.ProjectileGol.prototype.constructor = BlueBall.ProjectileGol;