BlueBall.Save = {

    'saveData': function (key, data) {
        localStorage.setItem(key, data);
    },

    'loadData': function (key) {
        return localStorage.getItem(key);
    },

    'deleteData': function (key) {
        localStorage.removeItem(key);
    },

    'clear': function () {
        localStorage.clear();
    }

};
