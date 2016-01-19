/*global BlueBall */

BlueBall.Projectile = function (shooter, direction, key, frame) {


    BlueBall.Mobile.call(this, shooter.game, shooter.cellPosition.x, shooter.cellPosition.y, key, frame);

    shooter.level.layers.add(this);

    this.velocity *= 2;

    this.shooter = shooter;

    this.shootDirection = direction;

};

BlueBall.Projectile.prototype = Object.create(BlueBall.Mobile.prototype);

BlueBall.Projectile.prototype.collideIndexes = BlueBall.Helper.getTileIds('Rock', 'Wall', 'Arrow').concat(BlueBall.Helper.getEntityIds('Alma', 'Block', 'DonMedusa', 'Egg', 'Gol', 'Leper', 'Medusa', 'Player', 'Rocky', 'Skull', 'Snakey', 'Chest', 'DoorClosed', 'DoorOpened', 'Heart'));

BlueBall.Projectile.prototype.impactIndexes = BlueBall.Helper.getEntityIds('Player');;

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
        entities2 = BlueBall.Entity.getEntitiesFromIndexArray(this.impactIndexes, this.level.getEntitesAt(positions[1].x, positions[1].y));

     return BlueBall.Helper.union(entities1, entities2);

};

BlueBall.Projectile.prototype.impact = function () {};
