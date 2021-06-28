const {Router} = require('express')
const router = Router();
const User = require('../modules/user')
const bcrypt = require('bcryptjs')

router.get('/auth/login', async (req, res) => {
    res.render('auth/login', {
        title: "Register",
        isLogin: true
    })
})

router.post('/auth/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        const candidate = await User.findOne({email});

        if(candidate) {
            const isSame = await bcrypt.compare(password, candidate.password)

            if (isSame) {
                req.session.user = candidate
                req.session.isAuth = true
                req.session.save(err => {
                    if(err){
                        throw err
                    }
                    res.redirect('/')
                })
            } else {
                res.redirect('/auth/login')
            }
        } else {
            res.redirect('/auth/login')
        }
    } catch(e){
        console.error(e);
    }
})

router.get('/auth/logout', async (req, res) => {
    req.session.isAuth = false,
    res.redirect('/auth/login')
})

router.post('/auth/register', async (req, res) => {
    try {
        const {email, password, repeatPassword, name} = req.body;

        const candidate = await User.findOne({email});

        if(candidate){
            res.redirect('/auth/login')
        } else {
            const hashPassword = await bcrypt.hash(password, 10)

            const user = new User({
                email, name, password: hashPassword
            });
            await user.save();
            res.redirect('/auth/login')
        }
    } catch (e) {
        console.error(e);
    }
})

module.exports = router