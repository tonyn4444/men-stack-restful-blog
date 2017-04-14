var bodyParser = require("body-parser"),
mongoose			 = require("mongoose"),
express				 = require("express"),
app						 = express();
methodOverride = require("method-override");

// APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
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
// 	title: "Test blog",
// 	image: "http://www.photosforclass.com/download/3600836516",
// 	body: "Hello, this is a blog post!"
// })


// RESTFUL ROUTES

app.get("/", function(req, res) {
	res.redirect("/blogs");
});

// Index Route
app.get("/blogs", function(req, res) {
	Blog.find({}, function(err, blogs) {
		if(err) {
			console.log("Error!");
		} else {
			res.render("index", {blogs: blogs});
		}
	});
});

// New Route
app.get("/blogs/new", function(req, res) {
	res.render('new');
});

// Create Route
app.post("/blogs", function(req, res) {
	// create blog
	Blog.create(req.body.blog, function(err, blog) {
		if(err) {
			res.render("new");
		} else {
			// redirect
			res.redirect("/blogs")
		}
	});
});

// Show Route
app.get("/blogs/:id", function(req, res) {
	Blog.findById(req.params.id, function(err, foundBlog) {
		if(err) {
			res.redirect("/blogs");
		} else {
			res.render('show', {blog: foundBlog});
			}		
		});
	});

// Edit Route
app.get("/blogs/:id/edit", function(req, res) {
	Blog.findById(req.params.id, function(err, foundBlog) {
		if(err) {
			res.redirect("/blogs");
		} else {
			res.render("edit", {blog: foundBlog});
		}
	});
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res) {
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
		if(err) {
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

// Delete Route
app.delete("/blogs/:id", function(req, res) {
	// destroy blog
	Blog.findByIdAndRemove(req.params.id, function(err) {
		if(err) {
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs");
		}
	});
});

var port = process.env.PORT || 3000
app.listen(port, process.env.IP, function() {
	console.log("Server is running!");
});