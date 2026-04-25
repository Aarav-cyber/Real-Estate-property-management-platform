const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { addPayment, getPayments, createOrder, verifyPayment, deletePayment } = require("../controllers/paymentController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");



router.post("/create-order", authMiddleware, createOrder);
router.post("/verify", authMiddleware, verifyPayment);

// Tenant pays or Manager records
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["tenant", "manager"]),
  [
    body("propertyId").notEmpty().withMessage("Property ID required"),
    body("amount").isNumeric().withMessage("Amount must be number"),
    body("status").optional().isIn(["paid", "pending"]).withMessage("Invalid status"),
  ],
  addPayment
);

// View payments
router.get("/", authMiddleware, getPayments);

// Manager can delete
router.delete("/:id", authMiddleware, roleMiddleware(["manager"]), deletePayment);

module.exports = router;