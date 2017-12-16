import express from 'express';
import bodyParser from 'body-parser';
import oracledb from 'oracledb';
import config from '../config.json';

let app = express();

app.use(bodyParser.json({
	limit: config.bodyLimit
}));

let connAttrs = {
	"user": config.user,
	"password": config.password,
	"connectString": config.connectString
}


// Http method: POST
// URI        : /user_profiles
// Creates a new user profile
app.post('/user_profiles', function (req, res) {
    "use strict";
    if ("application/json" !== req.get('Content-Type')) {
        res.set('Content-Type', 'application/json').status(415).send(JSON.stringify({
            status: 415,
            message: "Wrong content-type. Only application/json is supported",
            detailed_message: null
        }));
        return;
    }
    oracledb.getConnection(connAttrs, function (err, connection) {
        if (err) {
            // Error connecting to DB
            res.set('Content-Type', 'application/json').status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message
            }));
            return;
        }
        connection.execute("INSERT INTO user_profiles VALUES " +
            "(:USER_NAME, :DISPLAY_NAME, :DESCRIPTION, :GENDER," +
            ":AGE, :COUNTRY, :THEME) ", [req.body.USER_NAME, req.body.DISPLAY_NAME,
                            req.body.DESCRIPTION, req.body.GENDER, req.body.AGE, req.body.COUNTRY,
                            req.body.THEME], {
                autoCommit: true,
                outFormat: oracledb.OBJECT // Return the result as Object
            },
            function (err, result) {
                if (err) {
                    // Error
                    res.set('Content-Type', 'application/json');
                    res.status(400).send(JSON.stringify({
                        status: 400,
                        message: err.message.indexOf("ORA-00001") > -1 ? "User already exists" : "Input Error",
                        detailed_message: err.message
                    }));
                } else {
                    // Successfully created the resource
                    res.status(201).set('Location', '/user_profiles/' + req.body.USER_NAME).end();
                }
                // Release the connection
                connection.release(
                    function (err) {
                        if (err) {
                            console.error(err.message);
                        } else {
                            console.log("POST /user_profiles : Connection released");
                        }
                    });
            });
    });
});