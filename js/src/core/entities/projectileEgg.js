/*global Phaser, BlueBall */

BlueBall.ProjectileEgg = function (shooter, direction) {

    var frame = (direction === Phaser.Tilemap.NORTH || direction === Phaser.Tilemap.SOUTH) ? 0 : 1;

    BlueBall.Projectile.call(this, shooter, direction, 'eggSprites', frame);

    this.collideIndexes.push(2, 69, 81, 93, 97, 100);
    this.impactIndexes.push(69, 81, 93, 97, 100);

};

BlueBall.ProjectileEgg.prototype = Object.create(BlueBall.Projectile.prototype);