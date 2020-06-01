'use strict'; // ALWAYS


const mongoose = require('mongoose');


const fail$ = () => process.exit(-1); // eslint-disable-line no-magic-numbers
const exit$ = () => process.exit(0); // eslint-disable-line no-magic-numbers


const alert$ = console.error.bind(console, __filename); // eslint-disable-line no-console
const info$ = console.log.bind(console, __filename); // eslint-disable-line no-console


const listener$ = (
    (error, origin) => { // eslint-disable-line no-shadow
        alert$('Exception origin:', origin); // eslint-disable-line no-console
        alert$('Caught exception: ', error); // eslint-disable-line no-console
    }
);

process.on('uncaughtException', listener$);
process.on('unhandledRejection', listener$);


const connect$ = (

    async () => {

        try {
            const uri = 'mongodb://localhost:27017/mongoplay';
            const options = {useNewUrlParser: true, useUnifiedTopology: true};

            mongoose.set('debug', true);

            return await mongoose.connect(uri, options);

        } catch (e) {
            alert$('connecting error:', e);
            return void fail$();
        }

    }

);

module.exports = (async script => {

    info$('got script:', script);

    const db = await connect$();

    // info$('opened connection to db:', db);

    info$(await script({db, mongoose}));

    db.disconnect();

    // info$('done.');

    exit$();

});
