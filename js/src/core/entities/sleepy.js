/*global Phaser */

var BlueBall = BlueBall || {};

BlueBall.Sleepy = function (game, x, y, key, frame) {

    BlueBall.Mobile.call(this, game, x, y, key, frame);

    this.frameName = 'sleepyDown1';

    this.gid = 69;

    this.destroyOnExitOpen = true;

    this.animations.add('Top', Phaser.Animation.generateFrameNames('sleepyUp', 1, 2, '', 1), 5, true);
    this.animations.add('Right', Phaser.Animation.generateFrameNames('sleepyRight', 1, 2, '', 1), 5, true);
    this.animations.add('Down', Phaser.Animation.generateFrameNames('sleepyDown', 1, 2, '', 1), 5, true);
    this.animations.add('Left', Phaser.Animation.generateFrameNames('sleepyLeft', 1, 2, '', 1), 5, true);
    this.animations.add('Sleep', Phaser.Animation.generateFrameNames('sleepySleep', 1, 2, '', 1), 1, true);

};

BlueBall.Sleepy.prototype = Object.create(BlueBall.Mobile.prototype);