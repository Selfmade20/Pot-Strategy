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
import { useState, useEffect } from "react";
import * as Yup from "yup";
import useFetch from "@/hooks/useFetch";
import { login } from "@/db/apiAuth";
import { useNavigate, useSearchParams } from "react-router-dom";

const Login = () => {
  const [errors, setErrors] = useState([]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const { data, loading, error, fetchData } = useFetch(login);

  useEffect(() => {
    if (data !== null || error !== null) {
      console.log("Login response:", data);
      console.log("Login error:", error);
    }
    if (error === null && data) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
  }, [data, error, longLink, navigate]);

  const handleLogin = async () => {
    setErrors([]);
    console.log("Form data being submitted:", formData);
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        password: Yup.string()
          .min(8, "Password must be at least 8 characters")
          .required("Password is required"),
      });
      await schema.validateSync(formData, { abortEarly: false });
      console.log(
        "Validation passed, calling fetchData with:",
        formData.email,
        formData.password
      );
      await fetchData(formData.email, formData.password);
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
        {error && <Error message={error.message} />}
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
          {loading ? <BeatLoader size={10} color="#fff" /> : "Login"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Login;
