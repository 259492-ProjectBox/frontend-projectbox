import Image from "next/image";
import { redirect } from "next/navigation";
import { serverGetCookie } from "../utils/helpFunction";

export default function Home() {
  const token = serverGetCookie();
  if (token) redirect("/dashboard");
  return (
    <>
      <div className="h-screen w-full flex justify-center items-center" style={{ background: "linear-gradient(45deg, rgb(197, 97, 128), rgb(77, 51, 175))" }}>
        <div className="flex flex-col justify-center items-center bg-white bg-opacity-30 p-8 rounded-xl shadow-2xl w-10/12 md:w-1/2 lg:w-1/4" >
          <div className="flex flex-col justify-center items-center mb-8">
            <Image
              src="/logo-engcmu/RibbinENG2.png"
              width={100}
              height={100}
              alt="Engineering CMU Logo"
              className="mb-4"
            />
            <h1 className="text-3xl font-semibold text-white text-center mb-2">
              วิศวกรรมศาสตร์ มหาวิทยาลัยเชียงใหม่
            </h1>
            <h2 className="text-xl text-white mb-6">
              ระบบจัดเก็บข้อมูลโปรเจ็ค <span className="font-bold">Project Box</span>
            </h2>
          </div>
          <a href={process.env.NEXT_PUBLIC_CMU_OAUTH_URL} className="w-full">
            <button className="bg-white text-gray-800 font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-100 transition duration-300 w-full mb-4 flex items-center justify-center gap-3">
              <Image
                src="/logo-engcmu/RibbinENG2.png"
                width={30}
                height={30}
                alt="CMU Logo"
              />
              Sign in CMU Account
            </button>
          </a>
          <button className="bg-teal-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-teal-600 transition duration-300 w-full mb-4 flex items-center justify-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2V7m0 5v5m-4 4h12m-6 4h-6" />
            </svg>
            Search the Project
          </button>
          <p className="text-white text-sm mb-4">Don't have CMU Account?</p>
          <button className="bg-gray-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-700 transition duration-300 w-full">
            Guest Login
          </button>
        </div>
      </div>
    </>
  );
}
