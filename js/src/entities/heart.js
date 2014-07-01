var BlueBall = BlueBall || {};

BlueBall.Heart = function (game, x, y, key, frame) {

    BlueBall.Entity.call(this, game, x, y, key, frame);

    this.gid = 30;

};

BlueBall.Heart.prototype = Object.create(BlueBall.Entity.prototype);
BlueBall.Heart.prototype.constructor = BlueBall.Heart;
