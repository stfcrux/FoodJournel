const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../helpers/auth');
const Food = require('../models/Food');
const moment = require('moment');
const alertMessage = require('../helpers/messenger');

router.get('/listFood', ensureAuthenticated, (req, res) => { //list/Videos
    Food.findAll({
        where: {
            userId: req.user.id
        },
        order: [
            ['dateEntry', 'ASC']
        ],
        raw: true
    })
        .then((foods) => {
            res.render('food/listFood', { foods: foods });
        })
        .catch(err => console.log(err));
});
router.get('/addFood', ensureAuthenticated, (req, res) => { //addFood
    res.render('food/addFood');
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => { //editFood
    Food.findOne({
        where: {
            id: req.params.id
        }
    }).then((food) => {
        if (req.user.id === food.userId) {
            checkOptions(food);
            res.render('food/editFood', {
                food
            });
        } else {
            alertMessage(res, 'danger', 'Unauthorised access to the video', 'fas fa-exclamation-circle', true);
            res.redirect('/logout');
        }
    }).catch(err => console.log(err));
});

router.get('/delete/:id', ensureAuthenticated, (req, res) => {
    let foodId = req.params.id;
    let userId = req.user.id;

    Food.findOne({
        where: {
            id: foodId,
            userId: userId
        },
        attributes: ['id', 'userId']
    }).then((food) => {

        // if record is found, user is owner of video

        if (food != null) {
            Food.destroy({
                where: {
                    id: foodId
                }
            }).then(() => {
                alertMessage(res, 'info', 'Entry deleted', 'far fa-trash-alt', true);
                res.redirect('/food/listFood'); // To retrieve all videos again
            }).catch(err => console.log(err));
        } else {
            alertMessage(res, 'danger', 'Unauthorised access to video', 'fas fa-exclamation-circle', true);
            res.redirect('/logout');
        }
    }).catch(err => console.log(err));
});

function checkOptions(food) {
    food.chineseFood = (food.cuisine.search('Chinese') >= 0) ? 'checked' : '';
    food.americanFood = (food.cuisine.search('American') >= 0) ? 'checked' : '';
    food.koreanFood = (food.cuisine.search('Korean') >= 0) ? 'checked' : '';
    food.japFood = (food.cuisine.search('Japanese') >= 0) ? 'checked' : '';
    food.malayFood = (food.cuisine.search('Malay') >= 0) ? 'checked' : '';
    food.indianFood = (food.cuisine.search('Indian') >= 0) ? 'checked' : '';
    food.otherFood = (food.cuisine.search('Other') >= 0) ? 'checked' : '';

    food.Breakfast = (food.mealType.search('Breakfast') >= 0) ? 'checked' : '';
    food.Brunch = (food.mealType.search('Brunch') >= 0) ? 'checked' : '';
    food.Lunch = (food.mealType.search('Lunch') >= 0) ? 'checked' : '';
    food.Tea = (food.mealType.search('Tea') >= 0) ? 'checked' : '';
    food.Dinner = (food.mealType.search('Dinner') >= 0) ? 'checked' : '';
    food.Supper = (food.mealType.search('Supper') >= 0) ? 'checked' : '';

    food.Happy = (food.mood.search('Happy') >= 0) ? 'checked' : '';
    food.Sad = (food.mood.search('Sad') >= 0) ? 'checked' : '';
    food.Angry = (food.mood.search('Angry') >= 0) ? 'checked' : '';
    food.Tense = (food.mood.search('Tense') >= 0) ? 'checked' : '';
    food.Calm = (food.mood.search('Calm') >= 0) ? 'checked' : '';
}

router.post('/addFood', ensureAuthenticated, (req, res) => {
    let entry = req.body.entry.slice(0, 1999);
    let dateEntry = moment(req.body.dateEntry, 'DD/MM/YYYY');
    let cuisine = req.body.cuisine.toString(); //.toString bc checkbox inputs are group input form mySQL cannot read multiple inputs
    //let subtitles = req.body.subtitles === undefined ? '' : req.body.subtitles.toString(); // === undefined? helps user to continue function if client do not choose subtitle
    let mealType = req.body.mealtype.toString();
    let mood = req.body.mood.toString();
    let diningPlace = req.body.diningPlace;
    let calories = req.body.calories;
    let userId = req.user.id;

    //Storing in the database
    Food.create({
        entry,
        dateEntry,
        cuisine,
        mealType,
        mood,
        diningPlace,
        calories,
        userId
    })
        .then((food) => { //if created succesfully
            res.redirect('/food/listFood');
        })
        .catch(err => console.log(err)) // else error message in console
});

router.put('/saveEditedFood/:id', ensureAuthenticated, (req, res) => {
    let entry = req.body.entry.slice(0, 1999);
    let dateEntry = moment(req.body.dateEntry, 'DD/MM/YYYY');
    let cuisine = req.body.cuisine.toString(); //.toString bc checkbox inputs are group input form mySQL cannot read multiple inputs
    //let subtitles = req.body.subtitles === undefined ? '' : req.body.subtitles.toString(); // === undefined? helps user to continue function if client do not choose subtitle
    let mealType = req.body.mealtype.toString();
    let mood = req.body.mood.toString();
    let diningPlace = req.body.diningPlace;
    let calories = req.body.calories;
    let userId = req.user.id;

    //Storing in the database
    Food.update({
        entry,
        dateEntry,
        cuisine,
        mealType,
        mood,
        diningPlace,
        calories,
        userId
    },{
        where: {
            id: req.params.id
        }
    }).then(() => { //if created succesfully
            res.redirect('/food/listFood');
        })
        .catch(err => console.log(err)) // else error message in console
});
module.exports = router;