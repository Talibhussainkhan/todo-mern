import Todo from "../model/Todo.js";

export const createTask = async (req, res)=>{
    try {
        const { text } = req.body;
        if(!text){
           return res.json({ success : false, message : "Text is required" })
        }
        await Todo.create({ text });
        res.json({  success : true, message : 'Todo added!' })
    } catch (error) {
        console.log(error.message)
        res.json({ success : false, message : error.message })
    }
}

export const getTodos = async (req, res) =>{
    try {
     const todos = await Todo.find({});
     res.json({ success : true, todos });   
    } catch (error) {
        console.log(error.message)
        res.json({ success : false, message : error.message })
    }
}

export const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        await Todo.findByIdAndDelete(id)
        res.json({ success : true, message : 'Todo deleted!' })
    } catch (error) {
        console.log(error.message)
        res.json({ success : false, message : error.message })
    }
}

export const editTodo  = async  (req, res) => {
    try {
      const { id } = req.params;
      const { text } = req.body;
    
      if(!text){
        return res.json({ success : false, message : "Text required!" })
      }
      
      await Todo.findByIdAndUpdate(id, { text })
      res.json({ success : true, message : 'Updated Successfully' })
    } catch (error) {
        console.log(error.message)
        res.json({  success : false, message: error.message })
    }
}