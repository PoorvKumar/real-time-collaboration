const express=require("express");
const router=express.Router();

const { authenticateToken, authorizeRoles }=require("../middlewares/authMiddleware");
const teamController=require("../controllers/teamController");

router.use(authenticateToken);

router.get("/",authorizeRoles(['admin']),teamController.getAllTeams);
router.get("/:id",teamController.getTeamById);
router.post("/",teamController.createTeam);
router.patch("/:id",teamController.updateTeam);
router.delete("/:id",teamController.deleteTeam);

module.exports=router;