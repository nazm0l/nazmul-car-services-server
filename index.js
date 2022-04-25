const express = require('express');
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();


//middleware
app.use(cors());
app.use(express.json());

//MongoDB


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mbq1u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
        try{
            await client.connect();
            const carCollection = client.db('nazmulCar').collection('cars');

            app.get('/cars', async(req, res) =>{
              const query = {};
              const cursor = carCollection.find(query);
              const cars = await cursor.toArray();
              res.send(cars);
            });

            app.get('/cars/:id', async(req, res) =>{
              const id = req.params.id;
              const query = {_id: ObjectId(id)};
              const cars = await carCollection.findOne(query);
              res.send(cars);
            });

            //add car

            app.post('/cars', async(req, res) =>{
              const newCar = req.body;
              const result = await carCollection.insertOne(newCar);
              res.send(result);
            });

            //delete

            app.delete('/cars/:id', async(req, res) => {
              const id = req.params.id;
              const query = {_id: ObjectId(id)};
              const result = await carCollection.deleteOne(query);
              res.send(result);
            })
        }
        finally{

        }
}

run().catch(console.dir);


//main
app.get('/',(req, res) =>{
    res.send('Running NazmulMon Server')
});

app.listen(port, () => {
    console.log('Listening port ',port);
})