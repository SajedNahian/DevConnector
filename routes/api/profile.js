const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
// Validation
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");
// Models
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route GET api/posts/test
// @desc Tests post router
// @access Public
router.get("/test", (req, res) => {
  res.json({ msg: "Profile works" });
});

// @route GET api/profile
// @desc
// @access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          return res
            .status(404)
            .json({ noprofile: "There is no profile for this user" });
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route POST api/profile/all
// @desc Get all profiles
// @access Public
router.get("/all", (req, res) => {
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => res.json(profiles))
    .catch(err => res.json({ profile: "There are no profiles" }));
});

// @route POST api/profile/handle/:handle
// @desc Get profile by handle
// @access Public
router.get("/handle/:handle", (req, res) => {
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        return res
          .status(404)
          .json({ error: "There is no user for this handle" });
      }
      res.json(profile);
    })
    .catch(err => res.status(500).json(err));
});

// @route POST api/profile/user/:user_id
// @desc Get profile by userId
// @access Public
router.get("/user/:user_id", (req, res) => {
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        return res
          .status(404)
          .json({ error: "There is no user for this handle" });
      }
      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ error: "There is no user for this handle" })
    );
});

// @route POST api/profile
// @desc create or edit user profile
// @access Private
// NEEDS REVISION
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    if (!isValid) {
      return res.status(400).json({ errors });
    }

    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    //
    // console.log(profileFields);
    req.body.skills = req.body.skills.split(",");
    req.body.social = {
      youtube: req.body.youtube,
      twitter: req.body.twitter,
      facebook: req.body.facebook,
      linkedin: req.body.linkedin,
      instagram: req.body.instagram
    };
    //
    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: req.body },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Create
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "That handle already exists";
            return res.status(400).json({ errors });
          }
          const newProfile = new Profile(req.body);
          newProfile.save().then(profile => res.json(profile));
        });
      }
    });
  }
);

// @route POST api/profile/experience
// @desc Add experience to profile
// @access Private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };
      profile.experience = [newExp, ...profile.experience];
      profile
        .save()
        .then(profile => {
          res.json(profile);
        })
        .catch();
    });
  }
);

// @route POST api/profile/education
// @desc Add education to profile
// @access Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };
      profile.education = [newEdu, ...profile.education];
      profile
        .save()
        .then(profile => {
          res.json(profile);
        })
        .catch(err => console.log(err));
    });
  }
);

// @route DELETE api/profile/experience/:id
// @desc
// @access Private
router.delete(
  "/experience/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.params.id);
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        profile.experience = profile.experience.filter(
          experience => experience.id !== req.params.id
        );
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => console.log(err));
  }
);

// @route DELETE api/profile/education/:id
// @desc
// @access Private
router.delete(
  "/education/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        profile.education = profile.education.filter(
          education => education.id !== req.params.id
        );
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => console.log(err));
  }
);

// @route DELETE api/profile
// @desc
// @access Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndDelete({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

module.exports = router;
