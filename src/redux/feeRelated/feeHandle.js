import axios from "axios";
import {
  getRequest,
  getFeeDetailsSuccess,
  updateFeeSuccess,
  getFailed,
  getError,
  setTotalFeeCollections,
} from "./feeSlice";

// Fetch fee details of a student
export const getStudentFeeDetails = (studentId) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/Student/fees/${studentId}`
    );

    // console.log("feedetails: ".response);

    if (response.data.fees) {
      dispatch(getFeeDetailsSuccess(response.data));
    } else {
      dispatch(getFailed("Failed to retrieve fee details."));
    }
  } catch (error) {
    dispatch(getError(error.message || "Error fetching fee details."));
  }
};

// Create Razorpay Order (fetches orderId for the frontend)
export const createOrder = (studentId, month, amount) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/Student/fees/create-order`,
      { studentId, month, amount },
      { headers: { "Content-Type": "application/json" } }
    );

    // console.log("response from fee handler: ", response);

    if (response.data.orderId) {
      dispatch(
        getFeeDetailsSuccess({
          message: "Order created successfully",
          orderId: response.data.orderId,
        })
      );
    } else {
      dispatch(getFailed("Failed to create Razorpay order."));
    }

    // Return the response data to the caller
    return response.data;
  } catch (error) {
    dispatch(getError(error.message || "Error creating Razorpay order."));
  }
};

// Verify Payment and update fee status
export const verifyPayment =
  (studentId, month, paymentDetails) => async (dispatch) => {
    dispatch(getRequest());

    try {
      const { paymentId, orderId, signature } = paymentDetails;

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/Student/fees/pay`,
        { studentId, month, paymentId, orderId, signature },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("response from fee handler: ", response);

      if (response.data.message === "Fee payment successful") {
        dispatch(updateFeeSuccess(response.data.fee));
      } else {
        dispatch(
          getFailed("Payment verification failed or fee update unsuccessful.")
        );
      }
    } catch (error) {
      dispatch(
        getError(
          error.message || "Error verifying payment or updating fee status."
        )
      );
    }
  };

export const fetchTotalFeeCollections = (adminId) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/Admin/feeCollection/${adminId}`
    );

    if (response.data.totalCollections >= 0) {
      dispatch(setTotalFeeCollections(response.data.totalCollections));
    } else {
      throw new Error("Failed to retrieve total fee collections.");
    }
  } catch (error) {
    dispatch(
      getError(error.message || "Error fetching total fee collections.")
    );
  }
};
