BlueBall.Boot = function () {};

BlueBall.Boot.prototype = Object.create(Phaser.State.prototype);
BlueBall.Boot.prototype.constructor = BlueBall.Boot;

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
    } else {
        this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        this.scale.onSizeChange.add(function() {
            if (this.scale.isPortrait) {
                document.getElementById('orientation').style.display = 'block';
                if (this.game.state.current === 'boot' || this.game.state.current === 'loader') {
                    this.scale.game.paused = true;
                }
            } else {
                this.scale.game.paused = false;
                document.getElementById('orientation').style.display = 'none';
            }
        }, this);
    }
}

BlueBall.Boot.prototype.preload = function () {
    this.game.load.image('loading','assets/sprites/loading.png');
};

BlueBall.Boot.prototype.create = function () {
    this.game.state.start('loader');
};
