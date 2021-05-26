const express = require("express");
const parser = require("body-parser");

const app = express();

app.set("port", 3000);
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.use(epxress.static(path.join(__dirname, "./public")));
app.use("lib", epxress.static(path.join(__dirname, "./node_modules")));

// Define your routes here

app.listen(app.get("port"), () => {
  console.log("Listening at localhost:" + app.get("port"));
});
