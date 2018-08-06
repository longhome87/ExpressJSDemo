const UTIL = require('util');

module.exports = {
    getFullImagePath(req, imageName) {
        let imagePath = UTIL.format('%s://%s/uploads/%s', req.protocol, req.get('host'), imageName);
        return imagePath;
    },

    getSetCommand(columnList) {
        let setCommand = '';
        columnList.forEach(column => {
            if (column.value) {
                let format = column.type == 'string' ? "%s = '%s', " : "%s = %s, ";
                setCommand += UTIL.format(format, column.name, column.value);
            }
        });

        return setCommand.slice(0, -2);
    }
};