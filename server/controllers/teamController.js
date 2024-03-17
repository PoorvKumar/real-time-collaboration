const Team=require("../models/team");

const getAllTeams=async (req,res,next)=>
{
    try
    {
        const teams=await Team.find();
        return res.status(200).json(teams);
    }
    catch(err)
    {
        next(err);
    }
};

const getTeamsOfUser=async (req,res,next)=>
{
    try
    {
        const user=req.user;
        await user.populate('teams');

        return res.json(user.teams);
    }
    catch(err)
    {
        next(err);
    }
};

const getTeamById=async (req,res,next)=>
{
    try
    {
        const team = await Team.findById(req.params.id);
        if (!team) 
        {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.status(200).json(team);
    }
    catch(err)
    {
        next(err);
    }
};

const createTeam=async (req,res,next)=>
{
    try
    {
        const { name }=req.body;
        const team=new Team({
            name,
            owner: req.user._id,
            workspaces: [],
            members: [ req.user._id ]
        });

        await team.save();
        const user=req.user;
        user.teams.push(team._id);

        await user.save();

        return res.status(201).json(team);
    }
    catch(err)
    {
        next(err);
    }
};

const updateTeam=async (req,res,next)=>
{
    try
    {
        const { id }=req.params;



        const team=await Team.findByIdAndUpdate(id,{

        })
        return res.json(teams);
    }
    catch(err)
    {
        next(err);
    }
};

const deleteTeam=(req,res,next)=>
{
    
};

const inviteByEmail=(req,res,next)=>
{

};

module.exports={
    getAllTeams,
    getTeamsOfUser,
    getTeamById,
    createTeam,
    updateTeam,
    deleteTeam,
    inviteByEmail,
};