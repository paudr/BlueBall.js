BlueBall.Input = function (game) {
    this.game = game;

    this.onShoot = new Phaser.Signal();
    this.onPower = new Phaser.Signal();
    this.onRestart = new Phaser.Signal();
}

BlueBall.Input.prototype = Object.create(null);
BlueBall.Input.prototype.constructor = BlueBall.Input;

BlueBall.Input.prototype.getDirection = function () {
    return null;
};

BlueBall.Input.prototype.update = function () {};

BlueBall.Input.prototype.resize = function () {};

BlueBall.Input.prototype.destroy = function () {
    this.game = null;
    this.onShoot.dispose();
    this.onPower.dispose();
    this.onRestart.dispose();
};
