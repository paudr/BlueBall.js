/*global Phaser, BlueBall */

BlueBall.ProjectileEgg = function (shooter, direction) {

    var frame = (direction === Phaser.Tilemap.NORTH || direction === Phaser.Tilemap.SOUTH) ? 0 : 1;

    BlueBall.Projectile.call(this, shooter, direction, 'eggSprites', frame);

};

BlueBall.ProjectileEgg.prototype = Object.create(BlueBall.Projectile.prototype);

BlueBall.ProjectileEgg.prototype.collideIndexes = BlueBall.Helper.getTileIds('Rock', 'Bush', 'Wall', 'Arrow').concat(BlueBall.Helper.getEntityIds('Alma', 'Block', 'DonMedusa', 'Egg', 'Gol', 'Leper', 'Medusa', 'Player', 'Rocky', 'Skull', 'Snakey', 'Chest', 'DoorClosed', 'DoorOpened', 'Heart'));

BlueBall.ProjectileEgg.prototype.impactIndexes = BlueBall.Helper.getEntityIds('Alma', 'DonMedusa', 'Egg', 'Gol', 'Leper', 'Medusa', 'Player', 'Rocky', 'Skull', 'Snakey');

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

BlueBall.ProjectileEgg.prototype.getImpacted = function () {

    var positions = this.cellsAt(this.shootDirection),
        entities1 = BlueBall.Entity.getEntitiesFromIndexArray(this.impactIndexes, this.level.getEntitesAt(positions[0].x, positions[0].y)),
        entities2;

    if (entities1.length > 0) {

         entities2 = BlueBall.Entity.getEntitiesFromIndexArray(this.impactIndexes, this.level.getEntitesAt(positions[1].x, positions[1].y));

         if (entities2.length > 0) {

             return BlueBall.Helper.intersection(entities1, entities2);

         }

    }

    return [];

};

BlueBall.ProjectileEgg.prototype.impact = function (target) {

    if (target instanceof BlueBall.Egg) {

        target.die();

    }
    else if (target.canBeCaptured === true) {

        new BlueBall.Egg(target);

    }

};
