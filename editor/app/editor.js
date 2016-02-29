var Editor = {
    init: function () {
        new Editor.Tilemap({}, document.getElementById('tilemap'));
    },
    Helper: {
        extend: function (base) {
            Array.prototype.slice.call(arguments, 1).forEach(function (current) {
                Object.getOwnPropertyNames(current).forEach(function (name) {
                    base[name] = current[name];
                })
            });
            return base;
        }
    }
};
