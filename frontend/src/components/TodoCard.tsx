import type { SelectTodo } from "@/db/schema";
import { format } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { queryClient } from "../main";
import "./TodoCard.css";

type TodoCardProps = {
  todo: SelectTodo;
};

function TodoCard({ todo }: TodoCardProps) {
  const deleteMutation = useMutation({
    mutationFn: (todoId: number) => {
      return axios.delete(`/api/todos/${todoId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });

  const formattedDate = format(todo.dueDate, "MMM dd, yyyy");
  return (
    <div className="todo-card">
      <button className="circle">
        {todo.isCompleted && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </button>
      <div>
        <p>{todo.content}</p>
        <p>Due: {formattedDate}</p>
      </div>
      <button
        className="delete-button"
        onClick={() => deleteMutation.mutate(todo.id)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
          <path d="M3 6h18" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      </button>
    </div>
  );
}

export default TodoCard;
