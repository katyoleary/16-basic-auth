'use strict';

const request = require('superagent');
// const mongoose = require('mongoose');
const server = require('../server.js');
const serverToggle = require('../lib/server-toggle.js');

const User = require('../model/user.js');
const Collection = require('../model/collection.js');

require('jest');

const PORT = process.env.PORT || 3001;
const url = `http://localhost:${PORT}`;

const exampleUser = {
  username: 'exampleuser',
  password: '1234',
  email: 'exampleuser@test.com',
};

const exampleCollection = {
  name: 'test collection',
  desc: 'test collection description',
};

describe('Collection Routes', function() {
  
  beforeAll( done => {
    serverToggle.serverOn(server, done);
  });

  afterAll( done => {
    serverToggle.serverOff(server, done);
  });

  afterEach( done => {
    Promise.all([
      User.remove({}),
      Collection.remove({}),
    ])
      .then( () => done())
      .catch(done);
  });

  describe('POST: /api/collection', () => {
    beforeEach( done => {
      new User(exampleUser)
        .generatePasswordHash(exampleUser.password)
        .then( user => user.save())
        .then( user => {
          this.tempUser = user;
          return user.generateToken();
        })
        .then( token => {
          this.tempToken = token;
          done();
        })
        .catch(done);
    });

    it('should return a collection', done => {
      request.post(`${url}/api/collection`)
        .send(exampleCollection)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).toEqual(200);
          expect(res.body.desc).toEqual(exampleCollection.desc);
          expect(res.body.name).toEqual(exampleCollection.name);
          expect(res.body.userID).toEqual(this.tempUser._id.toString());
          done();
        }); 
    });
  });

  describe('GET: /api/collection/:collectionId', () => {
    beforeEach( done => {
      new User(exampleUser)
        .generatePasswordHash(exampleUser.password)
        .then( user => {
          this.tempUser = user;
          return user.generateToken();
        })
        .then( token => {
          this.tempToken = token;
          done();
        })
        .catch(done);
    });

    beforeEach( done => {
      exampleCollection.userID = this.tempUser._id.toString();
      new Collection(exampleCollection).save()
        .then( collection => {
          this.tempCollection = collection;
          done();
        })
        .catch(done);
    });

    afterEach( () => {
      delete exampleCollection.userID;
    });

    it('should return a collection', done => {
      request.get(`${url}/api/collection/${this.tempCollection._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).toEqual(200);
          expect(res.body.name).toEqual(exampleCollection.name);
          expect(res.body.desc).toEqual(exampleCollection.desc);
          expect(res.body.userID).toEqual(this.tempUser._id.toString());
          done();
        });
    });
  });
});