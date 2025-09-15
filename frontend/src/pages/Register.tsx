import UserForm from "../components/UserForm";
import "./Register.module.css";
import { queryClient } from "../main";
import axios from "axios";
import { Link } from "react-router";
import { useNavigate } from "react-router";

function Register() {
  const navigate = useNavigate();
  const submitHandler = async (username: string, password: string) => {
    try {
      await axios.post("/api/auth/register", { username, password });
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
      <h2 className="text-center bold user-header">Register an account</h2>
      <UserForm submitHandler={submitHandler}></UserForm>
      <p className="text-center">
        Need to{" "}
        <Link className="bold" to={"/login"}>
          login
        </Link>{" "}
        to your account instead?
      </p>
    </>
  );
}

export default Register;
