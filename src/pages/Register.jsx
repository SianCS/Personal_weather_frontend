import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { registerSchema } from "../utils/validator";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { registerUser } from "../api";

function Register({ resetForm }) {
  const { handleSubmit, register, formState, reset } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onblur",
  });
  const { isSubmitting, errors } = formState;

  useEffect(() => {
    reset();
  }, [resetForm, reset]);

  const onSubmit = async (data) => {
    try {
      const resp = await registerUser(data);
      const successMsg = resp.data?.message || "Registration successful!";
      toast.success(successMsg, {
        position: "top-left",
      });
      reset()
    } catch (err) {
      const errMsg =
        err.response?.data?.message || err.message;
      toast.error(errMsg, {
        position: "top-left",
      });
    }
  };
  return (
    <div className="flex justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xs">
        <fieldset
          disabled={isSubmitting}
          className="fieldset bg-white border-base-300 rounded-box w-full border p-4 "
        >
          <legend className="fieldset-legend text-center text-[20px]">
            Register
          </legend>

          <label className="label text-black">Email</label>
          <input
            type="email"
            className="input bg-gray-100"
            placeholder="Email"
            {...register("email")}
          />
          <p className="text-sm text-error">{errors.email?.message}</p>

          <label className="label  text-black">Password</label>
          <input
            type="password"
            className="input bg-gray-100"
            placeholder="Password"
            {...register("password")}
          />
          <p className="text-sm text-error">{errors.password?.message}</p>

          <label className="label  text-black">ConfirmPassword</label>
          <input
            type="password"
            className="input bg-gray-100"
            placeholder="ConfirmPassword"
            {...register("confirmPassword")}
          />
          <p className="text-sm text-error">
            {errors.confirmPassword?.message}
          </p>

          <button className="btn btn-primary mt-4">Register</button>
        </fieldset>
      </form>
    </div>
  );
}
export default Register;
