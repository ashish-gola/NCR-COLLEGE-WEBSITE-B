import mongoose, {Schema} from "mongoose"

const userSchema = new Schema({
    username:{
        type: String,
        required:true,
        unique : true,
        trim:true,
        index:true
    },
    email:{
        type: String,
        required:true,
        unique : true,
        lowercase:true,
        trim:true
    },
   
  
    password:{
         type: String, 
         required:[true,"Password is Required"]
    },
    

},
{
timestamps:true
})



export const User = mongoose.model("User", userSchema);