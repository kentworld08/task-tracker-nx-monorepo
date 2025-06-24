export interface TaskProps {
  id: string;
  text: string;
  day: string;
  reminder: boolean;
}

export interface FetchedDataFromApi {
  tasks: TaskProps[];
}
