/*exported BlueBall */

var BlueBall = {

    'intersection': function (array1, array2) {

        var result = [],
            i,
            length,
            item;

        for (i = 0, length = array1.length; i < length; i++) {

            item = array1[i];

            if (array2.indexOf(item) > -1) {

                result.push(item);

            }

        }

        return result;

    }

};