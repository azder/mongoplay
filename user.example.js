#!/usr/bin/env node

'use strict'; // ALWAYS


const log$ = console.log.bind(console, __filename); // eslint-disable-line no-console


const run$ = require('./run.util.js');


// TODO: @azder: see https://mongoosejs.com/docs/guide.html
// TODO: @azder: see https://mongoosejs.com/docs/tutorials/virtuals.html

// eslint-disable-next-line no-unused-vars
const script = async ({db, mongoose: {Schema: schema, model}}) => {

    log$('running...');

    // the definition of how the model fields will look
    const fields = {
        email:     String,
        firstName: String,
        lastName:  String,
    };

    // options can be provided during construction or set afterwards with .set() on the schema
    const options = {
        autoIndex:  false, // turn of automatic creation of indices
        timestamps: true, // automatically update `createdAt` and `updatedAt` timestamps
        collection: 'user', // use singular name
    };

    const UserSchema = schema(fields, options);

    // To have all virtuals show up in your console.log output, set the toObject option to { getters: true }:
    UserSchema.set('toObject', {getters: true});

    // Create a virtual property `domain` that's computed from `email`.
    UserSchema.virtual('domain').get(function virtualDomain() {
        return this.email.slice(this.email.indexOf('@') + 1);
    });

    UserSchema
        .virtual('fullName')
        .get(function getFullName() {
            return `${this.firstName} ${this.lastName}`;
        })
        .set(function setFullName(v) {
            // `v` is the value being set, so use the value to set `firstName` and `lastName`.
            const firstName = v.substring(0, v.indexOf(' '));
            const lastName = v.substring(v.indexOf(' ') + 1);
            this.set({firstName, lastName});
        });

    const UserModel = model('User', UserSchema);

    const doc = await UserModel.create({email: 'test@gmail.com'});
    // Vanilla JavaScript assignment triggers the setter
    doc.fullName = 'Jean-Luc Picard';

    const {fullName, lastName, firstName, domain} = doc;

    log$({
        // `domain` is now a property on User documents.
        domain, // 'gmail.com'
        fullName, // 'Jean-Luc Picard'
        firstName, // 'Jean-Luc'
        lastName, // 'Picard'
    });

    log$({doc: doc.toObject()});

};


run$(script);
