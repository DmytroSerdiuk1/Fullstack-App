const {Router} = require('express');
const Course = require('../modules/course');
const router = Router();
const mitAuth = require('../middleware/routeAuth')

router.get('/addcourses', mitAuth, (req, res)=> {
    res.render('addcourses', {
        title: "Add courses",
        isAddCourse: true
    })
})

router.post('/addcourses', mitAuth, async (req, res) => {
    if(req.body && +req.body.price !== 'NaN'){
        const course = new Course({
            title: req.body.title,
            price: req.body.price,
            img: req.body.img,
            userId: req.user._id
        })

        await course.save()

        res.redirect("/courses")
    } else {
        res.redirect('/error')
    }
})


module.exports = router;

