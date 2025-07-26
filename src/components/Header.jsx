import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LinkIcon, LogOut } from "lucide-react";
import { UrlState } from "../context";
import { logout } from "../db/apiAuth";

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, fetchUser } = UrlState() || { user: null, isAuthenticated: false, fetchUser: () => {} };

  return (
    <nav className="py-2 px-4 sm:px-8 lg:px-16 flex justify-between items-center w-full">
      <Link to="/">
        <img
          src="/logo.png"
          className="h-14 sm:h-20 lg:h-24 ml-0 sm:ml-2 lg:ml-4 outline-none"
          alt="ShortLink logo"
        />
      </Link>

      <div>
        {!isAuthenticated ? (
          <Button
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-tr from-purple-500 to-purple-400 hover:bg-[#A99CFF] text-white"
          >
            Login
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="w-8 rounded-full overflow-hidden">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{user?.email || "User"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LinkIcon className="w-4 h-4 mr-2" />
                <span>My Links</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-500"
                onClick={async () => {
                  try {
                    await logout();
                    fetchUser();
                    navigate("/");
                  } catch (error) {
                    console.error("Logout error:", error);
                  }
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
};

export default Header;
