const express=require("express");
const router=express.Router();

const { authenticateToken, authorizeRoles }=require("../middlewares/authMiddleware");
const teamController=require("../controllers/teamController");

router.use(authenticateToken);

router.get("/",teamController.getTeamsOfUser);
router.get("/:id",teamController.getTeamById);
router.post("/",teamController.createTeam);
router.patch("/:id",teamController.updateTeam);

router.post("/:id/invite",teamController.inviteByEmail);

router.get("/admin",authorizeRoles(['admin']),teamController.getAllTeams);
router.delete("/:id",authorizeRoles(['admin']),teamController.deleteTeam);

module.exports=router;


/*
after login they are asked to create a team with name, and invite a person through mail
they can invite through mail
they can edit the team details like name, (all members of team)
they can remove a member from team (owner of team)
admin routes can be added but no admin dashboard?
admin can do all CRUD of teams
 */