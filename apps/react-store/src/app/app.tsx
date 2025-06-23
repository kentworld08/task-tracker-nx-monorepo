// import NxWelcome from './nx-welcome';

import React, { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    fetch('https://task-tracker-monorepo-web.onrender.com/tasks')
      .then((res) => res.json)
      .then((d) => console.log(d));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // const fetchTasks = () => {
  //   fetch('https://task-tracker-nx-monorepo.onrender.com')
  //     .then((res) => res.json())
  //     .then((data) => setTasks(data));
  // };

  // useEffect(() => {
  //   fetchTasks();
  //   const handleTaskAdded = () => fetchTasks();

  //   window.addEventListener('task-added', handleTaskAdded);
  //   return () => window.removeEventListener('task-added', handleTaskAdded);
  // }, []);
  console.log(tasks);

  return (
    <div>
      <h1>Task List</h1>
      <ul>
        {/* {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))} */}
      </ul>
    </div>
  );
}

export default App;
