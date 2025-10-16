const express = require("express");
const app = express();
const bodyParser = require("body-parser");


app.use(express.static("public"));


app.set("view engine", "ejs");


app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

const longContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

let posts = [];
let name;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/html/index.html");
});

app.get("/login", (req, res) => {
  name = req.query.name;
  res.send(`Hello ${name}! This message arrived via GET (unsecured)`);
});


app.post("/login", (req, res) => {
  name = req.body.name;
  res.send(`Hello ${name}! This message arrived via POST (secured)`);
});

app.get("/test", (req, res) => {
  res.render("test", { userName: name });
});


app.get("/home", (req, res) => {
  if (!name) {
    res.redirect("/");
  } else {
    res.render("home", { userName: name, posts: posts });
  }
});


app.post("/post", (req, res) => {
  const post = {
    id: Date.now(),
    title: req.body.title,
    content: req.body.content
  };
  posts.push(post);
  res.redirect("/home");
});


app.get("/post/:id", (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (post) {
    res.render("post", { userName: name, post: post });
  } else {
    res.redirect("/home");
  }
});


app.post("/post/:id/edit", (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (post) {
    post.title = req.body.title;
    post.content = req.body.content;
  }
  res.redirect("/home");
});


app.post("/post/:id/delete", (req, res) => {
  posts = posts.filter(p => p.id != req.params.id);
  res.redirect("/home");
});

app.listen(3000, (err) => {
  console.log("Listening on port 3000");
});
