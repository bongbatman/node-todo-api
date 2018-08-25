//We can't require the variable mongoose otherwise the files won't work that require this one
let mongoose = require('mongoose');

/**
 * We are setting validators here itself.
 * Ideal way would be to make a different schema object and then use it
 * as argument
 * @type {Document | T}
 * Mongoose casts types so we need to be careful
 */
//just like DB Contract in android sql
let Todo = mongoose.model('Todo', {
    task: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

module.exports = {Todo};