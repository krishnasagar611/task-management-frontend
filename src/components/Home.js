import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ name: "", Description: "", isCompleted: false });
  const [editTaskId, setEditTaskId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/todos");
        setTasks(response.data); // Update tasks state with the data from the API
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks(); // Call the fetchTasks function when the component mounts
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/todos");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleAddTask = async () => {
    if (isEditing) {
      try {
        await axios.put(`http://localhost:5000/todo?id=${editTaskId}`, newTask);
        setIsEditing(false);
        fetchTasks();
      } catch (error) {
        console.error("Error updating task:", error);
      }
    } else {
      if (newTask.name.trim() || newTask.Description.trim()) {
        try {
          const response = await axios.post("http://localhost:5000/todo", newTask);
          setTasks([...tasks, response.data]);
        } catch (error) {
          console.error("Error adding task:", error);
        }
      }
    }
    setNewTask({ name: "", Description: "", isCompleted: false });
  };

  const handleEditTask = (taskId) => {
    setEditTaskId(taskId);
    setIsEditing(true);
  };

  const handleMarkAsCompleted = async (taskId) => {
    try {
      await axios.put(`http://localhost:5000/todo?id=${taskId}`, {
        isCompleted: true,
      });
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, isCompleted: true } : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error marking task as completed:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTaskId(null);
    setNewTask({ name: "", Description: "", isCompleted: false });
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/todo?id=${taskId}`);
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      await axios.put(`http://localhost:5000/todo?id=${taskId}`, updatedData);
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, ...updatedData } : task
      );
      setTasks(updatedTasks);
      setIsEditing(false);
      setEditTaskId(null);
      setNewTask({ name: "", Description: "", isCompleted: false });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <h2 className="text-center mt-4 mb-4">
            {isEditing ? "Edit Task" : "Add New Task"}
          </h2>
          <textarea
            rows="2"
            className="form-control mb-2"
            placeholder="name"
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          />
          <textarea
            rows="5"
            className="form-control mb-2"
            placeholder="Description"
            value={newTask.Description}
            onChange={(e) =>
              setNewTask({ ...newTask, Description: e.target.value })
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

        <div className="col-md-6">
          <h2 className="text-center mt-4">Task List</h2>
          <ul className="list-group">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`list-group-item ${
                  task.isCompleted ? "list-group-item-success" : ""
                }`}
              >
                {editTaskId === task.id ? (
                  <div>
                    <textarea
                      rows="3"
                      className="form-control mb-2"
                      placeholder="name"
                      value={newTask.name}
                      onChange={(e) =>
                        setNewTask({ ...newTask, name: e.target.value })
                      }
                    />
                    <textarea
                      rows="5"
                      className="form-control mb-2"
                      placeholder="Description"
                      value={newTask.Description}
                      onChange={(e) =>
                        setNewTask({
                          ...newTask,
                          Description: e.target.value,
                        })
                      }
                    />
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleUpdateTask(editTaskId, newTask)}
                      style={{ minWidth: "100px" }}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-danger btn-sm ml-2"
                      onClick={handleCancelEdit}
                      style={{ minWidth: "70px" }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <h5>{task.name}</h5>
                    <p>{task.Description}</p>
                    {!task.isCompleted && (
                      <div>
                        <button
                          className="btn btn-success btn-sm mr-1"
                          onClick={() => handleMarkAsCompleted(task.id)}
                          style={{ width: "100px" }}
                        >
                          Completed
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
                    {task.isCompleted && (
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
