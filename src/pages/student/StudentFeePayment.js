import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Table,
  TableBody,
  TableHead,
  Typography,
  TableContainer,
} from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../../components/styles";
import {
  createOrder,
  getStudentFeeDetails,
  verifyPayment,
} from "../../redux/feeRelated/feeHandle";

const FeePaymentPage = () => {
  const dispatch = useDispatch();
  const { feeDetails, loading } = useSelector((state) => state.fee);
  const { currentUser } = useSelector((state) => state.user);

  // Fetch fee details on component mount
  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getStudentFeeDetails(currentUser._id));
    }
  }, [dispatch, currentUser]);

  // console.log("feedetails: ", feeDetails);

  // Handle Razorpay payment
  const handlePayment = async (month, feeAmount) => {
    try {
      const response = await dispatch(
        createOrder(currentUser._id, month, feeAmount)
      );
      // console.log("create order response: ", response);
      const orderId = response.orderId;

      // console.log(orderId);

      if (!orderId) {
        throw new Error("Failed to create Razorpay order.");
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: feeAmount * 100,
        currency: "INR",
        name: "SchoolVerse",
        description: `Fee payment for ${month}`,
        order_id: orderId,
        handler: async (response) => {
          const paymentDetails = {
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          };

          console.log(paymentDetails);

          await dispatch(verifyPayment(currentUser._id, month, paymentDetails));
          alert("Payment successful!");
        },
        prefill: {
          name: currentUser.name,
          email: currentUser.email,
          contact: currentUser.contact || "9631567550",
        },
        theme: {
          color: "#3399cc",
        },
      };

      // console.log("Razorpay object:", window.Razorpay);
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error initiating payment:", error.message);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      // Re-fetch fee details after payment attempt
      dispatch(getStudentFeeDetails(currentUser._id));
    }
  };

  // Render fee table
  const renderFeeTable = () => (
    <>
      <Typography variant="h4" align="center" gutterBottom>
        Monthly Fee Payment Record
      </Typography>
      {loading ? (
        <Typography align="center">Loading...</Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Month</StyledTableCell>
                <StyledTableCell>Amount Due</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell sx={{ textAlign: "center" }}>
                  Action
                </StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {feeDetails.fees?.map((fee, index) => {
                const isCurrentOrPast =
                  new Date().getMonth() >=
                  new Date(`${fee.month} 1, ${fee.year}`).getMonth();

                return (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{fee.month}</StyledTableCell>
                    <StyledTableCell>
                      {fee.isPaid ? "0" : fee.amount}
                    </StyledTableCell>
                    <StyledTableCell>
                      {fee.isPaid ? "Paid" : "Dues"}
                    </StyledTableCell>
                    <StyledTableCell sx={{ textAlign: "center" }}>
                      {!fee.isPaid && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            handlePayment(
                              fee.month,
                              isCurrentOrPast ? fee.amount : 1000
                            )
                          }
                        >
                          {isCurrentOrPast ? "Pay Now" : "Pay in Advance"}
                        </Button>
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );

  return <>{renderFeeTable()}</>;
};

export default FeePaymentPage;
