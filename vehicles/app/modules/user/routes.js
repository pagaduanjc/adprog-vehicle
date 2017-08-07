/**
 * We load the ExpressJS module.
 * More than just a mere framework, it is also a complementary library
 * to itself.
 */
var express = require('express');

/**
 * Having that in mind, this is one of its robust feature, the Router.
 * You'll appreciate this when we hit RESTful API programming.
 * 
 * For more info, read this: https://expressjs.com/en/4x/api.html#router
 */
var router = express.Router();

/**
 * If you can notice, there's nothing new here except we're declaring the
 * route using the router, and not using app.use().
 */
router.get('/', (req, res) => {
    /**
     * This is a TEMPORARY checker if you want to enable the database part of
     * the app or not. In the .env file, there should be an ENABLE_DATABASE field
     * there that should either be 'true' or 'false'.
     */
    if (typeof process.env.ENABLE_DATABASE !== 'undefined' && process.env.ENABLE_DATABASE === 'false') {
        /**
         * If the database part is disabled, then pass a blank array to the
         * render function.
         */
        return render([]);
    }

    /**
     * Import the database module that is located in the lib directory, under app.
     */
    var db = require('../../lib/database')();

    /**
     * If the database part is enabled, then use the database module to query
     * from the database specified in your .env file.
     */
    db.query('SELECT * FROM users', function (err, results, fields) {
        /**
         * Temporarily, if there are errors, send the error as is.
         */
        if (err) return res.send(err);

        /**
         * If there are no errors, pass the results (which is an array) to the
         * render function.
         */
        render(results);
    });

    function render(users) {
        res.render('user/views/index', { users: users });
    }
});

router.get('/new', (req, res) => {
    res.render('user/views/index');
});

router.post('/new', (req, res) => {
    var db = require('../../lib/database')();
    db.query(`INSERT INTO \`users\` (\`brand\`, \`model\`, \`yr\`, \`plate\`, \`con\`)  VALUES ("${req.body.brand}", "${req.body.model}","${req.body.yr}","${req.body.plate}","${req.body.con}")`, (err, results, fields) => {
        if (err) console.log(err);
        res.redirect('/index');
    });
});
router.get('/update', (req, res) => {
    res.render('delete/views/update');
});
router.post('/update', (req, res) => {
    var db = require('../../lib/database')();

    db.query(`UPDATE users SET yr ='${req.body.yr}' ,brand ='${req.body.brand}' ,model ='${req.body.model}' ,plate = '${req.body.plate}' , con = '${req.body.con}' WHERE id ='${req.body.id}'`, function (err, results, fields) {

        if (err) return res.send(err);

        render(results);
    });

    function render(users) {
        res.render('delete/views/update', {users:users });
    }
    res.redirect('/view');
});
router.get('/delete', (req, res) => {
    res.render('delete/views/index');
});
router.post('/delete', (req, res) => {
    var db = require('../../lib/database')();

    db.query(`DELETE FROM users WHERE id ='${req.body.id}'`, function (err, results, fields) {

        if (err) return res.send(err);

        render(results);
    });

    function render(users) {
        res.render('delete/views/index', {users:users });
    }
    res.redirect('/index');
});

/**
 * Here we just export said router on the 'index' property of this module.
 */
exports.users = router;