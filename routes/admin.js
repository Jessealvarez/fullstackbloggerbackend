import React from "react";

var express = require("express");

var router = express.Router();

const { blogsDB } = require("../mongo");

router.get("/blogs-list", async function (req, res, next) {
  try {
    const collection = await blogsDB().collection("fiftyblogs");
    const fiftyblogs = await collection
      .find({})
      .projection({
        title: 1,
        author: 1,
        createdAt: 1,
        lastModified: 1,
      })
      .toArray();

    res.status(200).json({ message: "success", success: true });
  } catch (e) {
    res.status(500).json({ message: "Error fetching blogs", success: false });
  }
});

router.put("/edit-blog", async function (req, res) {
  try {
    const updateBlogIsValid = serverCheckBlogIsValid(req.body);
    //Error Message
    if (!updateBlogIsValid) {
      res
        .status(400)
        .json({ message: "Blog update is not valid", success: false });
      return;
    }

    const newPostData = req.body;
    const date = new Date();
    const updateBlog = { ...newPostData, lastModified: date };

    await collection.updateOne(
      { id: newPostData.id },
      { $set: { ...updateBlog } }
    );
    res.status(200).json({ message: "Blog update complete", success: true });
  } catch (error) {
    res
      .status(500)
      .json({
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
    res.status(500).json({ message: "Error" + error, success: false });
  }
});
