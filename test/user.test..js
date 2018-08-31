'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
const should = chai.should();

chai.use(chaiHttp);

const rootAPI = '/api';
const API = {
    PRODUCTS: rootAPI + '/products',
    USERS: rootAPI + '/users'
};

describe('USER', () => {
    let newUserId = 0;
    const NO_USER_FOUND_EMAIL = 'nouseremail@mochajs.com';
    const INVALID_EMAIL = 'testing@mochajs';
    const INVALID_PASSWORD = '12';
    const VALID_EMAIL = 'testing@mochajs.org';
    const VALID_PASSWORD = '1245678x@X';

    const ERROR_MESSAGES = {
        'NO_USER_FOUND': 'No user found.',
        'MUST_BE_AT_LEAST_3_CHARS_LONG': 'Must be at least 3 chars long.',
        'INVALID_EMAIL_FORMAT': 'Invalid email format.'
    };

    describe('/POST signup', () => {
        it('it should return message: ' + ERROR_MESSAGES.MUST_BE_AT_LEAST_3_CHARS_LONG, (done) => {
            chai.request(server)
                .post(API.USERS + '/signup')
                .field('txtEmail', VALID_EMAIL)
                .field('txtPassword', INVALID_PASSWORD)
                .end((err, res) => {
                    if (err) { done(err); }

                    res.should.have.status(200);
                    res.body.messages[0].should.equal(ERROR_MESSAGES.MUST_BE_AT_LEAST_3_CHARS_LONG);
                    done();
                });
        });
        it('it should return message: ' + ERROR_MESSAGES.INVALID_EMAIL_FORMAT, (done) => {
            chai.request(server)
                .post(API.USERS + '/signup')
                .field('txtEmail', INVALID_EMAIL)
                .field('txtPassword', VALID_PASSWORD)
                .end((err, res) => {
                    if (err) { done(err); }

                    res.should.have.status(200);
                    res.body.messages[0].should.equal(ERROR_MESSAGES.INVALID_EMAIL_FORMAT);
                    done();
                });
        });
        it('it should sign up success', (done) => {
            chai.request(server)
                .post(API.USERS + '/signup')
                .field('txtEmail', VALID_EMAIL)
                .field('txtPassword', VALID_PASSWORD)
                .end((err, res) => {
                    if (err) { done(err); }

                    res.should.have.status(200);
                    newUserId = res.body.id;
                    done();
                });
        });
    });

    describe('/POST signin', () => {
        it('it should return message: ' + ERROR_MESSAGES.NO_USER_FOUND, (done) => {
            chai.request(server)
                .post(API.USERS + '/signin')
                .field('txtEmail', NO_USER_FOUND_EMAIL)
                .field('txtPassword', VALID_PASSWORD)
                .end((err, res) => {
                    if (err) { done(err); }

                    res.should.have.status(200);
                    res.body.messages[0].should.equal(ERROR_MESSAGES.NO_USER_FOUND);
                    done();
                });
        });
        it('it should return message: ' + ERROR_MESSAGES.MUST_BE_AT_LEAST_3_CHARS_LONG, (done) => {
            chai.request(server)
                .post(API.USERS + '/signin')
                .field('txtEmail', VALID_EMAIL)
                .field('txtPassword', INVALID_PASSWORD)
                .end((err, res) => {
                    if (err) { done(err); }

                    res.should.have.status(200);
                    res.body.messages[0].should.equal(ERROR_MESSAGES.MUST_BE_AT_LEAST_3_CHARS_LONG);
                    done();
                });
        });
        it('it should return message: ' + ERROR_MESSAGES.INVALID_EMAIL_FORMAT, (done) => {
            chai.request(server)
                .post(API.USERS + '/signin')
                .field('txtEmail', INVALID_EMAIL)
                .field('txtPassword', VALID_PASSWORD)
                .end((err, res) => {
                    if (err) { done(err); }

                    res.should.have.status(200);
                    res.body.messages[0].should.equal(ERROR_MESSAGES.INVALID_EMAIL_FORMAT);
                    done();
                });
        });
        it('it should sign in success', (done) => {
            chai.request(server)
                .post(API.USERS + '/signin')
                .field('txtEmail', VALID_EMAIL)
                .field('txtPassword', VALID_PASSWORD)
                .end((err, res) => {
                    if (err) { done(err); }

                    res.should.have.status(200);
                    res.body.should.have.property('id', newUserId);
                    done();
                });
        });
    });

    describe('/GET product by id', () => {
        it('it should get user success for given existing id', (done) => {
            chai.request(server)
                .get(API.USERS + '/' + newUserId)
                .end((err, res) => {
                    if (err) { done(err); }

                    res.should.have.status(200);
                    // res.body.should.have.property('id', 0);
                    res.body.should.have.property('id', newUserId);
                    done();
                });
        });
        it('it should return 404 error for given NOT existing id', (done) => {
            chai.request(server)
                .get(API.USERS + '/0')
                .end((err, res) => {
                    if (err) { done(err); }

                    res.should.have.status(404);
                    done();
                });
        });
    });

    describe('/DELETE user by id', () => {
        it('it should delete success for given existing id', (done) => {
            chai.request(server)
                .del(API.USERS + '/' + newUserId)
                .end((err, res) => {
                    if (err) { done(err); }

                    res.should.have.status(200);
                    done();
                });
        });
        it('it should delete success for given NOT existing id', (done) => {
            chai.request(server)
                .del(API.USERS + '/' + newUserId)
                .end((err, res) => {
                    if (err) { done(err); }

                    res.should.have.status(200);
                    done();
                });
        });
    });
});
