import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Signup from "@/components/Signup";
import Login from "@/components/Login";

const Auth = () => {
  const [searchParams] = useSearchParams();

  return (
    <div className="mt-15 flex flex-col items-center gap-10">
      <h1 className="text-5xl font-extrabold">
        {searchParams.get("createNew") ? (
          <span className="bg-gradient-to-tr from-purple-500 to-purple-400 bg-clip-text text-transparent">
            Hold up! Let's login first...
          </span>
        ) : (
          <span className="bg-gradient-to-tr from-purple-500 to-purple-400 bg-clip-text text-transparent">
            Login or Signup
          </span>
        )}
      </h1>
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2 border border-gray-200 shadow-md bg-white rounded-xl">
          <TabsTrigger
            value="login"
            className="data-[state=active]:bg-gradient-to-tr data-[state=active]:from-purple-500 data-[state=active]:to-purple-400 data-[state=active]:text-white data-[state=active]:hover:bg-[#A99CFF] cursor-pointer"
          >
            Login
          </TabsTrigger>
          <TabsTrigger
            value="signup"
            className="data-[state=active]:bg-gradient-to-tr data-[state=active]:from-purple-500 data-[state=active]:to-purple-400 data-[state=active]:text-white data-[state=active]:hover:bg-[#A99CFF] cursor-pointer"
          >
            Signup
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login />
        </TabsContent>
        <TabsContent value="signup">
          <Signup />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Auth;
