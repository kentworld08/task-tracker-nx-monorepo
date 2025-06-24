// interface TaskProps {
//   id: string;
//   text: string;
//   day: string;
//   reminder: boolean;
// }

// interface FetchedDataFromApi {
//   tasks: TaskProps[];
// }

// const ToggleReminder = async (
//   id: string,
//   url: string,
//   task: FetchedDataFromApi
// ) => {
//   // <-- The 'id' parameter is received here
//   // ... (find taskToToggle using this 'id') ...

//   const newReminderStatus = !task.reminder;

//   try {
//     // THIS IS THE CRUCIAL PART: Consuming the 'id' to build the URL
//     const response = await fetch(`${url}/api/tasks/${id}`, {
//       // <-- 'id' is embedded directly into the URL
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ reminder: newReminderStatus }),
//     });

//     // ... (rest of the function: check response, fetchTasks, error handling) ...
//   } catch (err) {
//     console.error('Failed to toggle reminder:', err);
//   }
// };
// export default ToggleReminder;
