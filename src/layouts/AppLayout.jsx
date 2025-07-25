import Header from "@/components/Header";
import { Outlet } from "react-router-dom";


const AppLayout = () => {

  return (
    <div> 
        <main className="min-h-screen container m-8">
            <Header/>
            <Outlet />
        </main>


        <div className="p-10 text-center text-sm text-gray-500">
          Built by <a href="https://github.com/Selfmade20" target="_blank" rel="noopener noreferrer">Tebogo Selamolela</a>
        </div>
    </div>
  )
}

export default AppLayout