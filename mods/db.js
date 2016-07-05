module.exports = function () {
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'project_approval_system'
    });

    connection.connect(function (err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        else {
            console.log('Connection created...');
//            console.log('connected as id ' + connection.threadId);
        }
    });

    return function (req, res, next) {
        req.mysql = connection;
        next();
    };
};