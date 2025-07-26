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
import useFetch from "@/hooks/useFetch";
import { signup } from "@/db/apiAuth";
import { UrlState } from "../context";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [errors, setErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const { data, loading, error, fetchData } = useFetch(signup);
  const { fetchUser } = UrlState() || { fetchUser: () => {} };

  const handleSignup = async () => {
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
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password"), null], "Passwords must match")
          .required("Confirm password is required"),
      });
      await schema.validateSync(formData, { abortEarly: false });
      console.log(
        "Validation passed, calling signup with:",
        formData.email,
        formData.password
      );
      
      // Call the signup function directly instead of using useFetch
      const result = await signup(formData.email, formData.password);
      if (result) {
        fetchUser(); // Refresh user state
        navigate("/dashboard");
      }
    } catch (e) {
      console.log("Signup error:", e);
      if (e?.inner) {
        // Validation error
        const newErrors = {};
        e.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      } else {
        // API error
        setErrors({ general: e.message });
      }
    }
  };

  return (
    <Card className="mt-5">
      <CardHeader>
        <CardTitle>Signup</CardTitle>
        <CardDescription>Create a new account</CardDescription>
        {errors.general && <Error message={errors.general} />}
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
        <div className="space-y-1 relative">
          <div className="relative">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              onChange={handleInputChange}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <Error message={errors.password} />}
        </div>
        <div className="space-y-1 relative">
          <div className="relative">
            <Input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              onChange={handleInputChange}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && <Error message={errors.confirmPassword} />}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSignup}
          className="bg-gradient-to-tr from-purple-500 to-purple-400 text-white cursor-pointer"
        >
          {loading ? <BeatLoader size={10} color="#fff" /> : "Signup"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Signup;