const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/Authentication");
const authorizeAdmin = require("../middleware/AdminOnly");
const adminController = require("../controller/adminController");

router.get("/users", authenticate, authorizeAdmin, adminController.getAllUsers);
router.get("/sale", authenticate, authorizeAdmin, adminController.getSales);
router.put("/user/:id/role", authenticate, authorizeAdmin, adminController.updateUserRole);
router.delete("/user/:id", authenticate, authorizeAdmin, adminController.deleteUser);

router.get("/products", authenticate, authorizeAdmin, adminController.getAllProducts);
router.delete("/product/:id", authenticate, authorizeAdmin, adminController.deleteProduct);

router.get("/admin-requests", authenticate, authorizeAdmin, adminController.getPendingAdmins);

module.exports = router;
