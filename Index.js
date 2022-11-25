const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const jwt = require('jsonwebtoken')
require('dotenv').config()

const port = process.env.PORT || 5000;
const app = express()

//middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uuzniqz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyingToken(req, res, next) {

    const header = req.headers.authorization;
    if (!header) {
        return res.status(401).send('sorry unauthrize access');
    }
    const token = header.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded;
        next();
    })

}


async function run() {
    try {
        const usersCollection = client.db('laptopMarket').collection('users')
        const categoriesCollection = client.db('laptopMarket').collection('categories')
        const productsCollection = client.db('laptopMarket').collection('allProducts')


        //get operation
        //get all category data
        app.get('/categories', async (req, res) => {
            const query = {}
            const categories = await categoriesCollection.find(query).toArray();
            res.send(categories)
        })

        app.get('/categories/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) }
            const categories = await categoriesCollection.findOne(query)
            res.send(categories)
        })
        app.get('/allProducts', async (req, res) => {
            // const email = req.query.email;
            // const decodedEmail = req.decoded.email;
            // if (email !== decodedEmail) {
            //     return res.status(403).send({ message: 'forbidden access' });
            // }
            const brand_name = req.query.category_name;
            const query = { brand_name: brand_name }
            const category = await productsCollection.find(query).toArray()
            res.send(category)
        })

        // get all seller
        app.get('/seller', verifyingToken, async (req, res) => {
            const email = req.query.email;
            const decodedEmail = req.decoded.email;
            if (email !== decodedEmail) {
                return res.status(403).send({ message: 'forbidden access' });
            }
            const query = { role: 'seller' }
            const seller = await usersCollection.find(query).toArray()
            res.send(seller)
        })

        // get all bayer 
        app.get('/bayer', verifyingToken, async (req, res) => {
            const email = req.query.email;
            const decodedEmail = req.decoded.email;
            if (email !== decodedEmail) {
                return res.status(403).send({ message: 'forbidden access' });
            }
            const query = { role: 'bayer' }
            const bayer = await usersCollection.find(query).toArray()
            res.send(bayer)
        })

        //users post
        app.post('/users', async (req, res) => {
            const users = req.body;
            const result = await usersCollection.insertOne(users)
            res.send(result)
        })
        //jwt token
        app.post('/jwt', async (req, res) => {
            const user = req.body
            const token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "2 days" })
            res.send({ token })
        })


        //jwt token
        // app.get('/jwt',async(req,res)=>{
        //     const email=req.query.email;
        //     const query={email:email}
        //     const user=await usercollection.findOne(query)
        //     res.send(user)
        // })


        //bookings data
        // app.post('/bookings', async (req, res) => {
        //     const bookings = req.body;
        //     const result = await bookingsCollection.insertOne(bookings)
        //     res.send(result)
        // })





        //user get all data
        // app.get('/users', async (req, res) => {
        //     const query = {}
        //     const users = await usersCollection.find(query).toArray()
        //     res.send(users)
        // })




        //jwt token
        // app.get('/jwt',async(req,res)=>{
        //     const email=req.query.email;
        //     const query={email:email}
        //     const user=await usercollection.findOne(query)
        //     res.send(user)
        // })



    }
    finally {

    }
}
run().catch(err => console.error(err))

app.get('/', (req, res) => {
    res.send('used product is running')
})
app.listen(port, (req, res) => {
    console.log(`used product is running on port number ${port}`);
})












