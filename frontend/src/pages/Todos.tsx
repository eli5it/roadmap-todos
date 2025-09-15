import styles from "./Todos.module.css";
import { useState } from "react";
import axios from "axios";
import type { SelectTodo } from "@/db/schema";
import type { InsertTodo } from "@/db/schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "../main";
import type { FormEvent } from "react";
import TodoCardList from "../components/TodoCardList";
import { Plus } from "lucide-react";

function TodosPage() {
  const [content, setContent] = useState("");
  const [dueDate, setDueDate] = useState(new Date());

  const getTodos = async (): Promise<SelectTodo[]> => {
    const response = await axios.get<SelectTodo[]>("/api/todos");
    return response.data;
  };

  const todosQuery = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  const mutation = useMutation({
    mutationFn: (newTodo: InsertTodo) => {
      return axios.post("/api/todos", newTodo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });

  function submitHandler(e: FormEvent) {
    e.preventDefault();
    mutation.mutate({
      content,
      dueDate: new Date(),
      userId: 2,
    });
  }

  const todos: SelectTodo[] = todosQuery.data ?? [];

  return (
    <main className={styles.todoMain}>
      <div className={styles.formWrapper}>
        <form onSubmit={submitHandler} className={styles.todoForm}>
          <input
            placeholder="Add a new todo..."
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <input
            type="date"
            value={dueDate.toISOString().split("T")[0]}
            onChange={(e) => setDueDate(new Date(e.target.value))}
          />
          <button
            className={styles.submitButton}
            type="submit"
            aria-label="Add todo"
          >
            <Plus />
          </button>
        </form>
      </div>

      <TodoCardList todos={todos} />
    </main>
  );
}

export default TodosPage;
