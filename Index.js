const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const jwt = require('jsonwebtoken')
require('dotenv').config()

const port = process.env.PORT || 5000;
const app = express()

//middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uuzniqz.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const usersCollection = client.db('laptopMarket').collection('users')
        const bookingsCollection = client.db('laptopMarket').collection('bookings')

        const productsCollection = client.db('laptopMarket').collection('products')

        //bookings data
        // app.post('/bookings', async (req, res) => {
        //     const bookings = req.body;
        //     const result = await bookingsCollection.insertOne(bookings)
        //     res.send(result)
        // })

        // //booking all data
        // app.get('/bookings', async (req, res) => {
        //   const query={}
        //     const bookings = await bookingsCollection.find(query).toArray();
        //     res.send(bookings)
        // })

        //users post
        // app.post('/users', async (req, res) => {
        //     const users = req.body;
        //     const result = await usersCollection.insertOne(users)
        //     res.send(result)
        // })

        //user get all data
        // app.get('/users', async (req, res) => {
        //     const query = {}
        //     const users = await usersCollection.find(query).toArray()
        //     res.send(users)
        // })


        // app.delete('/doctors/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const filter = { _id: ObjectId(id) }
        //     const result = await doctorsCollection.deleteOne(filter)
        //     res.send(result)
        // })
    }
    finally {

    }
}










//jwt token
// app.get('/jwt',async(req,res)=>{
//     const email=req.query.email;
//     const query={email:email}
//     const user=await usercollection.findOne(query)
//     res.send(user)
// })


app.get('/', (req, res) => {
    res.send('used product is running')
})
app.listen(port, (req, res) => {
    console.log(`used product is running on port number ${port}`);
})