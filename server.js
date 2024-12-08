const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require('cors')
const UserModel = require("./models/UserModel");
const TaskModel = require("./models/TaskModel");


app = express();
app.use(cors({origin:"*"}))
dotenv.config();
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log("MongoDB was connected successfully");
  })
  .catch((err) => {
    console.log(`Connection Error:${err}`);
  });

app.post("/register", async(req, res) => {
  try {
    const { name, email, password, confirmpassword } = req.body;
    const exist = await UserModel.findOne({ email });
    if (exist) {
      return res.status(400).send("User Already Registered",token);
    }
    if (password !== confirmpassword) {
      return res.status(401).send("password and confirmpassword should match");
    }

    let newUser = new UserModel({
      name,
      email,
      password,
      confirmpassword,
    });
    await newUser.save();
    console.log('User Registered Successfully')
    
    let payload = {
        user : {id: newUser.id}
    }

    jwt.sign(payload,process.env.SECREATE_KEY,{expiresIn:"12hours"},(err,token)=>{
        if(err) throw err
       
       console.log("Generated token",token)
       res.status(200).send({token})

    })



  } 
  catch(err){
    return res.status(500).send(`Internal Server Error ${err}`)
  }
});

app.post("/login", async(req,res)=>{
    const {name,email,password} = req.body
    const exist = await UserModel.findOne({email})
    console.log(name,password)

    if(!exist){
        return res.status(400).send("User does not Exist")
    }

    if(password!==exist.password){
        return res.status(400).send("Invalid password")
    }
    if(exist){
        return res.status(200).send("User successfully logined")
    }

    




    
})

app.post('/tasks',async(req,res)=>{
  
  try{
    const {title, description,status,priority} = req.body
  console.log("task details",title, description,status,priority)

  const newTask = new TaskModel({title, description,status,priority})
  const savedTask = await newTask.save()
  res.status(200).json(savedTask)


  }catch(err){
    console.log(err)
    res.status(500).send({error:"Internal server error"})
  }
})

app.get('/tasks',async(req,res)=>{
  try{
    const alltasks = await TaskModel.find()
   // console.log(alltasks)
   
   if (alltasks.length===0){
    return res.status(200).json({message:"No tasks found"})
   }
    res.status(200).json(alltasks)

  }catch(err){
    console.error('tasks not found',err)
    res.status(500).send({error: "Tasks are not found"})
  }
})

app.get('/tasks/:id',async(req,res)=>{
  try{
    const existedTask = await TaskModel.findById(req.params.id) 
    if (!existedTask){
      res.status(404).json({error:"Task Not found"})
    }
    res.status(200).json(existedTask)

  }catch(err){
    console.log('The specified task is not found')
    res.status(500).json({error:"Task is not found"})
  }
})

app.put('/tasks/:id',async(req,res)=>{
  try{
    const updatedtask = await TaskModel.findByIdAndUpdate(req.params.id,{...req.body},{new:true});
    if (!updatedtask){
      return res.status(404).json({error:"Task Not found"})
    }
    res.status(200).json(updatedtask)

  }catch(err){
    console.log('task is not found, which you trying to update',err)
    res.status(500).json({error:"Internal server error"})
  }
})

app.delete('/tasks/:id',async(req,res)=>{
  try{
    const deletedTask = await TaskModel.findByIdAndDelete(req.params.id)
    if (!deletedTask){
      res.status(404).send({error:"Task Not found"})
    }

    res.status(200).send('User deleted Successfully')

  }catch(err){
    console.log('task is not found, which you trying to delete',err)
    res.status(500).send({error:"Internal server error"})

  }
})

const PORT = process.env.PORT;

app.listen(PORT, (req, res) => {
  console.log(`Server is started and running ${PORT}`);
});
