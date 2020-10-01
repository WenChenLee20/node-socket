import express from 'express';

/*
	File cointaining all routes to the controllers of the platform
*/

var router = express.Router();

router.get('/test', (req, res, next) => {
	res.send("api is available");
});

module.exports = router;