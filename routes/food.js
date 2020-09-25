const express = require('express');
const router = express.Router();
const moment = require('moment');
const food = require('../models/Food');
const ensureAuthenticated = require('../helpers/auth');
const alertMessage = require('../helpers/messenger');
const fs = require('fs');
const upload = require('../helpers/imageUpload');


// Upload poster
router.post('/upload', ensureAuthenticated, (req, res) => {
    // Creates user id directory for upload if not exist
    if (!fs.existsSync('./public/uploads/' + req.user.id)){  // checking if the folder exists, else make the directory based on user ID
        fs.mkdirSync('./public/uploads/' + req.user.id);
    }
    
    upload(req, res, (err) => {
        if (err) {
            res.json({file: '/img/no-image.jpg', err: err});
        } else {
            if (req.file === undefined) {
                res.json({file: '/img/no-image.jpg', err: err});
            } else {
                res.json({file: `/uploads/${req.user.id}/${req.file.filename}`});
            }
        }
    });
})


//list videos belonging to current logged in user
router.get('/listFood',ensureAuthenticated, (req, res)=>{
    // retrieve all the videos where the user id matches the given user id
    food.findAll({
        where:{
            userId:req.user.id
        },
        // sorted by title in ascending order
        order:[
            ['entry','asc']
        ],
        // raw data set
        raw:true
    })
    // if successfull, return the list of videos
    .then((food)=> {
        res.render('food/listFood',{foods:food});// pass in the array of video objects
    })
    .catch(err=>console.log(err));
});

// the ID of the video (id is appended to the back of the link)
router.get('/edit/:id',ensureAuthenticated, (req,res)=>{

    //find from data base where the id is the req.params.id( in this case w eare taking the ID from the req link)
    food.findOne({
        where:{
            id:req.params.id
        }
    }).then((food)=>{
        if(req.user.id === food.userId){
            checkOptions(food);
            res.render('food/editFood',{
                  food
            });     
        }else{
            alertMessage(res, 'danger', 'Unauthorised access to the video', 'fas fa-exclaimation-circle', true);
            res.redirect('/logout');


        }    
    }).catch(err=>console.log(err));
});

// // .search() returns the index of the location of the start of the match
function checkOptions(food){
    food.chineseFood = (food.cuisine.search('Chinese')>=0)?'checked':'';
    food.americanFood = (food.cuisine.search('American')>=0)?'checked':'';
    food.koreanFood = (food.cuisine.search('Korean')>=0)?'checked':'';
    food.japFood = (food.cuisine.search('Japanese')>=0)?'checked':'';
    food.malayFood = (food.cuisine.search('Malay')>=0)?'checked':'';
    food.indianFood = (food.cuisine.search('Indian')>=0)?'checked':'';
    food.otherFood = (food.cuisine.search('Other')>=0)?'checked':'';

    food.Breakfast = (food.mealType.search('Breakfast')>=0)?'checked':'';
    food.Brunch = (food.mealType.search('Brunch')>=0)?'checked':'';
    food.Lunch = (food.mealType.search('Lunch')>=0)?'checked':'';
    food.Tea = (food.mealType.search('tea')>=0)?'checked':'';
    food.Dinner = (food.mealType.search('Dinner')>=0)?'checked':'';
    food.Supper = (food.mealType.search('Supper')>=0)?'checked':'';


}

// //save edited video

router.put('/saveEditedFood/:id',ensureAuthenticated, (req,res)=>{
	
    let entry = req.body.entry;
    let dateOfEntry =  moment(req.body.dateOfEntry, 'DD/MM/YYYY'); // using moment libary to change the date format
    let cuisine = req.body.cuisine.toString();
    let diningPlace = req.body.diningPlace;
    let mealType = req.body.mealtype; 
    let calories = req.body.calories;
    let mood = req.body.mood;
    
	//set variables here to save to video table
	food.update({
        entry,
        dateOfEntry,
        cuisine,
        diningPlace,
        mealType,
        calories,
        mood

    }, {
        where: {
            id:req.params.id
        }   
    }).then(()=>{
        res.redirect('/food/listFood');
    }).catch(err=>console.log(err));
});


router.get('/showAddFood',ensureAuthenticated, (req,res)=>{
    res.render('food/addFood');

});


// adds new video jot from /video/addVideo handle bar html
router.post('/addFood', ensureAuthenticated, (req, res)=>{
    let entry = req.body.entry;
    let dateOfEntry =  moment(req.body.dateOfEntry, 'DD/MM/YYYY'); // using moment libary to change the date format
    let cuisine = req.body.cuisine.toString();
    let diningPlace = req.body.diningPlace;
    let mealType = req.body.mealtype; 
    let calories = req.body.calories;
    let mood = req.body.mood;
    let userId = req.user.id;
    console.log("userId: " + userId);

    // Multi-value components return array of strings or undefined 
    // store the video into the data base
    food.create({
        entry,
        dateOfEntry,
        cuisine,
        diningPlace,
        mealType,
        calories,
        mood,
        userId
    })
    // if created successfully then
    .then((food) =>{
        res.redirect('/food/listfood');
    })
    .catch(err=>console.log(err))
});


router.get('/delete/:id', ensureAuthenticated, (req, res)=>{
    let foodId = req.params.id;
    let userId = req.user.id;
    
	// Select * from videos where videos.id=videoID and videos.userId=userID
   
   food.findOne({
        where:{
            id:foodId,
            userId:userId
        },
        attributes: ['id', 'userId']
    }).then((food)=>{
        
		// if record is found, user is owner of video
        
		if(food!=null){
            food.destroy({
                where:{
                    id:foodId
                }
            // when true
            }).then(()=>{
                alertMessage(res, 'info', 'Food journal entry deleted', 'far fa-trash-alt', true);
                res.redirect('/food/listFood'); // To retrieve all videos again
            }).catch(err =>console.log(err));
        }else{
            alertMessage(res, 'danger', 'Unauthorised access to Food journel', 'fas fa-exclamation-circle', true);
			res.redirect('/logout');
        }
    }).catch(err=>console.log(err));
});




module.exports = router;
