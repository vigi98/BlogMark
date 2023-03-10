const express=require('express');
const Article=require('./../models/article');
const router=express.Router();

router.get('/new',(req,res)=>{
 res.render("articles/new",{article:new Article()});
});

router.get('/edit/:id',async(req,res)=>{
  const article=await Article.findById(req.params.id);
  res.render('articles/edit',{article:article});
});

router.get('/:slug',async(req,res)=>{
 try{
  //req.params.slug: to get id from url :slug
  //http://localhost:3000/user?name=Gourav&age=11 -> for this req.query.name
 const article= await Article.findOne({slug:req.params.slug});
 if(article==null) res.redirect('/');
 res.render('articles/show',{article:article});
 }
 catch(e){
    res.redirect('/');
 }
});

router.post('/', async (req,res)=>{
  let article= new Article({// let. if const will give error as we are reassigning it at article.save()
    title:req.body.title,
    description:req.body.description,
    markdown:req.body.markdown
  });
  try{
      article =await article.save();
      res.redirect(`/articles/${article.slug}`);
  }catch(e){
    //Issues like missing values or Slugify issue
    console.log("Issue:"+e);

     res.render('articles/new',{article:article});
  }
});

router.delete('/:id',async (req,res)=>{
 await Article.findByIdAndDelete(req.params.id);
 res.redirect('/');
});

router.put('/:id',async (req,res)=>{
  //  const 
  let article=await Article.findById(req.params.id);
   article.title=req.body.title;
   article.description=req.body.description,
   article.markdown=req.body.markdown;

  try{
   await article.save();
   res.redirect(`/articles/${article.slug}`);
  }catch(e){
    res.render('articles/edit',{article:article});
  }

});

module.exports=router;
