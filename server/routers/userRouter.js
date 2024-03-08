const express=require("express");
const router=express.Router();

const { authenticateToken, authorizeRoles }=require("../middlewares/authMiddleware");
const { getProfile, updateProfile, deleteProfile, getAllUsers, getUserFromId, updateUser, deleteUser }=require("../controllers/userController");

router.use(authenticateToken);

router.get("/profile",getProfile);
router.patch("/profile",updateProfile);
router.delete("/profile",deleteProfile);

/* ADMIN ONLY */
router.use(authorizeRoles(["admin"]));
router.get("/",getAllUsers);
router.get("/:id",getUserFromId);
router.patch("/:id",updateUser);
router.delete("/:id",deleteUser);

module.exports=router;