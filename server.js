const express= require('express');
const mongoose = require('mongoose');
const Article=require('./models/article');
const articleRoute=require('./routes/articles');
const methodOverride = require('method-override');
const path=require('path');
const app=express();

//Getting from .env file : port number and database url
const dotenv=require('dotenv').config();
const PORT=process.env.PORT||5000;
const DATABASE_URL=process.env.DATABASE_URL;

mongoose.connect(DATABASE_URL);
const db=mongoose.connection;
db.once("open",()=>console.log("Connected to DB"));
db.on("error",(e)=>console.log("Error in connection"));

app.set('view engine','ejs');

//for req to be able to access value from forms in html(ejs)
app.use(express.urlencoded({extended:false}));

//to use delete and put by overriding post with same endpoint
app.use(methodOverride('_method'));

// -- for defining static files like css, images which will be used by all ejs files
// app.use(express.static(path.join(__dirname,'public')));
//console.log(__dirname);

app.use(express.static('./public'));

//starting point/home page when code starts: index.ejs
app.get('/', async (req,res)=>{
    const article= await Article.find().sort({createdAt:-1});
    res.render("articles/index",{articles:article});
});

app.use('/articles',articleRoute);

app.listen(PORT,()=>{
    console.log(`Server started at port:${PORT}`);
});
