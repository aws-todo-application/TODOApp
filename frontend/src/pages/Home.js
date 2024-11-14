// src/App.js
import React, { useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import CreateTaskForm from "../components/CreateTaskForm";

const App = () => {
    const [showForm, setShowForm] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [taskToEdit, setTaskToEdit] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await apiClient.get("/tasks");
                setTasks(response.data);
            } catch (error) {
                console.error("Failed to fetch tasks:", error);
            }
        };

        fetchTasks();
    }, []);

    const addTask = (newTask) => {
        setTasks([...tasks, newTask]);
        setShowForm(false);
    };

    const editTask = async (updatedTask) => {
        try {
            const response = await apiClient.put(`/tasks/${updatedTask.id}`, updatedTask);
            setTasks(tasks.map((task) => (task.id === updatedTask.id ? response.data : task)));
            setShowForm(false);
            setTaskToEdit(null);
        } catch (error) {
            console.error("Failed to update task:", error);
        }
    };

    const deleteTask = async (taskId) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await apiClient.delete(`/tasks/${taskId}`);
                setTasks(tasks.filter((task) => task.id !== taskId));
            } catch (error) {
                console.error("Failed to delete task:", error);
            }
        }
    };

    const toggleComplete = async (taskId) => {
        try {
            const response = await apiClient.patch(`/tasks/${taskId}/complete`);
            setTasks(tasks.map((task) =>
                task.id === taskId ? { ...task, completed: response.data.completed } : task
            ));
        } catch (error) {
            console.error("Failed to toggle task completion:", error);
        }
    };

    const handleEditClick = (task) => {
        setTaskToEdit(task);
        setShowForm(true);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">To-Do Tasks</h1>

            {/* Tasks Container */}
            <div className="relative bg-gray-100 p-4 rounded-lg shadow-md min-h-[80vh] overflow-y-auto overflow-x-hidden">
                <div className="space-y-4">
                    {tasks.sort((a, b) => a.id - b.id).map((task) => (
                        <div key={task.id} className={`bg-white p-4 rounded-lg shadow flex justify-between items-center ${task.completed ? "opacity-50" : ""}`}>
                            <div>
                                <span className={`font-semibold ${task.completed ? "line-through text-gray-500" : ""}`}>{task.title}</span>
                                <br />
                                <span className={`${task.completed ? "line-through text-gray-400" : "text-gray-500"}`}>{task.description}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => toggleComplete(task.id)}
                                    className={`text-${task.completed ? "gray" : "green"}-500 hover:underline bg-gray-300 rounded px-2 py-1`}
                                >
                                    {task.completed ? "Unmark" : "Complete"}
                                </button>
                                <button
                                    onClick={() => handleEditClick(task)}
                                    className="text-blue-500 bg-gray-300 rounded px-2 py-1 hover:underline"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className="text-red-500 bg-gray-300 rounded px-2 py-1 hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Add Task Button */}
                <button
                    onClick={() => {
                        setShowForm(true);
                        setTaskToEdit(null); // Clear taskToEdit for new task
                    }}
                    className="sticky m-4 bottom-4 right-4 float-right bg-blue-500 text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-blue-600"
                >
                    +
                </button>
            </div>

            {/* Conditional Render Form */}
            {showForm && (
                <CreateTaskForm
                    onAddTask={addTask}
                    onEditTask={editTask}
                    taskToEdit={taskToEdit}
                    onCancel={() => {
                        setShowForm(false);
                        setTaskToEdit(null);
                    }}
                />
            )}
        </div>
    );
};

export default App;
