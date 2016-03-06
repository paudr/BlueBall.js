BlueBall.Heart = function (game, x, y) {
    BlueBall.Goal.call(this, game, x, y, 'tileSprites', 'heart', {
        gid: BlueBall.Global.Entities.Heart
    });

    this.isHeart = true;
    this.eggs = 0;
    this.blinkTimer = null;
};

BlueBall.Heart.prototype = Object.create(BlueBall.Goal.prototype);
BlueBall.Heart.prototype.constructor = BlueBall.Heart;

BlueBall.Heart.prototype.onPlayerEnter = function (player) {
    player.incHearts();
    player.eggs = player.eggs + this.eggs;

    this.toDestroy = true;

    if (this.blinkTimer !== null) {
        this.game.time.events.remove(this.blinkTimer);
        this.blinkTimer = null;
    }
};

BlueBall.Heart.prototype.blink = function (start) {
    if (start) {
        if (this.blinkTimer === null) {
            var colors = [0xff0000, 0xffff00, 0x00ff00, 0xffff00];
            var current = 0;

            this.blinkTimer = this.game.time.events.loop(Phaser.Timer.SECOND / 8, function () {
                this.tint = colors[current];
                current = (current + 1) % colors.length;
            }, this);
        }
    } else {
        if (this.blinkTimer !== null) {
            this.game.time.events.remove(this.blinkTimer);
            this.blinkTimer = null;
            this.tint = 0xffffff;
        }
    }
};
