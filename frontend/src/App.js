// src/App.js
import React, { useState, useEffect } from "react";
import apiClient from "./api/apiClient";
import CreateTaskForm from "./components/CreateTaskForm";

const App = () => {
    const [showForm, setShowForm] = useState(false);
    const [tasks, setTasks] = useState([]);

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

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">To-Do Tasks</h1>

            {/* Tasks Container */}
            <div className="relative bg-gray-100 p-4 rounded-lg shadow-md min-h-[80vh] overflow-y-auto overflow-x-hidden">
                <div className="space-y-4">
                    {tasks.map((task) => (
                        <div key={task.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                            <div>
                                <span className="font-semibold">{task.title}</span>
                                <br/>
                                <span className="text-gray-500">{task.description}</span>
                            </div>
                            {/* Priority */}
                        </div>
                    ))}
                </div>

                {/* Add Task Button */}
                <button
                    onClick={() => setShowForm(true)}
                    className="sticky top-[93%] left-[93%] bg-blue-500 text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-blue-600"
                >
                    +
                </button>
            </div>

            {/* Conditional Render Form */}
            {showForm && (
                <CreateTaskForm
                    onAddTask={addTask}
                    onCancel={() => setShowForm(false)}
                />
            )}
        </div>
    );
};

export default App;
