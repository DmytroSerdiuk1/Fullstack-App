const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');
const session = require('express-session');
const MongoSesion = require('connect-mongodb-session')(session)
const varMidleware = require('./middleware/variables')
const userMidleware = require('./middleware/user')
const homeRoute = require('./routes/home');
const addCourseRoute = require('./routes/addCourse');
const courseRoute = require('./routes/course');
const cart = require('./routes/cart');
const order = require('./routes/order');
const login = require('./routes/auth');
const User = require('./modules/user');

const MONGO_URI = 'mongodb+srv://Nomids:56P8kjLDuDMoXYWG@cluster0.gktgb.mongodb.net/courses'

const app = express();
const hbs = exphbs.create({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main',
    extname: 'hbs'
});

const store = new MongoSesion({
    collection: 'sessions',
    uri: MONGO_URI
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))

app.use(session({
    secret: 'secret value',
    resave: false,
    saveUninitialized: false,
    store
}))

app.use(varMidleware)
app.use(userMidleware)

app.use(homeRoute)
app.use(addCourseRoute)
app.use(courseRoute)
app.use(cart)
app.use(order)
app.use(login)


async function start(){
    try {
        await mongoose.connect(MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true, 
            useFindAndModify: false
        });

        await app.listen(process.env.PORT || 3000, ()=> {
            console.log("Server is running///");
        })    
    } catch(e){
        console.log(e);
    }

}

start();