const express= require('express');
const dotenv=require('dotenv').config();
const mongoose = require('mongoose');
const Article=require('./models/article');
const articleRoute=require('./routes/articles');
const methodOverride = require('method-override');

const app=express();
const port=process.env.PORT||5000;

mongoose.connect(process.env.DATABASE_URL);
const db=mongoose.connection;
db.once("open",()=>console.log("Connected to DB"));
db.on("error",(e)=>console.log("Error in connection"));

app.set('view engine','ejs');

//able to get value from forms in html(ejs)
app.use(express.urlencoded({extended:false}));

//to use delete and put by overriding post with same endpoint
app.use(methodOverride('_method'));

app.get('/', async (req,res)=>{
    const article= await Article.find().sort({createdAt:-1});
    res.render("articles/index",{articles:article});
});

app.use('/articles',articleRoute);

app.listen(port,()=>{
    console.log(`Server started at port:${port}`);
});