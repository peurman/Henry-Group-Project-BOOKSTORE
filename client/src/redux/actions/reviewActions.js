import axios from "axios";
import Swal from "sweetalert2";
import { getReviews, editReview } from "../reducers/reviewSlice";
import { setCloseButtonReview } from "../reducers/booksSlice";
import { asyncGetBookDetail } from "./booksActions";

const heroku = `https://db-proyecto-final.herokuapp.com/`;
axios.defaults.baseURL = heroku;

Swal.mixin({
  background: "#DED7CF",
  toast: true,
  position: "bottom-end",
  showConfirmButton: false,
  iconColor: "#1E110B",
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export function asyncGetReviews() {
  return async function (dispatch) {
    try {
      const response = (await axios.get("/reviews")).data;
      dispatch(getReviews(response));
    } catch (error) {
      dispatch(getReviews([null]));
    }
  };
}

export function asyncAddReview(body) {
  return async function (dispatch) {
    try {
      await axios.post("/reviews", body);
      Swal.fire({
        icon: "success",
        text: "You have correctly added the review to this book",
        title: "Added!",
        showConfirmButton: false,
        timer: 2000,
      });
      setTimeout(() => {
        dispatch(setCloseButtonReview());
      }, 2000);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.message}`,
      });
      console.error(error);
    }
  };
}

export function asyncEditReview(ID, body) {
  return async function (dispatch) {
    try {
      const response = (await axios.put(`/reviews/${ID}`, body)).data;
      dispatch(editReview(response.data));
    } catch (error) {
      console.log(error);
    }
  };
}

export function asyncdeleteReview(ID) {
  return async function (dispatch) {
    return await Swal.fire({
      title: "Are you sure you want to delete your review?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete review!",
    }).then(async (result) => {
      try {
        if (result.isConfirmed) {
          await axios.delete(`/reviews/${ID}`);
          return await Swal.fire(
            "Deleted!",
            `<b>Your review</b> has been deleted.`,
            "success"
          ).then(() => {
            dispatch(asyncGetReviews());
            return true;
          });
        }
      } catch (error) {
        return await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error.response.data}`,
        }).then(() => {
          return undefined;
        });
      }
    });
  };
}

export function asyncreportReview(ID, userID, bookID) {
  return async function (dispatch) {
    try {
      await axios.put(`/reviews/${ID}?report=true&user=${userID}`);
      Swal.fire({
        icon: "success",
        text: "Review has been correctly reported",
        title: "Reported!",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        dispatch(asyncGetBookDetail(bookID));
      });

      // return `Review ${ID} has been reported`;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.message}`,
      });
      console.log(error);
    }
  };
}
