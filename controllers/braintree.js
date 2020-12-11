const User = require("../models/user");
const braintree = require("braintree");
require('dotenv').config();

// BRAINTREE_MERCHANT_ID=mtdf65ygd5gvgfhv
// BRAINTTREE_PUBLIC_KEY=tkq3ft3t35yd8qfw
// BRAINTREE_PRIVATE_KEY=27ed2b6954a60b093d84b1bc7ec4ac6c


const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
})


exports.generateToken = (req, res) => {
    
    gateway.clientToken.generate({}, (err, response) => {
        if(err){
            res.status(500).send(err)
        }else{
            res.send(response);
        }
    });
}

exports.processPayment = (req, res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce
    let amountFromTheClient = req.body.amount;
    // charge
   // console.log("gateway is ", gateway.transanction)
    let newTransaction = gateway.transaction.sale(
        {
            amount: amountFromTheClient,
            paymentMethodNonce: nonceFromTheClient,
            options: {
                submitForSettlement: true
            }
        }, 
        (error, result) => {
                if(error){
                    console.log(error)
                    res.status(500).json(error);
                }else{
                    res.json(result)
                }
        }
        
    )
}