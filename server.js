const express = require('express');
const parser = require('body-parser');
const server = express();

server.use(parser.json());
server.use(express.static('client/public'));

const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017', function (err, client) {
  if (err) {
    console.error(err);
    return;
  }
  const db = client.db('star_wars');

  console.log('Connected to DB');

  const quotesCollection = db.collection('quotes');
  const ObjectID = require('mongodb').ObjectID;

  server.post('/api/quotes', function (req, res) {
    const newQuote = req.body;
    quotesCollection.save(newQuote, function (err, result) {
      if (err) {
        res.status(500);
        res.send();
      }
      res.status(201);
      res.json();
    });
  });

  server.get('/api/quotes', function (req, res) {
    quotesCollection.find().toArray(function (err, result) {
      if (err) {
        res.status(500);
        res.send();
      }
      res.json(result);
    });
  });

  server.delete('/api/quotes', function(req,res) {
    const filterObject = {};
    quotesCollection.deleteMany(filterObject, function(err, result){
      if(err) {
        res.status(500);
        res.send();
      }
      res.status(204);
      res.send();
    });
  });

  server.get('/api/quotes/:id', function(req, res){
    const objectID = ObjectID(req.params.id);
    const queryObject = {_id: objectID};
    quotesCollection.findOne(queryObject, function(err, result){
      if(err) {
        res.status(500);
        res.send();
      }
      res.send(result);
    });
  });

  server.put('/api/quotes/:id', function(req, res){
    const objectID = ObjectID(req.params.id);
    const filterObject = {_id: objectID};
    const updatedData = req.body;
    quotesCollection.update(filterObject, updatedData, function(err, result){
      if(err) {
        res.status(500);
        res.send();
      }
      res.status(204);
      res.send();
    });
  });

  server.delete('/api/quotes/:id', function(req, res){
    const objectID = ObjectID(req.params.id);
    const filterObject = {_id: objectID};
    quotesCollection.deleteOne(filterObject, function(err, result){
      if(err) {
        res.status(500);
        res.send();
      }
      res.status(204);
      res.send();
    });
  });

  server.listen(3000, function(){
    console.log("Listening on port 3000");
  });
});
