const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const adminModel = require("../db/schema/admin");
const courseModel = require("../db/schema/course");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    const newUser = await adminModel.create({
      email: email,
      password: hash,
    });
    res.status(200).send("Admin Created");
  } catch (error) {
    console.error("Error finding user:", error.message);
    throw error;
  }
});

router.post("/signin", async (req, res) => {
  try {
    const email = req.body.email;
    const originalpassword = req.body.password;
    const user = await adminModel.findOne({ email: email });
    if (!user) {
      throw new Error("Email not found");
    }

    const verify = await bcrypt.compare(originalpassword, user.password);
    !verify && res.status(500).send("Password is incorrect");

    const userId = user._id;
    const token = jwt.sign({ id: userId }, process.env.SCT);
    res.send(token);
  } catch (error) {
    console.error("Error finding user:", error.message);
    throw error;
  }
});

router.post("/createcourses",adminMiddleware,async (req, res) => {
  // Implement course creation logic
  const courseId = req.body.course_id;
  const courseName = req.body.course_name;

  try {
    const course = await courseModel.find({
      $or: [{ course_id: courseId }, { course_name: courseName }]
    });
    console.log(course);
    course.length !==0 && res.send("course already exit!");
    console.log(courseName ,courseId)
    const createCourse = await courseModel.create({
      course_id: courseId,
      course_name: courseName
    });
    console.log(createCourse)    

    res.status(200).send(createCourse);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/courses", adminMiddleware, async (req, res) => {
  // Implement fetching all courses logic
  try {
    const courses = await courseModel.find();
    res.status(200).send(courses);
  } catch (error) {
    res.status(500).send("server error");
  }
});

module.exports = router;
