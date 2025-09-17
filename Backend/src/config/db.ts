
import mongoose,{ Schema,model,Model,Document } from "mongoose";
import dotenv from "dotenv"

dotenv.config()
mongoose
.connect(process.env.MONGO_URL as string)
.then(()=>{
    console.log("connected to database ")
})
.catch((err)=>{
console.log(err,"failed to connect to database")
})

const userSchema = new Schema({
    username:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true}
})
export interface ITask extends Document {
  title: string;
  description: string;
  completed: boolean;
  priority: "Low" | "Medium" | "High";
  dueDate?: Date;
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
}
const taskSchema = new Schema<ITask>({
    title:{type:String,required:true},
    description:{type:String,required:true,default:""},
    completed:{type:Boolean,default:false} ,
    priority:{type:String,enum:['Low','Medium','High'],default:'Low'},
    dueDate:{type:Date},
    owner:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true },
    createdAt:{type:Date,default:Date.now}

})
export  const UserModel = model("User",userSchema)
const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>("Task", taskSchema);

export default Task;