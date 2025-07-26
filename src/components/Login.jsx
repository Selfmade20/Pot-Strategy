import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { BeatLoader } from "react-spinners";
import Error from "./Error";
import { useState } from "react";
import * as Yup from "yup";

const Login = () => {
  const [errors, setErrors] = useState([]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        password: Yup.string()
          .min(8, "Password must be at least 8 characters")
          .required("Password is required"),
      });
      schema.validateSync(formData, { abortEarly: false });
    } catch (e) {
      const newErrors = {};

      e?.inner?.forEach((error) => {
        newErrors[error.path] = error.message;
      });

      setErrors(newErrors);
    }
  };

  return (
    <Card className="mt-5">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>to your account if you have one</CardDescription>
        <Error message="some error message" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Input
            name="email"
            type="email"
            placeholder="Enter your email"
            onChange={handleInputChange}
          />
          {errors.email && <Error message={errors.email} />}
        </div>
        <div className="space-y-1">
          <Input
            name="password"
            type="password"
            placeholder="Enter your password"
            onChange={handleInputChange}
          />
          {errors.password && <Error message={errors.password} />}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleLogin}
          className="bg-gradient-to-tr from-purple-500 to-purple-400 text-white cursor-pointer"
        >
          {true ? <BeatLoader size={10} color="#fff" /> : "Login"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Login;
