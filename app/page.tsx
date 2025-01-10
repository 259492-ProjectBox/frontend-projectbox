import Image from "next/image";
import { redirect } from "next/navigation";
import { serverGetCookie } from "../utils/helpFunction";

export default function Home() {
  const token = serverGetCookie();
  if (token) redirect("/dashboard");
  return (
    <>
      <div
        className="h-screen w-full flex justify-center items-center"
        style={{
          background:
            "linear-gradient(45deg, rgb(197, 97, 128), rgb(77, 51, 175))",
        }}
      >
        <div className="flex flex-col justify-center items-center bg-neutral-400 bg-opacity-30 p-8 rounded-xl shadow-2xl w-10/12 md:w-1/2 lg:w-1/4">
          <div className="flex flex-col justify-center items-center mb-4">
            <Image
              src="/logo-engcmu/cmu_eng.png"
              width={240}
              height={240}
              alt="Engineering CMU Logo"
              className="mb-4"
            />
            <h2 className="text-xl text-white text-center">
              ระบบจัดเก็บข้อมูลโปรเจ็ค <br />
              <span className="font-bold">Project Box</span>
            </h2>
          </div>
          <a href={process.env.NEXT_PUBLIC_CMU_OAUTH_URL} className="w-full">
            <button className="bg-white text-gray-800 font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-100 transition duration-300 w-full mb-4 flex items-center justify-center gap-3">
              <Image
                src="/logo-engcmu/CMU_LOGO_Crop.jpg"
                width={30}
                height={30}
                alt="CMU Logo"
              />
              Sign in CMU Account
            </button>
          </a>
          <p className="text-white text-sm mb-4">Search project by not login</p>
          <a href="/search" className="w-full">
            <button className="bg-teal-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-teal-600 transition duration-300 w-full">
              Search the Project
            </button>
          </a>
        </div>
      </div>
    </>
  );
}
