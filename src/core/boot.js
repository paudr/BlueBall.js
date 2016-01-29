BlueBall.Boot = function () {};

BlueBall.Boot.prototype = Object.create(Phaser.State.prototype);

BlueBall.Boot.prototype.init = function () {
    if (this.game.device.desktop) {
        var resizeCanvas = function () {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setMinMax(129, 137, 1032, 1096);
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
        };

        resizeCanvas.apply(this);
        window.addEventListener('resize', resizeCanvas.bind(this));
    } else if (this.game.device.android || this.game.device.iPhone) {
        this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    }

}

BlueBall.Boot.prototype.preload = function () {
    this.game.load.image('loading','assets/sprites/loading.png');
};

BlueBall.Boot.prototype.create = function () {
    this.game.state.start('loader');
};
