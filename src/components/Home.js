import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    id: null,
    name: "",
    Description: "",
    isCompleted: false,
  });
  const [editTaskId, setEditTaskId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ name: "", Description: "" });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/todos");
        setTasks(response.data);
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
        await axios.put(
          `http://localhost:5000/todo?id=${editTaskId}`,
          editedData
        );
        setIsEditing(false);
        fetchTasks();
      } catch (error) {
        console.error("Error updating task:", error);
      }
    } else {
      if (newTask.name.trim() || newTask.Description.trim()) {
        try {
          const response = await axios.post(
            "http://localhost:5000/todo",
            newTask
          );
          setTasks([...tasks, response.data]);
        } catch (error) {
          console.error("Error adding task:", error);
        }
      }
    }
    setNewTask({ id: null, name: "", Description: "", isCompleted: false });
    // Clear the editedData state as well
    setEditedData({ name: "", Description: "" });
  };

  const handleEditTask = (taskId) => {
    setEditTaskId(taskId);
    setIsEditing(true);
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setEditedData({
      name: taskToEdit.name,
      Description: taskToEdit.Description,
    });
  };

  const handleMarkAsCompleted = async (taskId) => {
    try {
      const taskToComplete = { id: taskId, isCompleted: true };
      // Send the task data to the backend to mark it as completed
      await axios.put(`http://localhost:5000/todo`, taskToComplete);
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
    setNewTask({ id: null, name: "", Description: "", isCompleted: false });
    setEditedData({ name: "", Description: "" }); // Clear editedData
  };

  const handleDeleteTask = async (taskId) => {
    try {
      // Include the task ID in the request body
      const taskToDelete = { id: taskId };

      // Send the task ID to the backend to delete the task
      await axios.delete(`http://localhost:5000/todo`, {
        data: taskToDelete,
      });

      // Filter out the deleted task from the local tasks state
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      // Include the task ID in the request body
      const updatedTaskData = { id: taskId, ...updatedData };

      // Send the updated data to the backend in the request body
      await axios.put(`http://localhost:5000/todo`, updatedTaskData);

      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, ...updatedData } : task
      );
      setTasks(updatedTasks);
      setIsEditing(false);
      setEditTaskId(null);
      setNewTask({ id: null, name: "", Description: "", isCompleted: false });
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
            value={isEditing ? editedData.name : newTask.name}
            onChange={(e) =>
              isEditing
                ? setEditedData({ ...editedData, name: e.target.value })
                : setNewTask({ ...newTask, name: e.target.value })
            }
          />
          <textarea
            rows="5"
            className="form-control mb-2"
            placeholder="Description"
            value={isEditing ? editedData.Description : newTask.Description}
            onChange={(e) =>
              isEditing
                ? setEditedData({ ...editedData, Description: e.target.value })
                : setNewTask({ ...newTask, Description: e.target.value })
            }
          />
          {!isEditing && (
            <button
              className="btn btn-primary btn-sm"
              onClick={handleAddTask}
              style={{ minWidth: "100px" }}
            >
              Add Task
            </button>
          )}
          {isEditing && (
            <div>
              <button
                className="btn btn-success btn-sm"
                onClick={() => handleUpdateTask(editTaskId, editedData)}
                style={{ minWidth: "100px" }}
              >
                Update
              </button>
              <button
                className="btn btn-danger btn-sm ml-2"
                onClick={handleCancelEdit}
                style={{ minWidth: "70px" }}
              >
                Cancel
              </button>
            </div>
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
                      value={editedData.name}
                      onChange={(e) =>
                        setEditedData({ ...editedData, name: e.target.value })
                      }
                    />
                    <textarea
                      rows="5"
                      className="form-control mb-2"
                      placeholder="Description"
                      value={editedData.Description}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          Description: e.target.value,
                        })
                      }
                    />
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
