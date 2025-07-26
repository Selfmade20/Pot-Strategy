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

const Login = () => {
  const [error, setError] = useState("");

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

  const handleLogin =  () => {

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
          <Error message={"some error message"} />
        </div>
        <div className="space-y-1">
          <Input
            name="password"
            type="password"
            placeholder="Enter your password"
            onChange={handleInputChange}
          />
          <Error message="some error message" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="bg-gradient-to-tr from-purple-500 to-purple-400 text-white">
          {true ? <BeatLoader size={10} color="#fff" /> : "Login"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Login;
