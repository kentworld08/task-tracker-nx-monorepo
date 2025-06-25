// import NxWelcome from './nx-welcome';

// import { useState, useEffect } from 'react';
import {
  MdCheckCircle,
  MdRadioButtonUnchecked,
  MdDelete,
} from 'react-icons/md';
// import { TaskProps, FetchedDataFromApi } from './components/types';
import FetchAllTask from './components/Fetch-task-data';
import { Suspense } from 'react';

const API_BASE_URL = 'https://task-tracker-nx-monorepo-web-server.onrender.com';

function App() {
  const { tasksdata, loading, error, setError, fetchTasks } =
    FetchAllTask(API_BASE_URL);

  // Display error message if fetching failed
  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  // console.log will now only run AFTER data has loaded and is valid
  // Add a check here before logging the first element
  if (tasksdata.length > 0) {
    console.log('First task text:', tasksdata[0].text);
  } else {
    console.log('No tasks data available yet.');
  }

  const toggleReminder = async (id: string) => {
    console.log('Toggling reminder for ID:', id);
    const taskToToggle = tasksdata.find((task) => task.id === id);

    if (!taskToToggle) {
      console.error(`Task with ID ${id} not found for toggling.`);
      return;
    }

    // Determine the NEW reminder status
    const newReminderStatus = !taskToToggle.reminder;

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reminder: newReminderStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! Status: ${response.status}. Message: ${
            errorData.message || 'Unknown error'
          }`
        );
      }
      // After successful update on backend, re-fetch all tasks to update UI
      fetchTasks();
      console.log(`Reminder for task ${id} toggled successfully.`);
    } catch (err) {
      console.error('Failed to toggle reminder:', err);
      setError(`Failed to update task: ${(err as Error).message}`);
    }
  };

  // --- DELETE TASK FUNCTION (sends DELETE request) ---
  const handleDeleteTask = async (id: string) => {
    console.log('Deleting task with ID:', id);
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! Status: ${response.status}. Message: ${
            errorData.message || 'Unknown error'
          }`
        );
      }

      // After successful deletion on backend, re-fetch all tasks to update UI
      fetchTasks();
      console.log(`Task ${id} deleted successfully.`);
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError(`Failed to delete task: ${(err as Error).message}`);
    }
  };

  return (
    <div className="w-full bg-purple-900 h-screen flex items-center justify-center">
      <div className="max-w-[500px] my-[30px] mx-auto w-[400px] overflow-auto min-h-[300px] border-[1px] border-[#4682B4] p-[30px] rounded-[5px] max-h-[500px] h-[600px] shadow-sm bg-white">
        <div>
          <strong>React Task List</strong>
        </div>
        <Suspense fallback={`${loading && <p>Loading...</p>}`}>
          <ul className="w-full overflow-hidden overflow-y-auto ">
            {tasksdata.length > 0 ? (
              tasksdata.map((task) => (
                <li
                  key={task.id}
                  className={` bg-[#f4f4f4] m-[5px] px-[20px] py-[10px]${
                    task.reminder ? 'border-l-4 border-green-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <strong>{task.text}</strong>

                    <span className="flex gap-2 items-center cursor-pointer">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          toggleReminder(task.id);
                        }}
                      >
                        {task.reminder ? (
                          <MdCheckCircle size={24} color="green" />
                        ) : (
                          <MdRadioButtonUnchecked size={24} color="gray" />
                        )}
                      </button>

                      <button
                        type="button"
                        className="bg-none border-none cursor-pointer text-red-500 ml-[10px]"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleDeleteTask(task.id);
                        }}
                      >
                        <MdDelete size={20} />
                      </button>
                    </span>
                  </div>
                  <p>{task.day}</p>
                </li>
              ))
            ) : (
              <p>No tasks found.</p>
            )}
          </ul>
        </Suspense>
      </div>
    </div>
  );
}

export default App;
