var express = require("express");
var router = express.Router();
//import database
const { blogsDB } = require("../mongo");
//import validation function from validation.js
const { serverCheckBlogIsValid } = require("../utilities/validation");

router.get("/blogs-list", async (req, res, next) => {
  try {
    const collection = await blogsDB().collection("fiftyblogs");
    const fiftyblogs = await collection
      .find({})
      .project({
        id: 1,
        title: 1,
        author: 1,
        createdAt: 1,
        lastModified: 1,
      })
      .toArray();

    res.status(200).json({ message: fiftyblogs, success: true });
  } catch (e) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching blogs " + e, success: false });
  }
});

router.put("/edit-blog", async (req, res) => {
  try {
    //to make sure the input is valid in the blog editor

    const updateBlogIsValid = serverCheckBlogIsValid(req.body);
    if (!updateBlogIsValid) {
      res.status(400).json({ message: "Invalid Entry", success: false });
      return;
    }
    const collection = await blogsDB().collection("fiftyblogs");
    const blogId = Number(req.body.id);
    const title = req.body.title;
    const text = req.body.text;
    const author = req.body.author;
    const date = new Date();

    const updateBlog = {
      title: title,
      text: text,
      author: author,
      lastModified: date,
    };

    await collection.updateOne({ id: blogId }, { $set: { ...updateBlog } });
    res.status(200).json({ message: "Blog update complete", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error encountered while updating blog" + error,
      success: false,
    });
  }
});

router.delete("/delete-blog/:blogId", async (req, res) => {
  try {
    const blogId = Number(req.params.blogId);
    const collection = await blogsDB().collection("fiftyblogs");
    const blogToDelete = await collection.deleteOne({ id: blogId });
    if (blogToDelete.deletedCount === 1) {
      res.json({ message: "Successfully deleted", success: true }).status(200);
    } else {
      res.json({ message: "Delete unsuccessful", success: false }).status(204);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error" + error, success: false });
  }
});

module.exports = router;
