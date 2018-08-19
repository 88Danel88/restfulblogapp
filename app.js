var express = require ('express'),
    methodOverride = require('method-override'),
    mongoose = require ('mongoose'),
    bodyParser = require ('body-parser'),
    app = express ();

// APP CONFIG
mongoose.connect("mongodb://localhost:27017/restful_blog_app", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
      title: String,
      image: String,
      body: String,
      created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//       title: "Test Blog 2",
//       image: "https://images.unsplash.com/photo-1505841008129-747c07f3ec41?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=e4241e9d76dd3c695c4c48b12c3a39ab&auto=format&fit=crop&w=500&q=60",
//       body: "This is 2nd test blog post"
// });

// RESTFUL ROUTES

app.get("/", function(req, res){
      res.redirect("/blogs");
})
// INDEX ROUTE
app.get("/blogs", function(req, res){
      Blog.find({}, function(err, blogs){
        if(err){
          console.log("ERROR!");
        } else {
          res.render("index", {blogs: blogs});
        }
      });
});

// NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
});

// CREATE ROUTE
app.post("/blogs", function(req, res){
  //create blog
  Blog.create(req.body.blog, function(err, newBlog){
      if(err){
        res.render("new");
      } else {
        //then, redirect to the index
        res.redirect("/blogs");
      }
  });
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
        res.render("/blogs");
    } else {
        res.render("show", {blog: foundBlog});
    }
  })
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if (err){
      res.redirect("/blogs");
    } else{
        res.render("edit", {blog: foundBlog});
    }
  });
});

//UPDATE ROUTE
app.put("/blog/:id", function(req, res){
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
    if(err){
        res.redirect("/blogs");
    } else {
        res.redirect("/blogs/" + req.params.id);
    }
  });
});

app.listen(3000, function(){
      console.log("SERVER IS UP! LISTENING AT PORT 3000")  
});
