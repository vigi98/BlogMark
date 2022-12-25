const mongoose=require('mongoose');
const slugify=require('slugify');
const marked = require('marked');
//DOMPurify sanitizes HTML and prevents XSS attacks
//we are basically creating DOM window using jsdom and purifying it using dom-purify.

const createDOMPurify = require('dompurify');
//destructuring
const { JSDOM } = require('jsdom');

// const window = new JSDOM().window;
const DOMPurify = createDOMPurify(new JSDOM().window);

const articleSchema=new mongoose.Schema({
title:{
    type:String,
    required:true
},
slug:{
    type:String,
    required:true,
    unique:true
},
description:{
    type:String
},
markdown:{
    type:String,
    required:true
},
createdAt:{
    type:Date,
    // default:()=>Date.now()
    default:Date.now
},
sanitizedHtml:{
    type:String,
    required:true
}

});

//before saving the document 'validate' is called
articleSchema.pre('validate',function(next){
    if(this.title) {
        this.slug=slugify(this.title,{lower:true,strict:true});
    }

    if(this.markdown){
        this.sanitizedHtml= DOMPurify.sanitize(marked.parse(this.markdown));
        console.log(this.sanitizedHtml);
    }
    next();
});

//Table: Article ,Schema: articleSchema
module.exports=mongoose.model("Article",articleSchema);