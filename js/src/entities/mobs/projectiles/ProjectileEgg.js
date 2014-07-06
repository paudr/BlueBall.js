var BlueBall = BlueBall || {};

BlueBall.ProjectileEgg = function (shooter, direction) {

    BlueBall.Projectile.call(this, shooter, direction);

    this.collideIndexes.push(97);
    this.impactIndexes.push(97);

};

BlueBall.ProjectileEgg.prototype = Object.create(BlueBall.Projectile.prototype);
BlueBall.ProjectileEgg.prototype.constructor = BlueBall.ProjectileEgg;
