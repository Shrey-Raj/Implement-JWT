const mongoose = require("mongoose");
const express = require("express");
const app = express();
const hbs = require("hbs");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');

app.use(cookieParser());


app.use(express.json());

// Use the body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require("./db/conn.js");
const AllUser = require("./models/registers");

app.set("view engine", "hbs");
app.set("views", "../template/views");
hbs.registerPartials("../template/partials");


const JWT_SECRET = 'process.env.JWT_SECRET.123456789123456789shreyraj' ; 
// Page 1: Authentication
app.get('/', (req, res) => {
  const token = req.cookies.token;
  
  if (!token) {
    res.render('index');
  } else {
    try {
      const decoded = jwt.verify(token,JWT_SECRET);
      res.redirect('/welcome');
    } catch (error) {
      res.clearCookie('token');
      res.redirect('/');
    }
  }
});

app.get('/signup' , async(req,res)=>{

  const token = req.cookies.token;
  
  if (!token) {
    res.render('signup');
  } else {
    try {
      const decoded = jwt.verify(token,JWT_SECRET);
      res.redirect('/welcome');
    } catch (error) {
      res.clearCookie('token');
      res.redirect('/');
    }
  }

});


app.post('/signup' , async(req,res)=>{
  try {
    // console.log(Object.keys(req.body)); Prints all the keys of request object

    const username = req.body.username; //req = {body:{username:00000000 , author:0000}}
    const email = req.body.useremail;
    const pass = req.body.password;
    const conpass = req.body.confirmpassword;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(pass, saltRounds);

    const emailExists = await AllUser.countDocuments({ email });

    if (emailExists > 0) {
      res.send(`<h1>This email already exists: ${email}</h1>`);
      return;
    }

    if (pass != conpass) {
      res.send(`<h1> Passwords Dont Match </h1>`);
      return;
    } else {
      const registerUser = new AllUser({
        name: `${username}`,
        email: `${email}`,
        password: `${hashedPassword}`,
      });

      const registered = await registerUser.save();
      res.render('congo' , {signup_mess : username}) ; 
    }
  }
    catch(err)
    {
      console.log(err) ; 
      res.send(err) ; 
    }
});

 
app.get('/login',async(req,res)=>{
  const token = req.cookies.token;
  
  if (!token) {
    res.render('fancylogin');
  } else {
    try {
      const decoded = jwt.verify(token,JWT_SECRET);
      res.redirect('/welcome');
    } catch (error) {
      res.clearCookie('token');
      res.redirect('/');
    }
  }


 
});

 
app.post('/login', async(req, res) => { 
  
  const useremail = req.body.useremail;
  const pass = req.body.userpassword;
 
  AllUser.findOne({ email: useremail })
  .select("password name")
  .exec(async (err, user) => {
    if (err) {
      console.log(err, "Error Here 1");
      res.status(200).send("<h1>Oops ! Some error occurred !</h1>");
      return;
    }

    if (!user) {
      console.log("User not found");
      res.status(200).send("<h1>Oops ! User not found !</h1>");
      return;
    }
    const valid_pass =  user.password ; 
    const userid =  user._id ; 
    // console.log(user) ; 
    const isMatched = await bcrypt.compare(pass, valid_pass);
 
  
  if (isMatched === true) {
    const token = jwt.sign({ userid }, JWT_SECRET, { expiresIn: '100s' });
    res.cookie('token', token, { maxAge: 60 * 60 * 1000 });
    res.redirect('/welcome');
  } 
  
 else {
    res.send('Invalid username or password');
  }
});

});

// Page 2: Welcome
app.get('/welcome', (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    res.redirect('/');
  } else {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      // res.send(`Welcome, USER ID : ${decoded.userid}`);

      AllUser.findOne({_id: decoded.userid })
      .select("name")
      .exec(async (err, user) => {
        try{
          res.render('success' , {user:user.name}) ; 
        }catch(err){
          console.log(err) ;
          res.send('Oops ! Some Error Occured ! ') ; 
        }


      }); 
       
     
    } catch (error) {
      res.clearCookie('token');
      res.redirect('/');
    }
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
