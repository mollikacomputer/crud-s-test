const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hl2eknl.mongodb.net/?retryWrites=true&w=majority`;
// const uri = process.env.DATABASE; // this is bad practice
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try {
        await client.connect();
        const serviceCollection = client.db('mollika').collection('service');
        
        app.post('/service', async(req, res)=>{
            const newService = req.body;
            console.log('adding new service', newService);
            const result = await serviceCollection.insertOne(newService);
            res.send({result: 'Success'})
        });
        // get service data
        app.get('/service', async(req, res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const service = await cursor.toArray();
            res.send(service);
        });
        // delete service data
        app.delete('/service/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        });
        

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send('Running my crud server')
});

app.listen(port, ()=>{
    console.log( `Listening to port ${port}`);
})