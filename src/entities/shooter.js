/*global BlueBall */

BlueBall.Shooter = function (game, x, y, key, frame) {

    BlueBall.Mobile.call(this, game, x, y, key, frame);

    this.projectile = null;
    this.projectileClass = BlueBall.Projectile;

};

BlueBall.Shooter.prototype = Object.create(BlueBall.Mobile.prototype);

BlueBall.Shooter.prototype.shoot = function (direction) {

    if (this.projectile === null) {

        this.projectile = new this.projectileClass(this, direction);

        return true;

    }

    return false;

};

BlueBall.Shooter.prototype.impact = function () {};