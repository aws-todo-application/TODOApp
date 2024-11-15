// src/components/CreateTaskForm.js
import React, { useState, useEffect } from "react";
import apiClient from "../api/apiClient";

const CreateTaskForm = ({ onAddTask, onEditTask, taskToEdit, onCancel }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("");
    const [deadline, setDeadline] = useState("");

    const userSession = JSON.parse(localStorage.getItem("userSession"));

    useEffect(() => {
        if (taskToEdit) {
            setTitle(taskToEdit.title);
            setDescription(taskToEdit.description);
            setPriority(taskToEdit.priority);
            setDeadline(taskToEdit.deadline);
        } else {
            setTitle("");
            setDescription("");
            setPriority("");
            setDeadline("");
        }
    }, [taskToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(title) {
            const user_id = userSession.idToken.payload.sub;
            const newTask = { title, description, priority, deadline: deadline || null, user_id };

            if (taskToEdit) {
                onEditTask({ ...taskToEdit, ...newTask });
            } else {
                try {
                    const response = await apiClient.post("/tasks", newTask);
                    onAddTask(response.data);
                } catch (error) {
                    console.error("Failed to create task:", error);
                }
            }
        }
        else {
            alert("Please enter a task name");
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-lg w-80"
            >
                <h2 className="text-xl font-semibold mb-4">
                    {taskToEdit ? "Edit Task" : "Add New Task"}
                </h2>
                
                <label className="block mb-2">
                    <span className="text-gray-700">Task Name</span>
                    <input
                        type="text"
                        className="block w-full mt-1 p-2 border rounded"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </label>

                <label className="block mb-4">
                    <span className="text-gray-700">Description</span>
                    <textarea
                        className="block w-full mt-1 p-2 border rounded"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </label>

                <label className="block mb-4">
                    <span className="text-gray-700">Priority</span>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="block w-full mt-1 p-2 border rounded"
                    >
                        <option value="">Select Priority</option>
                        <option value="P1">P1 - Highest</option>
                        <option value="P2">P2</option>
                        <option value="P3">P3</option>
                        <option value="P4">P4 - Lowest</option>
                    </select>
                </label>

                <label className="block mb-4">
                    <span className="text-gray-700">Deadline</span>
                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="block w-full mt-1 p-2 border rounded"
                    />
                </label>

                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        {taskToEdit ? "Save Changes" : "Add"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateTaskForm;
