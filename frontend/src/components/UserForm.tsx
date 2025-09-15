import type { FormEvent } from "react";
import styles from "./UserForm.module.css";
import { useState } from "react";

type UserFormProps = {
  submitHandler: (username: string, password: string) => void;
};
function UserForm({ submitHandler }: UserFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitHandler(username, password);
  };
  return (
    <form onSubmit={handleSubmit} className={styles.userForm}>
      <label htmlFor="username">username</label>
      <input
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        name="username"
        type="text"
      />

      <label htmlFor="password">password</label>
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        name="password"
        type="password"
      />
      <button>Submit</button>
    </form>
  );
}

export default UserForm;
