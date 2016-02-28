BlueBall.Menu = function () {
};

BlueBall.Menu.prototype = Object.create(Phaser.State.prototype);
BlueBall.Menu.prototype.constructor = BlueBall.Menu;

BlueBall.Menu.prototype.preload = function () {
};

BlueBall.Menu.prototype.create = function () {

    this.title = this.add.sprite(0, 0, 'menu_title');
    this.title.anchor = { x: 0.5, y: 0.5 };

    this.start = this.add.button(0, 0, 'menu_start', this.callStart, this);
    this.start.anchor = { x: 0.5, y: 0.5 };

    this.continue = this.add.button(0, 0, 'menu_continue', this.callContinue, this);
    this.continue.anchor = { x: 0.5, y: 0.5 };

    this.erease = this.add.button(0, 0, 'menu_erease', this.callErease, this);
    this.erease.anchor = { x: 0.5, y: 0.5 };

    if (!BlueBall.Save.loadData('currentLevel')) {
        this.continue.visible = false;
        this.erease.visible = false;
    }

    this.resize(this.game.width, this.game.height);
    //this.game.state.start(BlueBall.Config.firstLevel);
};

BlueBall.Menu.prototype.shutdown = function () {
};

BlueBall.Menu.prototype.update = function () {
};

BlueBall.Menu.prototype.resize = function (width, height) {
    var scale = width / (this.title.width + 50 + 50);
    var midWidth =  width / 2;
    var offsetStart = 600;
    var offsetContinue = 400;
    var offsetErease = 200;

    if (height < 1000) {
        offsetStart = 300;
        offsetContinue = 200;
        offsetErease = 100;
    }

    this.title.scale = { x: scale, y: scale };
    this.title.x = midWidth;
    this.title.y = 50;

    scale = width / (this.start.width + 50 + 50);

    this.start.scale = { x: scale, y: scale };
    this.start.x = midWidth;
    this.start.y = height - offsetStart;

    this.continue.scale = { x: scale, y: scale };
    this.continue.x = midWidth;
    this.continue.y = height - offsetContinue;

    this.erease.scale = { x: scale, y: scale };
    this.erease.x = midWidth;
    this.erease.y = height - offsetErease;
};

BlueBall.Menu.prototype.callStart = function() {
    this.game.state.start(BlueBall.Config.world.firstLevel);
}

BlueBall.Menu.prototype.callContinue = function() {
    this.game.state.start(BlueBall.Save.loadData('currentLevel'));
}

BlueBall.Menu.prototype.callErease = function() {
    BlueBall.Save.deleteData('currentLevel')
    this.continue.visible = false;
    this.erease.visible = false;
}
