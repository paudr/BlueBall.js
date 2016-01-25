BlueBall.Projectile = function (shooter, direction, key, frame) {
    BlueBall.Mobile.call(this, shooter.game, shooter.cellPosition.x, shooter.cellPosition.y, key, frame);

    shooter.level.layers.add(this);

    this.movementDuration /= 2;
    this.shooter = shooter;
    this.shootDirection = direction;
};

BlueBall.Projectile.prototype = Object.create(BlueBall.Mobile.prototype);

BlueBall.Projectile.prototype.tilesThatCollide = BlueBall.Helper.getTileIds('Rock', 'Wall', 'Arrow');

BlueBall.Projectile.prototype.entitiesThatImpact = BlueBall.Helper.getEntityIds('Player');

BlueBall.Projectile.prototype.moveTo = function () {
    if (!BlueBall.Mobile.prototype.moveTo.call(this, this.shootDirection)) {
        var impacted = this.getImpacted();
        this.shooter.projectile = null;
        this.destroy(true);

        for (var i = 0; i < impacted.length; i++) {
            this.impact(impacted[i]);
        }
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
