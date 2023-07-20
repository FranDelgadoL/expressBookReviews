const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    const token = req.session.token;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    try {
        // Verify the token and extract the user information
      const decoded = jwt.verify(token, 'your_secret_key'); // Replace 'your_secret_key' with your actual secret key used for JWT signing
    
        // Attach the user information to the request for further processing in the route handlers
       req.user = decoded;
        
        // Continue to the next middleware or route handler
        next();
      } catch (err) {
        // If the token is invalid, return an error response
        return res.status(401).json({ error: 'Invalid token' });
      }
    });
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
