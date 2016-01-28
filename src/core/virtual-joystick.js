BlueBall.VirtualJoystick = function (game) {
    this.game = game;

    this.pad = this.game.plugins.add(Phaser.VirtualJoystick);
    this.onShoot = new Phaser.Signal();
    this.onPower = new Phaser.Signal();
    this.onRestart = new Phaser.Signal();

    this.pad = this.game.plugins.add(Phaser.VirtualJoystick);

    this.stick = this.pad.addDPad(0, 0, 200, 'dpad');

    this.shootButton = this.pad.addButton(0, 0, 'dpad', 'button1-up', 'button1-down');
    this.shootButton.onDown.add(this.onShoot.dispatch, this.onShoot);
    this.shootButton.addKey(Phaser.Keyboard.Z);

    this.powerButton = this.pad.addButton(0, 0, 'dpad', 'button2-up', 'button2-down');
    this.powerButton.onDown.add(this.onPower.dispatch, this.onPower);
    this.powerButton.addKey(Phaser.Keyboard.X);


    this.restartButton = this.pad.addButton(0, 0, 'dpad', 'button3-up', 'button3-down');
    this.restartButton.posX = 15;
    this.restartButton.posY = 15;
    this.restartButton.scale = 0.5;

    this.restartSended = false;
    this.restartPressTime = Phaser.Timer.SECOND * 3;
}

BlueBall.VirtualJoystick.prototype = Object.create(null);

BlueBall.VirtualJoystick.prototype.getDirection = function () {
    if (this.stick.isDown) {
        switch (this.stick.direction) {
            case Phaser.UP:
                return Phaser.Tilemap.NORTH;
            case Phaser.RIGHT:
                return Phaser.Tilemap.EAST;
            case Phaser.DOWN:
                return Phaser.Tilemap.SOUTH;
            case Phaser.LEFT:
                return Phaser.Tilemap.WEST;
        }
    }
    return null;
};

BlueBall.VirtualJoystick.prototype.update = function () {
    if (this.restartButton.isDown) {
        if (!this.restartSended && this.restartButton.duration >= this.restartPressTime) {
            this.onRestart.dispatch();
            this.restartSended = true;
        }
    } else {
        this.restartSended = false;
    }
}

BlueBall.VirtualJoystick.prototype.destroy = function () {
    this.game = null;
    this.cursors = null;

    this.onShoot.dispose();
    this.onPower.dispose();
    this.onRestart.dispose();
}

BlueBall.VirtualJoystick.prototype.resize = function (width, height) {
    this.stick.alignBottomRight(0);

    this.shootButton.posX = (this.shootButton.sprite.width / 2) + 15;
    this.shootButton.posY = height - ((this.shootButton.sprite.height / 2) + 15);

    this.powerButton.posX = (this.shootButton.sprite.width / 2) + 15;
    this.powerButton.posY = height - ((this.shootButton.sprite.height * 1.5) + 30);
}
