const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const jwt = require('jsonwebtoken');

require('dotenv').config()

const port = process.env.PORT || 5000;
const app = express()

//middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uuzniqz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyToken(req, res, next) {

    const header = req.headers.authorization;
    if (!header) {
        return res.status(401).send('UnAuthorized access');
    }
    const token = header.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' })
        }
        req.decoded = decoded;
        next();
    })

}
async function run() {
    try {
        const usersCollection = client.db('laptopMarket').collection('users')
        const categoriesCollection = client.db('laptopMarket').collection('categories')
        const productsCollection = client.db('laptopMarket').collection('productData')
        const bookingsCollection = client.db('laptopMarket').collection('bookings')

        //Admin verify
        const adminVerify = async (req, res, next) => {
            const decodedEmail = req.decoded.email;
            console.log(decodedEmail);
            const query = { email: decodedEmail };
            const user = await usersCollection.findOne(query);

            if (user?.role !== "admin") {
                return res.status(403).send({ message: 'forbidden access' });
            }
            next();
        }
        // admin access
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === "admin" });
        })

        //seller access
        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isSeller: user?.role === "seller" })
        })

        //get all category data
        app.get('/category', async (req, res) => {
            const query = {}
            const category = await categoriesCollection.find(query).toArray();
            res.send(category)
        })

        app.get('/category/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const category = await categoriesCollection.findOne(query)
            res.send(category)
        })

        //all product data
        app.get('/allProducts', verifyToken, async (req, res) => {
            const email = req.query.email;
            const decodedEmail = req.decoded.email;
            if (email !== decodedEmail) {
                return res.status(403).send({ message: 'forbidden access' });
            }
            const brand_name = req.query.brand_name;
            console.log(brand_name)
            const query = {
                brand_name: brand_name,
                // sold: false
            }
            const category = await productsCollection.find(query).toArray()
            res.send(category)
        })

        //get the user add data
        app.get('/myProduct', verifyToken, async (req, res) => {
            const email = req.query.email;
            const decodedEmail = req.decoded.email;
            if (email !== decodedEmail) {
                return res.status(403).send({ message: 'forbidden access' });
            }
            const query = { userEmail: email }
            const result = await productsCollection.find(query).toArray();
            res.send(result)
        })


        // get all seller
        app.get('/seller', verifyToken, async (req, res) => {
            const email = req.query.email;
            const decodedEmail = req.decoded.email;
            if (email !== decodedEmail) {
                return res.status(403).send({ message: 'forbidden access' });
            }
            const query = { role: "seller" }
            const seller = await usersCollection.find(query).toArray()
            res.send(seller)
        })

        // get all bayer 
        app.get('/bayer', verifyToken, async (req, res) => {
            const email = req.query.email;
            const decodedEmail = req.decoded.email;
            if (email !== decodedEmail) {
                return res.status(403).send({ message: 'forbidden access' });
            }
            const query = { role: "bayer" }
            const bayer = await usersCollection.find(query).toArray()
            res.send(bayer)
        })

        //all products
        app.post('/allProduct', verifyToken, async (req, res) => {
            const email = req.query.email;
            const decodedEmail = req.decoded.email;
            if (email !== decodedEmail) {
                return res.status(403).send({ message: 'forbidden access' });
            }
            const product = req.body;
            const result = await productsCollection.insertOne(product)
            res.send(result)
        })

        //users post
        app.post('/users', async (req, res) => {
            const users = req.body;
            const result = await usersCollection.insertOne(users)
            res.send(result)
        })
        //jwt token
        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            if (user) {
                const token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "8h" })
                res.send({ token })
            }
        })

        //Get the booking all data from mongoDB
        app.get('/bookingData', verifyToken, async (req, res) => {
            const email = req.query.email;
            const decodedEmail = req.decoded.email;
            if (email !== decodedEmail) {
                return res.status(403).send({ message: 'Forbidden Access' })
            }
            const query = { email: email };
            const bookingData = await bookingsCollection.find(query).toArray()
            res.send(bookingData)
        })

        //bookings data
        app.post('/bookings', verifyToken, async (req, res) => {
            const email = req.query.email;
            const decodedEmail = req.decoded.email;
            if (email !== decodedEmail) {
                return res.status(403).send({ message: "forbidden access" });
            }
            const bookings = req.body;
            const result = await bookingsCollection.insertOne(bookings)
            res.send(result)
        })

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












