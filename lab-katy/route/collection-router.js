'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
// const createError = require('http-errors');
const debug = require('debug')('cfgram:collection-router');

const Collection = require('../model/collection.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const collectionRouter = module.exports = Router();

collectionRouter.post('/api/collection', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/collection');

  req.body.userID = req.user._id; //_id from bearer auth middleware
  new Collection(req.body).save()
    .then( collection => res.json(collection))
    .catch(next);
});

collectionRouter.get('/api/collection/:collectionId', bearerAuth, function(req, res, next) {
  debug('GET: /api/collection/:collectionId');
  
  Collection.findById(req.params.collectionId)
    .then( collection => res.json(collection))
    .catch(next);
});
