const { Reviews, Users, Books } = require('../db');
let errors = [];
let reviewModel = {
  validateReview: async function (review) {
    errors = [];
    if (review.title.length > 20) {
      errors.push('Title cannot be more than 20 characters long');
    }
    if (review.rating > 5) {
      errors.push('Rating must be between 0 and 5');
    }
    if (errors.length) {
      return errors;
    }
    return false;
  },
  getAllReviews: async function () {
    const reviews = await Reviews.findAll();
    const filteredReviews = reviews.map(async (r) => {
      var user = await r.getUser();
      var book = await r.getBook();

      return {
        ID: r.ID,
        review: r.review,
        rating: r.rating,
        reports: r.reports,

        user: {
          ID: user.ID,
          username: user.username,
          email: user.email,
          profilepic: user.profilepic,
          name: user.name,
          surname: user.surname,
          enabled: user.enabled,
          banned: user.banned,
          suspendedTimes: user.suspendedTimes,
        },
        book: book.toJSON(),
      };
    });
    const result = await Promise.all(filteredReviews);
    return result;
  },
  getReviewUser: async function (ID) {
    const user = await Users.findOne({
      where: {
        ID,
      },
      include: Reviews,
    });
    console.log(user.toJSON());
  },
  getReviewBook: async function (ID) {
    const book = await Books.findOne({
      where: {
        ID,
      },
      include: Reviews,
    });
    console.log(book.toJSON());
  },
  createReview: async function (newReview) {
    const createdReview = await Reviews.create({
      title: newReview.title,
      review: newReview.review,
      rating: newReview.rating,
      bookID: newReview.bookID,
      userID: newReview.userID,
    });
    const book = await Books.findByPk(newReview.bookID, {
      include: Reviews,
    });

    let sum = 0;
    for (let i = 0; i < book.toJSON().reviews.length; i++) {
      sum = sum + book.toJSON().reviews[i].rating;
      console.log(book.toJSON().reviews[i].rating);
    }
    await book.update({
      rating: (sum / book.toJSON().reviews.length).toFixed(1),
    });
    return createdReview;
  },
  modifyReview: async function () {},
  deleteReview: async function () {},
};

module.exports = reviewModel;