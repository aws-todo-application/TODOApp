// src/App.js
import React, { useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import CreateTaskForm from "../components/CreateTaskForm";

// Images
import redFlag from '../images/redFlag.png';
import orangeFlag from '../images/orangeFlag.png';
import blueFlag from '../images/blueFlag.png';
import blankFlag from '../images/blankFlag.png';

const Home = ({ onLogout }) => {
    const [showForm, setShowForm] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [taskToEdit, setTaskToEdit] = useState(null);

    const userSession = JSON.parse(localStorage.getItem("userSession"));

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await apiClient.get("/tasks", {
                    params: { user_id: userSession.idToken.payload.sub }, // Use Cognito ID as user_id
                });
                setTasks(response.data);
            } catch (error) {
                console.error("Failed to fetch tasks:", error);
            }
        };

        fetchTasks();
    }, []);

    const getPriorityClass = (priority) => {
        switch (priority) {
            case "P1":
                return redFlag;
            case "P2":
                return orangeFlag;
            case "P3":
                return blueFlag;
            case "P4":
                return blankFlag;
            default:
                return "";
        }
    };

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
            <h1 className="text-3xl font-bold mb-6">To-Do List</h1>
            <button onClick={onLogout} className="text-blue-500 underline">
                    Logout
            </button>
            {/* Tasks Container */}
            <div className="relative bg-gray-100 p-4 rounded-lg shadow-md min-h-[80vh] overflow-y-auto overflow-x-hidden">
                <div className="space-y-4">
                    {tasks.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()).map((task) => (
                        <div key={task.id} className={`bg-white p-4 rounded-lg shadow flex justify-between items-center ${task.completed ? "opacity-50" : ""}`}>
                            <div>
                                <span className={`font-semibold ${task.completed ? "line-through text-gray-500" : ""}`}>{task.title}</span>
                                <img src={`${getPriorityClass(task.priority)}`} className="inline-block w-4 h-4 ml-2"/>
                                {!task.completed && <>
                                <br />
                                <span className={`${task.completed ? "line-through text-gray-400" : "text-gray-500"}`}>{task.description}</span>
                                {task.deadline && (
                                    <p className="text-gray-600 mt-1">
                                        {(new Date(task.deadline).getTime() < Date.now() ? "Overdue • " : "") + new Date(task.deadline).toUTCString().slice(0, -13)}
                                    </p>
                                )} </>
                                }
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

export default Home;
