/*global BlueBall */

BlueBall.Heart = function (game, x, y, key, frame) {

    BlueBall.Goal.call(this, game, x, y, key, frame, {
        gid: 30
    });

    this.eggs = 0; // Cantidad de disparos que obtiene Player por coger el Heart

};

BlueBall.Heart.prototype = Object.create(BlueBall.Goal.prototype);

BlueBall.Heart.prototype.onPlayerEnter = function (player) {

    player.incHearts();
    player.eggs = player.eggs + this.eggs;

    this.toDestroy = true;

};
