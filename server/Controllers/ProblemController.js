const Problem = require('../models/problemsModel');
const User = require('../models/UserModel');
const googleUser = require('../models/googleusermodel')

exports.getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find();
    res.status(200).json(problems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.enterPInDatabase = async(req,res,next) => {
  try{
      const {title,topic,difficulty,description,constraints,inputFormat,outputFormat,examples}=req.body;
      errors = {};
      const existingProblem = await Problem.findOne({ title });
        if (existingProblem) {
            errors.message = "Problem already exists";
            return res.status(400).json({ errors });
        }
        const problem = await Problem.create(req.body);
        res.status(201).json({ message: "Problem successfully added",success:true});
        next();
  }
  catch(error){
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

exports.delPfromDatabase = async (req,res) => {
  try{
     errors={};
     const id = req.params.id;
     await Problem.findByIdAndDelete(id);
     res.status(201).json({ message: "Problem successfully deleted",success:true});
  }
  catch(error){
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

exports.updatePInDatabase = async (req,res) => {
  try{
     const id = req.params.id;
     const updatedProblem = await Problem.findByIdAndUpdate(
      {_id:id},
      req.body,
      {new:true}
     )
     res.status(201).json({ message: "Problem successfully updated",success:true,updatedProblem});
  }
  catch(error){
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

exports.getProblem = async(req,res) => {
  try{
     const id = req.params.id;
     const p_by_id = await Problem.findById(id);
     res.status(201).json({p_by_id});
  }
  catch(error){
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

exports.addProblemInUser = async(req,res) => {
  const {userId,problemId} = req.body;
  errors={};
  try{
    let user = await User.findById(userId);
    if (!user) {
    user = await googleUser.findById(userId);
      if (!user) {
        errors.message = "No such user exists";
        return res.status(400).json({ errors });
      }
   }
   console.log(problemId);
   if (!user.solvedProblems.includes(problemId)) { 
    user.solvedProblems.push(problemId);
    await user.save();
   }
   res.status(201).json({ message: "Problem successfully submitted",success:true});
  }
  catch(error){
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}