var express = require("express");
const { blogsDB } = require("../mongo");
var router = express.Router();

router.get("/hello-blogs", function (req, res) {
  res.json({ message: "hello from express" });
});

router.get("/all-blogs", async function (req, res) {
  try {
    const collection = await blogsDB().collection("fiftyblogs");
    const posts = await collection.find({}).toArray();
    // console.log(posts);
    res.send({ message: posts });
  } catch (e) {
    res.status(500).send("Error getting posts" + e);
  }
});

module.exports = router;
