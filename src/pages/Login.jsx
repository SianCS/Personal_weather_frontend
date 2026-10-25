import { useState } from "react";
import useUserStore from "../stores/userStore";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../utils/validator";
import { toast } from "react-toastify";
import Register from "./Register";
import { getErrorMessage } from "../api";

function Login() {
  const [resetForm, setResetForm] = useState(false);
  const login = useUserStore((state) => state.login);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const hdlClose = () => {
    setResetForm((prv) => !prv);
    reset()
  };

  const hdlLogin = async (data) => {
    try {
      const resp = await login(data);
      toast.success(resp.data.message, {
        position: "top-left",
      });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };
  return (
    <div className="flex justify-center">
      <form onSubmit={handleSubmit(hdlLogin)} className="w-full max-w-xs">
        <fieldset className="fieldset bg-white border-base-300 rounded-box w-full border p-4 ">
          <legend className="fieldset-legend text-center text-[20px]">
            Login
          </legend>

          <label className="label text-black">Email</label>
          <input
            type="email"
            className="input bg-gray-100"
            placeholder="Email"
            {...register("email")}
          />
          {errors.email?.message && (
            <p className="text-sm text-error">{errors.email.message}</p>
          )}

          <label className="label  text-black">Password</label>
          <input
            type="password"
            className="input bg-gray-100"
            placeholder="Password"
            {...register("password")}
          />
          {errors.password?.message && (
            <p className="text-sm text-error">{errors.password.message}</p>
          )}
          {!isSubmitting && (
            <button className="btn btn-primary text-xl">Login</button>
          )}
          {isSubmitting && (
            <button className="btn btn-primary text-xl">
              Login
              <span className="loading loading-bars loading-md"></span>
            </button>
          )}

          <div className="divider my-0"></div>
          <button
            type="button"
            className="btn btn-primary text-lg"
            onClick={() => document.getElementById("register-form").showModal()}
          >
            Create new account
          </button>
        </fieldset>
      </form>
      <dialog id="register-form" className="modal" onClose={hdlClose}>
        <div className="modal-box">
          <Register resetForm={resetForm} />
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
        </div>
      </dialog>
    </div>
  );
}
export default Login;
