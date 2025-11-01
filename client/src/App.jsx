import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Plus, Trash2, Edit3, Save } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const addTodo = async (newTodo) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/todos/create`,
    newTodo
  );
  return res.data;
};

const getTodo = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/todos/get`);
  return res.data;
};

const deleteTodoFn = async (id) => {
  const res = await axios.delete(
    `${import.meta.env.VITE_API_URL}/api/todos/${id}`
  );
  return res.data;
};

const updateTodoFn = async ({ id, text }) => {
  const res = await axios.patch(
    `${import.meta.env.VITE_API_URL}/api/todos/${id}`,
    { text }
  );
  return res.data;
};

const App = () => {
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const queryClient = useQueryClient();

  const { isPending, mutate: addMutate } = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
      setInput("");
    },
    onError: (error) => {
      console.error("Error adding todo:", error);
    },
  });

  const { data: todos, error } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodo,
  });

  const { mutate: deleteMutate, isPending: deletePending } = useMutation({
    mutationFn: deleteTodoFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["todos"]);
      toast.success(data.message || "Todo deleted successfully!");
    },
  });

  const { mutate: editMutate, isPending: editPending } = useMutation({
    mutationFn: updateTodoFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["todos"]);
      toast.success(data.message || "Todo updated successfully!");
    },
    onError: (error) => {
      toast.error("Error Occured!");
    },
  });

  const addOrUpdateTodo = () => {
    if (!input.trim()) return;

    if (editId) {
      editMutate({ id: editId, text: input });
      setEditId(null);
      setInput("");
    } else {
      if (!input.trim()) return;
      addMutate({ text: input });
    }
  };

  const deleteTodo = (id) => {
    deleteMutate(id);
  };

  const startEdit = (todo) => {
    setEditId(todo._id);
    setInput(todo.text);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-100 to-orange-200 flex items-center justify-center p-2 md:p-4">
      <Toaster />
      <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl w-full max-w-md p-6 h-full overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Todo App
        </h1>

        <div className="flex gap-2 mb-5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={editId ? "Update your task..." : "Add a new task..."}
            className="flex-1 px-2 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            onClick={addOrUpdateTodo}
            disabled={isPending || editPending}
            className={`${
              editId
                ? "bg-green-500 hover:bg-green-600"
                : `bg-amber-400 hover:bg-amber-500 ${
                    isPending && "cursor-not-allowed"
                  }`
            } text-white px-2 md:px-4 py-2 rounded-lg transition flex items-center justify-center`}
          >
            {editId ? <Save size={18} /> : <Plus size={18} />}
          </button>
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {todos?.todos.length === 0 && (
            <p className="text-gray-500 text-center">No tasks yet!</p>
          )}

          {todos?.todos.map((todo) => (
            <div
              key={todo._id}
              className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl p-3 shadow-sm"
            >
              <div className="flex items-center gap-3 cursor-pointer w-full">
                <span className="text-gray-700 break-all max-w-[85%] overflow-hidden">
                  {todo.text}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Edit3
                  size={18}
                  className="text-blue-400 hover:text-blue-600 cursor-pointer transition"
                  onClick={() => startEdit(todo)}
                />
                <Trash2
                  size={18}
                  className="text-red-400 hover:text-red-600 cursor-pointer transition"
                  onClick={() => deleteTodo(todo._id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
