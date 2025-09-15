import UserForm from "../components/UserForm";
import { Link } from "react-router";
import axios from "axios";
import { queryClient } from "../main";
import { useNavigate } from "react-router";

function Login() {
  const navigate = useNavigate();

  const submitHandler = async (username: string, password: string) => {
    try {
      await axios.post("/api/auth/login", { username, password });
      queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });
      navigate("/");
    } catch (err: unknown) {
      console.error(err);
      alert("unable to login");
    }
  };

  return (
    <>
      <h2 className="user-header bold text-center">Login</h2>
      <UserForm submitHandler={submitHandler} />
      <p className="text-center">
        Need to{" "}
        <Link className="bold" to={"/register"}>
          register
        </Link>{" "}
        an account instead?
      </p>
    </>
  );
}

export default Login;
