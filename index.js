const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Adjust methods as needed
  credentials: true,
}));
app.use(express.json());



app.get('/', (req,res) => {
    res.send('savor every bite server is ready');
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.34gmw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    
     const foodsCollection= client.db('sevorEvreyBiteDb').collection('foods');
     const locationCollection= client.db('sevorEvreyBiteDb').collection('locetion_count');
     const partnerCollection= client.db('sevorEvreyBiteDb').collection('partner');
     const addToCartCollection= client.db('sevorEvreyBiteDb').collection('addToCart');

     app.get('/foods', async(req,res) => {
      const page =req.query.page;
      const size = req.query.size;
      console.log(page,size);
      
      const cursor = foodsCollection.find()
      const result =await cursor.limit(25).toArray();
      res.send(result);
     })

     app.get('/foodCount', async(req,res) => {
       const count =await foodsCollection.estimatedDocumentCount();
       res.send({count})
     })

    //  top selling api {}
     app.get('/topSelling', async(req,res) => {
      const cursor = foodsCollection.find()
      const result =await cursor.limit(8).toArray();
      res.send(result);
     })

    app.get('/foods/:id', async(req,res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await foodsCollection.findOne(query);
      res.send(result);
    });


  // all location api
    app.get('/location-count', async(req,res)=> {
      const cursor = locationCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    });

    // partner api 
    app.get('/partner', async(req,res) => {
      const cursor = partnerCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })


    // add to cart api 

    // add to cart get api
    app.get('/add-to-cart', async(req,res) => {
        let query = {};
        if(req.query?.email){
          query= {email : req.query.email};
        }
      const cursor = addToCartCollection.find(query)
      const result = await cursor.toArray();
      res.send(result)
    }) 

    // add to cart get api by (id)
    app.get('/add-to-cart/:id', async(req,res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await addToCartCollection.findOne(query);
      res.send(result);
    })

// add to cart post api
    app.post('/add-to-cart', async(req,res) => {
      const food = req.body;      
      const result = await addToCartCollection.insertOne(food);
      res.send(result);
    });

    // add to cart  quantity  update api
    app.put('/add-to-cart/:id', async(req,res) => {
      const id = req.params.id;
       const food = req.body;
       const filter = {_id: new ObjectId(id)};
       console.log(food);
       
       const options = { upsert: true };
       const updateFoodsData = {
        $set:{
          quantity: food.updateQuantity
        }
       }
       const result = await addToCartCollection.updateOne(filter,updateFoodsData,options);
       res.send(result)
    })

    app.delete('/add-to-cart/:id', async(req,res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await addToCartCollection.deleteOne(query);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`THis savor every bite server running PORT:${port}`);
    
})