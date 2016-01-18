/*global BlueBall */

BlueBall.Heart = function (game, x, y, key, frame) {

    BlueBall.Goal.call(this, game, x, y, key, frame, {
        gid: 30
    });

    this.eggs = 0; // Cantidad de disparos que obtiene Player por coger el Heart

    this.blinkTimer = null; // Timer para la animacion de parpadeo

};

BlueBall.Heart.prototype = Object.create(BlueBall.Goal.prototype);

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

            var colors = [ 0xff0000, 0xffff00, 0x00ff00, 0xffff00 ];
            var current = 0;

            this.blinkTimer = this.game.time.events.loop(Phaser.Timer.SECOND / 8, function() {

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
