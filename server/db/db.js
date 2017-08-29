var mongoose = require('mongoose');
const uri = 'mongodb://localhost/dumall'

mongoose.Promise = global.Promise;

mongoose.connect(uri, {useMongoClient: true})
const db = mongoose.createConnection(uri)

db.once('open', ()=>{
  console.log('mongodb connection created')
})

db.on('error', ()=>{
  console.log('mongodb connection fail')
})
