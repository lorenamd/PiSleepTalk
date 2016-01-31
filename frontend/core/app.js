// 
// This file is part of PiSleepTalk.
// Learn more at: https://github.com/blaues0cke/PiSleepTalk
// 
// Author:  Thomas Kekeisen <pisleeptalk@tk.ca.kekeisen.it>
// License: This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
//          To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/.
//

var   bodyParser = require('body-parser')
    , config     = require('./config.js')
	, express    = require('express')
    , fs         = require('fs')
    , i18n       = require('i18n-2')
    , path       = require('path')
;

var app = express();

i18n.expressBind(app, {
    // setup some locales - other locales default to en silently
    locales: ['en', 'de'],
    // change the cookie name from 'lang' to 'locale'
    cookieName: 'locale'
});

app.use(function(req, res, next) {
    req.i18n.setLocale(config.default_locale);
    next();
});

app.set('view engine', 'jade');
// Thanks to
// * http://stackoverflow.com/questions/25550819/error-most-middleware-like-bodyparser-is-no-longer-bundled-with-express
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

var auth = require('./auth.js');

app.use(auth);

// Thanks to
// * Michael Malura (https://github.com/blaues0cke/PiSleepTalk/issues/48)
fs.readdirSync('./routes').forEach(function(file) {
    require(path.join(__dirname, '../routes', file))(app);
});

app.listen(9888);