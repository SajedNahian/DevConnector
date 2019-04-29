const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
// validation
const validatePostInput = require("../../validation/post");
// model
const Post = require("../../models/Post");

// @route GET api/posts/test
// @desc Tests posts router
// @access Public
router.get("/test", (req, res) => {
  res.json({ msg: "Posts works" });
});

// @route POST api/posts/
// @desc
// @access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.user.avatar,
      user: req.user.id
    });
    newPost.save().then(post => res.json(post));
  }
);

// @route GET api/posts/
// @desc
// @access Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => {
      res.json(posts);
    })
    .catch(err => res.status(404));
});

// @route GET api/posts/:id
// @desc
// @access Public
router.get("/:id", (req, res) => {
  Post.findOne({ _id: req.params.id })
    .then(post => {
      if (post) {
        return res.json(post);
      }
      res.status(404).json({ nopostfound: "Post with that id not found" });
    })
    .catch(err =>
      res.status(404).json({ nopostfound: "Post with that id not found" })
    );
});

// @route DELETE api/posts/:id
// @desc
// @access Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.deleteOne({ user: req.user.id, _id: req.params.id })
      .then(info => {
        if (info.deletedCount === 0) {
          return res.json({ success: false });
        }
        res.json({ success: true });
      })
      .catch(err => res.status(404).json({ success: false }));
  }
);

// @route POST api/posts/like/:id
// @desc
// @access Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findOne({ _id: req.params.id })
      .then(post => {
        if (post) {
          if (!post.likes.some(like => like.user.toString() === req.user.id)) {
            post.likes = [...post.likes, { user: req.user.id }];
            return post.save().then(post => {
              res.json(post);
            });
          }
          return res
            .status(400)
            .json({ alreadyliked: "Already liked that post" });
        } else {
          return res.status(404).json({ success: false });
        }
      })
      .catch(err => res.status(404).json({ success: false }));
  }
);

// @route POST api/posts/unlike/:id
// @desc
// @access Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findOne({ _id: req.params.id })
      .then(post => {
        if (post) {
          post.likes = post.likes.filter(
            like => like.user.toString() !== req.user.id
          );
          return post.save().then(post => {
            res.send(post);
          });
        } else {
          return res.status(404).json({ success: false });
        }
      })
      .catch(err => res.status(404).json({ success: false }));
  }
);

// @route POST api/posts/comment/:id
// @desc
// @access Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        post.comments = [newComment, ...post.comments];
        post.save().then(post => res.send(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "Post not found" }));
  }
);

// @route DELETE api/posts/comment/:id/:comment_id
// @desc
// @access Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        post.comments = post.comments.filter(
          comment => comment.id !== req.params.comment_id
        );
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "Post not found" }));
  }
);
module.exports = router;
