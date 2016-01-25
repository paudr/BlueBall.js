BlueBall.Keyboard = function (game) {

    this.game = game;

    this.onShoot = new Phaser.Signal();
    this.onPower = new Phaser.Signal();
    this.onRestart = new Phaser.Signal();

    this.cursors = game.input.keyboard.createCursorKeys();

    game.input.keyboard.addKey(Phaser.Keyboard.Z).onDown.add(this.onShoot.dispatch.bind(this.onShoot));
    game.input.keyboard.addKey(Phaser.Keyboard.X).onDown.add(this.onPower.dispatch.bind(this.onPower));

    this.restartKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
    this.restartSended = false;
    this.restartPressTime = Phaser.Timer.SECOND * 3;

}

BlueBall.Keyboard.prototype = Object.create(null);

BlueBall.Keyboard.prototype.getDirection = function() {

    var direction = null;
    var directionDuration;

    if (this.cursors.up.isDown) {
        direction = Phaser.Tilemap.NORTH;
        directionDuration = this.cursors.up.duration;
    }

    if (this.cursors.right.isDown && (direction === null || this.cursors.right.duration < directionDuration)) {
        direction = Phaser.Tilemap.EAST;
        directionDuration = this.cursors.right.duration;
    }

    if (this.cursors.down.isDown && (direction === null || this.cursors.down.duration < directionDuration)) {
        direction = Phaser.Tilemap.SOUTH;
        directionDuration = this.cursors.down.duration;
    }

    if (this.cursors.left.isDown && (direction === null || this.cursors.left.duration < directionDuration)) {
        direction = Phaser.Tilemap.WEST;
        directionDuration = this.cursors.left.duration;
    }

    return direction;

};

BlueBall.Keyboard.prototype.update = function() {

    if (this.restartKey.isDown) {

        if (!this.restartSended && this.restartKey.duration >= this.restartPressTime) {

            this.onRestart.dispatch();
            this.restartSended = true;

        }

    } else {

        this.restartSended = false;

    }

}

BlueBall.Keyboard.prototype.destroy = function() {

    this.game = null;
    this.cursors = null;

    this.onShoot.dispose();
    this.onPower.dispose();
    this.onRestart.dispose();

}
