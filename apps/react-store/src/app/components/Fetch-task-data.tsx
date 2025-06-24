import { useEffect, useState, useCallback } from 'react';
import { FetchedDataFromApi, TaskProps } from './types';

const FetchAllTask = (url: string) => {
  const [tasksdata, setTasksData] = useState<TaskProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${url}/api/data`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the JSON response. It will be the entire object: { tasks: [...]}
      const data: FetchedDataFromApi = await response.json();

      setTasksData(data.tasks);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError(`Failed to load tasks: ${(err as Error).message}`);
      setTasksData([]); // Set to empty array on error
    } finally {
      setLoading(false); // Stop loading regardless of outcome
    }
  }, [url]);

  useEffect(() => {
    fetchTasks();

    //👇  Listens to a change event (e.g., from an Angular part of the monorepo)
    const handleTaskAdded = () => fetchTasks();

    window.addEventListener('task-added', handleTaskAdded);

    return () => window.removeEventListener('task-added', handleTaskAdded);
  }, [fetchTasks]);

  return {
    tasksdata,
    loading,
    error,
    setError,
    fetchTasks,
  };
};
export default FetchAllTask;
