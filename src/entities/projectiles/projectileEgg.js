/*global Phaser, BlueBall */

BlueBall.ProjectileEgg = function (shooter, direction) {

    var frame = (direction === Phaser.Tilemap.NORTH || direction === Phaser.Tilemap.SOUTH) ? 0 : 1;

    BlueBall.Projectile.call(this, shooter, direction, 'eggSprites', frame);

};

BlueBall.ProjectileEgg.prototype = Object.create(BlueBall.Projectile.prototype);

BlueBall.ProjectileEgg.prototype.collideIndexes = [ 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 29, 30, 69, 73, 77, 81, 85, 89, 93, 97, 98, 99, 100, 117 ];

BlueBall.ProjectileEgg.prototype.impactIndexes = [ 69, 73, 77, 81, 85, 89, 93, 97, 98, 100 ];

BlueBall.ProjectileEgg.prototype.canMoveTo = function (direction) {

    var positions = this.cellsAt(direction),
        tile1 = this.level.map.getTile(positions[0].x >> 1, positions[0].y >> 1, 'environment', true),
        tile2 = this.level.map.getTile(positions[1].x >> 1, positions[1].y >> 1, 'environment', true),
        collide1 = false,
        collide2 = false;

    collide1 = this.collideIndexes.indexOf(tile1.index) > -1;
    collide2 = this.collideIndexes.indexOf(tile2.index) > -1;

    if (!collide1) {

        collide1 = BlueBall.Entity.getEntitiesFromIndexArray(this.collideIndexes, this.level.getEntitesAt(positions[0].x, positions[0].y)).length > 0;

    }

    if (!collide2) {

        collide2 = BlueBall.Entity.getEntitiesFromIndexArray(this.collideIndexes, this.level.getEntitesAt(positions[1].x, positions[1].y)).length > 0;

    }

    return !(collide1 && collide2);

};

BlueBall.ProjectileEgg.prototype.impact = function (target) {

    if (target instanceof BlueBall.Egg) {

        target.die();

    }
    else if (target.canBeCaptured === true) {

        new BlueBall.Egg(target);

    }

};