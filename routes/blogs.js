var express = require("express");
const { blogsDB } = require("../mongo");
var router = express.Router();

router.get("/hello-blogs", function (req, res) {
  res.json({ message: "hello from express" });
});

router.get("/all-blogs", async function (req, res) {
  const collection = await blogsDB().collection("fiftyblogs");
  const posts = await collection.find({}).toArray();

  res.json(collection);
});

module.exports = router;
