const {Schema, model} = require('mongoose');

const userShema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                course: {
                    type: Schema.Types.ObjectId,
                    ref: 'Courses',
                    required: true
                }
            }
        ]
    }
})

userShema.methods.addToCart = function(course){
    const itemsClone = [...this.cart.items];
    const indx = itemsClone.findIndex(c => {
        return c.course.toString() === course._id.toString()
    })

    if(indx >= 0) {
        itemsClone[indx].count = itemsClone[indx].count + 1
    } else {
        itemsClone.push({
            course: course._id,
            count: 1
        })
    }

    this.cart = {items: itemsClone};

    return this.save()
}

userShema.methods.removeFromCart = function(id){
    let items = [...this.cart.items];
    const indx = items.findIndex(c => {
        return c.course.toString() === id.toString()
    });

    if(items[indx].count === 1) {
        items = items.filter(c => c.course.toString() !== id.toString())
    } else {
        items[indx].count--
    }

    this.cart = {items}

    return this.save()
}

userShema.methods.clearCart = function() {
    this.cart = {items: []}
    return this.save();
}

module.exports = model('User', userShema)