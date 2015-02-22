/*global Phaser, BlueBall */

BlueBall.ProjectileEgg = function (shooter, direction) {

    var frame = (direction === Phaser.Tilemap.NORTH || direction === Phaser.Tilemap.SOUTH) ? 0 : 1;

    BlueBall.Projectile.call(this, shooter, direction, 'eggSprites', frame);

    this.collideIndexes.push(2, 69, 81, 93, 97, 100);
    this.impactIndexes.push(69, 81, 93, 97, 100);

};

BlueBall.ProjectileEgg.prototype = Object.create(BlueBall.Projectile.prototype);

BlueBall.Projectile.prototype.collideIndexes = [ 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 29, 30, 69, 73, 77, 81, 85, 89, 93, 97, 98, 99, 100, 117 ];

BlueBall.Projectile.prototype.impactIndexes = [ 69, 73, 77, 81, 85, 89, 93, 97, 98, 100 ];