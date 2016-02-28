BlueBall.Boot = function () {};

BlueBall.Boot.prototype = Object.create(Phaser.State.prototype);
BlueBall.Boot.prototype.constructor = BlueBall.Boot;

BlueBall.Boot.prototype.init = function () {
    this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    if (!this.game.device.desktop) {
        var sizeChanged = function () {
            this.scale.game.paused = this.scale.isPortrait;
            document.getElementById('orientation').style.display = this.scale.isPortrait ? 'block' : 'none';
        };
        this.scale.onSizeChange.add(sizeChanged, this);
        sizeChanged.call(this);
    }
}

BlueBall.Boot.prototype.preload = function () {
    this.game.load.image('loading','assets/sprites/loading.png');
};

BlueBall.Boot.prototype.create = function () {
    this.game.state.start('loader');
};
