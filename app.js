var express=require("express"),
app=express(),
expressSan=require("express-sanitizer"),
mongoose=require("mongoose"),
method=require("method-override"),
bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSan());
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(method("_method"));
mongoose.connect("mongodb://localhost/blog");
var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});

var Blog = mongoose.model("blog",blogSchema);
app.get("/",function(req, res) {
    res.redirect("/blogs");
});
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs) {
        if(err){
            console.log("error");
        }
        else
        {
            res.render("index",{blogs:blogs});
        }
    });
   
});
app.get("/blogs/new",function(req, res) {
    res.render("new");
});
app.post("/blogs",function(req,res){
    req.body.blog.body= req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            console.log("error?");
        }
        else{
             res.redirect("/blogs");
        }
    });
   
});
app.get("/blogs/:id",function(req, res) {
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            console.log("error?");
        }
        else
        {
            res.render("show",{foundBlog:foundBlog});
        }
    });
   
});
app.get("/blogs/:id/edit",function(req, res) {
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            console.log("error?");
        }
        else
        {
            res.render("edit",{blog:foundBlog}); 
        }
    });
  
});
app.put("/blogs/:id",function(req,res){
    
    req.body.blog.body= req.sanitize(req.body.blog.body);
   Blog.findByIdAndUpdate(req.params.id, req.body.blog ,function(err,updatedBlog){
       if(err)
       {
           res.redirect("/");
       }
       else
       {
           res.redirect("/blogs/"+req.params.id);
       }
   }) 
});
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/")
        }
        else{
            res.redirect("/blogs")
        }
    })
})
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("connnt");
});