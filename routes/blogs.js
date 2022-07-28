var express = require("express");
const { blogsDB } = require("../mongo");
var router = express.Router();

router.get("/hello-blogs", function (req, res) {
  res.json({ message: "hello from express" });
});

router.get("/all-blogs", async function (req, res) {
  try {
    const collection = await blogsDB().collection("fiftyblogs");

    const limit = Number(req.query.limit);
    const skip = Number(req.query.limit) * (Number(req.query.page) - 1);
    const sortField = req.query.sortField;
    const sortOrder = req.query.sortOrder === "ASC" ? 1 : -1;
    const filterField = req.query.filterField;
    const filterValue = req.query.filterValue;

    let filterObj = {};
    if (filterField && filterValue) {
      filterObj = { [filterField]: filterValue };
    }
    let sortObj = {};
    if (sortField && sortOrder) {
      sortObj = { [sortField]: sortOrder };
    }

    const posts50 = await collection
      .find(filterObj)
      .sort(sortObj)
      .limit(limit)
      .skip(skip)
      .toArray();
    res.json({ message: posts50 });
  } catch (e) {
    console.error(e);
    res.status(500).send("Error getting posts" + e);
  }
});

router.post("/blog-submit", async function (req, res, next) {
  console.log(req.body);
  try {
    const title = req.body.title;
    const text = req.body.text;
    const author = req.body.author;
    const collection = await blogsDB().collection("fiftyblogs");
    const postsCollection = await collection.count();

    const blogPost = {
      title: title,
      text: text,
      author: author,
      id: Number(postsCollection + 1),
      createdAt: new Date(),
      lastModified: new Date(),
    };

    await collection.insertOne(blogPost);
    res.status(200).json({ message: "New Blog Submitted" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error submitting post");
  }
});

router.get("/single-blog/:blogId", async function (req, res) {
  try {
    const blogId = Number(req.params.blogId);
    console.log(blogId);
    const collection = await blogsDB().collection("fiftyblogs");
    const blogPost = await collection.findOne({ id: blogId });
    console.log("blogPost ", blogPost);
    res.json(blogPost);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error!");
  }
});
module.exports = router;
