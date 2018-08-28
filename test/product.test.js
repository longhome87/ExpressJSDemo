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

describe('PRODUCT', () => {
    let newProductId = 0;
    describe('/ADD product', () => {
        it('it should add new product success', (done) => {
            chai.request(server)
                .post(API.PRODUCTS)
                .field('txtName', 'Product Test')
                .field('txtCost', 1000)
                .field('txtQty', 1)
                .field('txtPrice', 1000)
                .attach('txtImage', './test/images/example-product.png', 'example-product.png')
                .end((err, res) => {
                    if (err) { done(err); }

                    res.should.have.status(201);
                    res.body.should.have.property('name', 'Product Test');
                    newProductId = res.body.id;
                    done();
                });
        });
        it('it should return 400 error for given missing image', (done) => {
            chai.request(server)
                .post(API.PRODUCTS)
                .field('txtName', 'Product Test')
                .field('txtCost', 1000)
                .field('txtQty', 1)
                .field('txtPrice', 1000)
                .end((err, res) => {
                    if (err) { done(err); }

                    res.should.have.status(400);
                    done();
                });
        });
    });

    describe('/GET product by id', () => {
        it('it should get product success for given existing id', (done) => {
            chai.request(server)
                .get(API.PRODUCTS + '/' + newProductId)
                .end((err, res) => {
                    if (err) { done(err); }

                    res.should.have.status(200);
                    res.body.should.have.property('id', newProductId);
                    done();
                });
        });
        it('it should return 404 error for given NOT existing id', (done) => {
            chai.request(server)
                .get(API.PRODUCTS + '/0')
                .end((err, res) => {
                    if (err) { done(err); }

                    res.should.have.status(404);
                    done();
                });
        });
    });

    describe('/GET products', () => {
        it('it should get all the products', (done) => {
            chai.request(server)
                .get(API.PRODUCTS)
                .end((err, res) => {
                    if (err) { done(err); }

                    res.should.have.status(200);
                    res.body.should.not.have.lengthOf(0);
                    done();
                });
        });
    });

    describe('/UPDATE product', () => {
        it('it should return update success for given existing id', (done) => {
            chai.request(server)
                .put(API.PRODUCTS + '/' + newProductId)
                .field('txtName', 'Product Test Update')
                .end((err, res) => {
                    if (err) { done(err); }

                    res.should.have.status(200);
                    res.body.should.have.property('name', 'Product Test Update');
                    res.body.id.should.equal(newProductId);
                    done();
                });
        });

        it('it should return 500 error for given NOT existing id', (done) => {
            chai.request(server)
                .put(API.PRODUCTS + '/0')
                .field('txtName', 'Product Test Update')
                .end((err, res) => {
                    if (err) { done(err); }

                    res.should.have.status(500);
                    done();
                });
        });
    });

    describe('/DELETE product by id', () => {
        it('it should delete success for given existing id', (done) => {
            chai.request(server)
                .del(API.PRODUCTS + '/' + newProductId)
                .end((err, res) => {
                    if (err) { done(err); }

                    res.should.have.status(200);
                    done();
                });
        });
        it('it should return 500 err for given NOT existing id', (done) => {
            chai.request(server)
                .del(API.PRODUCTS + '/' + newProductId)
                .end((err, res) => {
                    if (err) { done(err); }

                    res.should.have.status(500);
                    done();
                });
        });
    });
});
