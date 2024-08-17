require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const PORT = process.env.PORT || 5000;
const app = express();

const API_URl = 'https://v6.exchangerate-api.com/v6'
const API_KEY = process.env.EXCHANGE_RATE_API_KEY
const apiLimiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max: 100, 
});

// cors configuration
const corsOptions = {
    origin:['http://localhost:5173']   //provide your frontend webserver link...
}



// Middlewares
app.use(express.json())   //pass incoming json data 
app.use(apiLimiter);
app.use(cors(corsOptions));

//Conversion

app.post('/api/convert', async(req, res) =>{
    //get the user data
    try {
        const {from, to, amount} = req.body;
        console.log({from, to, amount});
        
        //construct api
        const url = `${API_URl}/${API_KEY}/pair/${from}/${to}/${amount}`
        // console.log(url);
        const response = await axios.get(url);
        // console.log(response);
        if(response.data && response.data.result === 'success'){
            res.json({
                base: from,
                target: to,
                conversionRate: response.data.conversion_rate,
                convertedAmount: response.data.conversion_result,
            });
        }else{
            res.json({message:"Error converting currency", details: response.data })
        }
    } catch (error) {
        res.json({message:"Error converting currency",  details: error.message })        
    }
})

// Server 
app.listen(PORT, console.log(`Server is running on PORT ${PORT}`));
