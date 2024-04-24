import Link from "next/link";
import {PowerIcon} from "@heroicons/react/24/outline";

export function Deconnexion(){


  function onDeconnexion(){
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
  }

  return(
    <form>
      <Link href={`/login`}>
        <button onClick={() => onDeconnexion()} className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
          <PowerIcon className="w-6" />
          <div className="hidden md:block">Déconnexion</div>
        </button>
      </Link>
    </form>
  )
}
