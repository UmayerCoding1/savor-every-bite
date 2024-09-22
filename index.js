const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const akib = {name: 'Akib', age: 21, Gender: 'Male'};

app.get('/', (req,res) => {
    res.send('savor every bite server is ready');
})

app.get('/akib', async(req,res) => {
    
   res.send(akib)
})

app.listen(port, () => {
    console.log(`THis savor every bite server running PORT:${port}`);
    
})