const {Router} = require("express")
const userMiddleware = require("../middleware/user")
const UserModel = require("../db/schema/user")
const courseModel = require("../db/schema/course")
const router = Router();


router.get('/courses', async(req, res) => {

    try{
        const courses = await courseModel.find();
        res.status(200).send(courses);

    }catch(error){
        res.status(500).send("server error");
    }

});

router.post('/courses/:courseId', userMiddleware, async(req, res) => {
    const course_id = req.params.courseId;
    console.log(course_id);
  
    try {
      const course = await courseModel.findOne({ course_id: course_id });
      
      if (!course) {
        return res.status(400).send("Invalid course");
      }
      
      const userId = req.user.id;
      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: userId },
        { $addToSet: { purchasedCourses: course_id } },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(500).send("Server error");
      }
      
      res.status(200).send("Course Successfully Purchased!");
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  });
  

router.get('/purchasedCourses', userMiddleware, async(req, res) => {
    
    const userId = req.user.id;
    const userInfo = await UserModel.findOne({
        _id : userId
    }) 
    !userInfo && res.status(500).send("Internal server error")
    const purchasedCourses = userInfo.purchasedCourses;
    res.status(200).send(purchasedCourses);

});

module.exports = router;