const ExpressError = require('./utilities/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');
const { campgroundSchema, reviewSchema } = require('./schema.js');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'you must be signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const foundCampground = await Campground.findById(id)
    if (!req.user || !foundCampground.author.equals(req.user._id)) {
        req.flash('error', 'You have no permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewID } = req.params;
    const foundReview = await Review.findById(reviewID)
    if (!foundReview.author.equals(req.user._id)) {
        req.flash('error', 'You have no permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}