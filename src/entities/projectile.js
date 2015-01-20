/*global BlueBall */

BlueBall.Projectile = function (shooter, direction, key, frame) {


    BlueBall.Mobile.call(this, shooter.game, shooter.cellPosition.x, shooter.cellPosition.y, key, frame);

    shooter.level.layers.add(this);

    this.velocity *= 2;

    this.collideIndexes = [ 1, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 29 ];

    this.impactIndexes = [];

    this.shooter = shooter;

    this.shootDirection = direction;

    this.moveTo();

};

BlueBall.Projectile.prototype = Object.create(BlueBall.Mobile.prototype);

BlueBall.Mobile.prototype.getImpactingEntities = function (entities) {

    return BlueBall.Entity.getEntitiesFromIndexArray(this.impactIndexes, entities);

};

BlueBall.Projectile.prototype.moveTo = function () {

    var i, current;

    if (!BlueBall.Mobile.prototype.moveTo.call(this, this.shootDirection)) {

        var impacted = this.getImpacted();

        this.shooter.projectile = null;
        this.shooter.impact(impacted);

        this.destroy(true);

        for (i = 0; i < impacted.length; i++) {

            current = impacted[i];

            if (typeof current.fired === 'function') {
                current.fired(this);
            }

        }

    }

};

BlueBall.Projectile.prototype.canMoveTo = function (direction) {

    var positions = this.cellsAt(direction),
        tile1 = this.level.map.getTile(positions[0].x >> 1, positions[0].y >> 1, 'environment', true),
        tile2 = this.level.map.getTile(positions[1].x >> 1, positions[1].y >> 1, 'environment', true),
        collide1 = false,
        collide2 = false;

    collide1 = this.collideIndexes.indexOf(tile1.index) > -1;
    collide2 = this.collideIndexes.indexOf(tile2.index) > -1;

    if (!collide1) {

        collide1 = this.getCollidingEntities(this.level.getEntitesAt(positions[0].x, positions[0].y)).length > 0;

    }

    if (!collide2) {

        collide2 = this.getCollidingEntities(this.level.getEntitesAt(positions[1].x, positions[1].y)).length > 0;

    }

    return !(collide1 && collide2);

};

BlueBall.Projectile.prototype.onMoved = function () {

    this.moveTo();

};

BlueBall.Projectile.prototype.getImpacted = function () {

    var positions = this.cellsAt(this.shootDirection),
        entities1 = this.getImpactingEntities(this.level.getEntitesAt(positions[0].x, positions[0].y)),
        entities2;

    if (entities1.length > 0) {

         entities2 = this.getImpactingEntities(this.level.getEntitesAt(positions[1].x, positions[1].y));
     
         if (entities2.length > 0) {
             
             return BlueBall.Helper.intersection(entities1, entities2);

         }
        
    }
    
    return [];

};