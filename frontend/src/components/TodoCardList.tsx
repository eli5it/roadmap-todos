import TodoCard from "./TodoCard";
import type { SelectTodo } from "@/db/schema";
import "./TodoCardList.css";

type TodoCardListProps = {
  todos: SelectTodo[];
};
function TodoCardList({ todos }: TodoCardListProps) {
  return (
    <ul className="todo-card-list">
      {todos.map((todo) => (
        <TodoCard todo={todo} key={todo.id} />
      ))}
    </ul>
  );
}

export default TodoCardList;
