import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [editTaskId, setEditTaskId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  // Function to fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/todo");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleAddTask = async () => {
    if (isEditing) {
      try {
        await axios.put("http://localhost:3000/todo", {
          id: editTaskId,
          ...newTask,
        });
        setIsEditing(false);
        // Fetch the updated task list
        fetchTasks();
      } catch (error) {
        console.error("Error updating task:", error);
      }
    } else {
      if (newTask.title.trim() || newTask.description.trim()) {
        try {
          const response = await axios.post("http://localhost:3000/todo", newTask);
          setTasks([...tasks, response.data]);
        } catch (error) {
          console.error("Error adding task:", error);
        }
      }
    }
    setNewTask({ title: "", description: "" });
  };

  const handleEditTask = (taskId) => {
    setEditTaskId(taskId);
    setIsEditing(true);
  };

  const handleMarkAsCompleted = async (taskId) => {
    try {
      await axios.put(`http://localhost:3000/todo?id=${taskId}`, {
        completed: true,
      });
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, completed: true } : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error marking task as completed:", error);
    }
  };

  const handleSaveEdit = async (taskId, editedTask) => {
    try {
      await axios.put("http://localhost:3000/todo", {
        id: taskId,
        ...editedTask,
      });
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, ...editedTask } : task
      );
      setTasks(updatedTasks);
      setEditTaskId(null);
    } catch (error) {
      console.error("Error saving edited task:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTaskId(null);
    setNewTask({ title: "", description: "" });
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:3000/todo?id=${taskId}`);
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="container mt-4">
    <div className="row">
      {/* Add Task Section */}
      <div className="col-md-6">
        <h2 className="text-center mt-4 mb-4">
          {isEditing ? "Edit Task" : "Add New Task"}
        </h2>
        <textarea
          rows="2"
          className="form-control mb-2"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <textarea
          rows="5"
          className="form-control mb-2"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        />
        <button
          className="btn btn-primary btn-sm"
          onClick={handleAddTask}
          style={{ minWidth: "100px" }}
        >
          {isEditing ? "Update Task" : "Add Task"}
        </button>
        {isEditing && (
          <button
            className="btn btn-danger btn-sm ml-2"
            onClick={handleCancelEdit}
            style={{ minWidth: "70px" }}
          >
            Cancel
          </button>
        )}
      </div>

      {/* Task List Section */}
      <div className="col-md-6">
        <h2 className="text-center mt-4">Task List</h2>
        <ul className="list-group">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`list-group-item ${
                task.completed ? "list-group-item-success" : ""
              }`}
            >
              {editTaskId === task.id ? (
                <div>
                  <textarea
                    rows="3"
                    className="form-control mb-2"
                    placeholder="Title"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                  />
                  <textarea
                    rows="5"
                    className="form-control mb-2"
                    placeholder="Description"
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        description: e.target.value,
                      })
                    }
                  />
                  <button
                    className="btn btn-success btn-sm mr-2"
                    onClick={() => handleSaveEdit(editTaskId, newTask)}
                    style={{ minWidth: "100px" }}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={handleCancelEdit}
                    style={{ minWidth: "70px" }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  <h5>{task.title}</h5>
                  <p>{task.description}</p>
                  {!task.completed && (
                    <div>
                      <button
                        className="btn btn-success btn-sm mr-1"
                        onClick={() => handleMarkAsCompleted(task.id)}
                        style={{ width: "100px" }}
                      >
                        Mark as Completed
                      </button>
                      <button
                        className="btn btn-primary btn-sm mr-1"
                        onClick={() => handleEditTask(task.id)}
                        style={{ width: "70px" }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteTask(task.id)}
                        style={{ width: "70px" }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                  {task.completed && (
                    <span className="text-success"> - Completed</span>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);
};


export default Home;
