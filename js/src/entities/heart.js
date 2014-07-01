var BlueBall = BlueBall || {};

BlueBall.Heart = function (game, x, y, key, frame) {

    BlueBall.Entity.call(this, game, x, y, key, frame);

    this.frameName = 'heart';

    this.gid = 30;

};

BlueBall.Heart.prototype = Object.create(BlueBall.Entity.prototype);
BlueBall.Heart.prototype.constructor = BlueBall.Heart;

/**
 * @property {number} eggs - Cantidad de disparos que obtiene Lolo por coger el Heart
 * @static
 */
BlueBall.Heart.prototype.eggs = 0;

BlueBall.Heart.prototype.getIt = function() {

    var hearts = 0,
        chests = [],
        i,
        current;

    this.destroy(true);

    for(i = 0; i < this.entities.length; i++) {

        current = this.entities.getAt(i);

        if(current instanceof BlueBall.Heart) {

            hearts++;

        }
        else if(current instanceof BlueBall.Chest) {

            chests.push(current);

        }

    }

    if(hearts === 0){

        for(i = 0; i < chests.length; i++) {

            chests[i].open();

        }

    }
};