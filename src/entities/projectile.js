/*global BlueBall */

BlueBall.Projectile = function (shooter, direction, key, frame) {


    BlueBall.Mobile.call(this, shooter.game, shooter.cellPosition.x, shooter.cellPosition.y, key, frame);

    shooter.level.layers.add(this);

    this.velocity *= 2;

    this.shooter = shooter;

    this.shootDirection = direction;

};

BlueBall.Projectile.prototype = Object.create(BlueBall.Mobile.prototype);

BlueBall.Projectile.prototype.collideIndexes = [ 1, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 29, 30, 69, 73, 77, 81, 85, 89, 93, 97, 98, 99, 100, 117 ];

BlueBall.Projectile.prototype.impactIndexes = [ 99 ];

BlueBall.Projectile.prototype.moveTo = function () {

    var i, current;

    if (!BlueBall.Mobile.prototype.moveTo.call(this, this.shootDirection)) {

        var impacted = this.getImpacted();

        this.shooter.projectile = null;

        this.destroy(true);

        for (i = 0; i < impacted.length; i++) {

            this.impact(impacted[i]);

        }

    }

};

BlueBall.Projectile.prototype.nextAction = function () {

    this.moveTo();

};

BlueBall.Projectile.prototype.getImpacted = function () {

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

BlueBall.Projectile.prototype.impact = function () {};