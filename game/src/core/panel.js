BlueBall.Panel = function (game, x, y, width, height) {
    var bitmapData = game.add.bitmapData(width, height);

    bitmapData.context.fillStyle = '#000000';
    bitmapData.context.strokeStyle = '#202020';
    BlueBall.Panel.drawRoundRect(bitmapData.context, 0, 0, width, height, 10, true, true);

    Phaser.Sprite.call(this, game, x, y, bitmapData);
};

BlueBall.Panel.prototype = Object.create(Phaser.Sprite.prototype);
BlueBall.Panel.prototype.constructor = BlueBall.Entity;

BlueBall.Panel.drawRoundRect = function (context, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = {
            tl: radius,
            tr: radius,
            br: radius,
            bl: radius
        };
    } else {
        var defaultRadius = {
            tl: 0,
            tr: 0,
            br: 0,
            bl: 0
        };
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    context.beginPath();
    context.moveTo(x + radius.tl, y);
    context.lineTo(x + width - radius.tr, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    context.lineTo(x + width, y + height - radius.br);
    context.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    context.lineTo(x + radius.bl, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    context.lineTo(x, y + radius.tl);
    context.quadraticCurveTo(x, y, x + radius.tl, y);
    context.closePath();
    if (fill) {
        context.fill();
    }
    if (stroke) {
        context.stroke();
    }
}
