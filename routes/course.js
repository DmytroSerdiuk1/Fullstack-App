const {Router} = require('express');
const Course = require('../modules/course');
const router = Router();
const mitAuth = require('../middleware/routeAuth')


router.get('/courses', async (req, res)=> {
    const courses = await Course.find();


    res.render('courses', {
        title: "Courses",
        isCourses: true,
        courses
    })
});

router.get('/courses/:id/edit', mitAuth, async (req, res)=> {

  const course = await Course.findById(req.params.id)

  res.render('edit', {
    title: `Edit course ${course.title}`,
    course
  })
})

router.post('/courses/edit', mitAuth, async (req, res)=>{
  const {id} = req.body;
  delete req.body.id; 

  await Course.findByIdAndUpdate(id, req.body)

  res.redirect('/courses')
})

router.post('/courses/remove', mitAuth, async (req, res)=>{
  const {id} = req.body;

  await Course.deleteOne({
    _id: id
  })

  res.redirect('/courses')
})

router.get('/courses/:id', async (req, res) => {
    const course = await Course.findById(req.params.id)

    res.render('course', {
      isCourses: true,
      title: `Курс ${course.title}`,
      course
    })
});

module.exports = router