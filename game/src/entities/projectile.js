BlueBall.Projectile = function (shooter, direction, key, frame) {
    BlueBall.Mobile.call(this, shooter.game, shooter.cellPosition.x, shooter.cellPosition.y, key, frame);

    shooter.level.layers.add(this);

    this.movementDuration /= 2;
    this.shooter = shooter;
    this.shootDirection = direction;
};

BlueBall.Projectile.prototype = Object.create(BlueBall.Mobile.prototype);
BlueBall.Projectile.prototype.constructor = BlueBall.Projectile;

BlueBall.Projectile.prototype.tilesThatCollide = BlueBall.Helper.getTileIds('Rock', 'Wall', 'Arrow');

BlueBall.Projectile.prototype.entitiesThatCollide = BlueBall.Helper.getEntityIds('Alma', 'Block', 'DonMedusa', 'Egg', 'Gol', 'Leeper', 'Medusa', 'Player', 'Rocky', 'Skull', 'Snakey', 'DoorClosed', 'DoorOpened', 'Heart');

BlueBall.Projectile.prototype.entitiesThatImpact = BlueBall.Helper.getEntityIds('Player');

BlueBall.Projectile.prototype.moveTo = function () {
    if (!BlueBall.Mobile.prototype.moveTo.call(this, this.shootDirection)) {
        this.shooter.projectile = null;
        this.destroy(true);
        this.getImpacted().forEach(this.impact.bind(this));
    }
};

BlueBall.Projectile.prototype.nextAction = function () {
    this.moveTo();
};

BlueBall.Projectile.prototype.getImpacted = function () {
    var positions = this.cellsAt(this.shootDirection);
    return BlueBall.Helper.union(
        BlueBall.Helper.getEntitiesFromIndexArray(this.entitiesThatImpact, this.level.getEntitesAt(positions[0].x, positions[0].y)),
        BlueBall.Helper.getEntitiesFromIndexArray(this.entitiesThatImpact, this.level.getEntitesAt(positions[1].x, positions[1].y))
    );
};

BlueBall.Projectile.prototype.impact = function () {};
