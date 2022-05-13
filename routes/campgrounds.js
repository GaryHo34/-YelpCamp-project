const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')
const campgrounds = require('../controllers/campgrounds')
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.get('/:id/edit', isAuthor, catchAsync(campgrounds.renderEditForm))

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampgrounds))


router.route('/:id')
    .get(catchAsync(campgrounds.showCamground))
    .put(isLoggedIn, isAuthor, upload.array('image'), catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

module.exports = router;