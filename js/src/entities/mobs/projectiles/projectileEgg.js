/*global Phaser */

var BlueBall = BlueBall || {};

BlueBall.ProjectileEgg = function (shooter, direction) {

    var frame = (direction === Phaser.Tilemap.NORTH || direction === Phaser.Tilemap.SOUTH) ? 0 : 1;

    BlueBall.Projectile.call(this, shooter, direction, 'eggSprites', frame);

    this.collideIndexes.push(97, 81, 100);
    this.impactIndexes.push(97, 81, 100);

};

BlueBall.ProjectileEgg.prototype = Object.create(BlueBall.Projectile.prototype);
BlueBall.ProjectileEgg.prototype.constructor = BlueBall.ProjectileEgg;
