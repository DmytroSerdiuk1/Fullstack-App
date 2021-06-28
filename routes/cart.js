const {Router} = require('express');
const Course = require('../modules/course');
const router = Router();
const mitAuth = require('../middleware/routeAuth')

const mapCartData = (cart) => {
    return cart.items.map(i => ({
        ...i.course._doc,
        count: i.count,
        id: i.course.id
    }))
}

function calcPrice(courses) {
    return courses.reduce((total, course) => {
        return total += course.price * course.count
    }, 0)
}

router.get('/cart', mitAuth, async (req, res)=> {
    const user = await req.user.populate('cart.items.course').execPopulate();

    const courses = mapCartData(user.cart);

    res.render('cart', {
        title: "Cart",
        isCart: true,
        cart: courses,
        price: calcPrice(courses)
    })

})

router.delete('/cart/remove/:id', mitAuth, async (req, res) => {
    await req.user.removeFromCart(req.params.id)
    const user = await req.user.populate('cart.items.course').execPopulate();

    const courses = mapCartData(user.cart)
    const cart = {
        courses,
        price: calcPrice(courses)
    }

    res.status(200).json(cart);
})

router.post('/cart/add', mitAuth, async (req, res)=>{
    const course = await Course.findById(req.body.id);
    await req.user.addToCart(course)
    res.redirect('/cart');
})

module.exports = router;