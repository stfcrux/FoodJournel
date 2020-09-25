const express = require('express');
const router = express.Router();
const User = require('../models/User');
const alertMessage = require('../helpers/messenger');
const bcrypt = require('bcryptjs');
const passport = require('passport');

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect:'/food/listFood',
        failureRedirect: '/showLogin',
        failureFlash: true
    })(req, res, next);
});

router.post('/register', (req, res) => {
    let errors = []
    let success_msg = '';

    let password = req.body.password; //getting values from HTML in /register
    let password2 = req.body.password2;
    let age = req.body.age;
    let name = req.body.name;
    let email = req.body.email;

    if (password !== password2) { //making sure password and password2 match
        errors.push({ text: 'Passwords do not match!' });//if error is true, errors array increases
    }
    if (password.length < 4) { //making sure password has at least 4 
        errors.push({ text: 'Password, must be at least 4 characters' });//if error is true, errors array increases
    }
    if (errors.length > 0) {
        res.render('user/register', {
            errors: errors,
            name: name,
            age:age,
            email: email,
            password: password,
            password2: password2
        })
    } else {
        // success_msg =`${email} registered successfully`;
        // res.render('user/login',{
        //     success_msg: success_msg
        // })

        User.findOne({ where: { email: email } }).then(user => {
            if (user) {
                res.render('user/register', {
                    error: user.email + ' already registered',
                    name,
                    age,
                    email,
                    password,
                    password2
                });
            } else {

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) throw err;
                        password = hash;
                        User.create({ name, email, age, password }) //creating record in the database
                            .then(user => {
                                alertMessage(res, 'success', user.name + ' added. Please login.', 'fas fa-sign-in-alt', true);
                                res.redirect('/showLogin');
                            })
                            .catch(err = console.log(err));
                    })
                })

            }
        }); //select top(1) from user email
    }

});
module.exports = router;
