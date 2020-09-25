const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
	const title = 'Food Journal';
	res.render('index', { title: title }) // renders views/index.handlebars
});

router.get('/showLogin', (req, res) => {
	res.render('user/login') // renders user/login.handlebars
});

router.get('/showRegister', (req, res) => {
	res.render('user/register') // renders user/register.handlebars
});

router.get('/about', (req, res) => {
	const author = 'Mohamad Nurridhwan';
	// let success_msg = 'Success Message';
	// let error_msg = 'Error message using error_msg';
	// let errors = [{text: 'First error message'}, //{{text}} is the key as used in error.handlebars
	// 			  {text:'Second error message'}, 
	// 			  {text: 'Third error message'}]
	// alertMessage(res, 'success','This is an important message','fas fa-sign-in-alt', true);
	// alertMessage(res, 'danger','Unauthorised access','fas fa-exclamation-circle', false);

	 res.render('about', {author: author//	,
				// success_msg: success_msg,
				// error_msg: error_msg,
				// errors:errors
			}) // renders user/register.handlebars
});

// Logout User
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router;
