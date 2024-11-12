import Image from "next/image";
import { redirect } from "next/navigation";
import { serverGetCookie } from "../utils/helpFunction";

export default function Home() {
	const token = serverGetCookie();
	if (token) redirect("/dashboard");
	return (
		<>
			<div className="h-screen w-full flex justify-center items-center bg-gradient-to-r from-blue-500 to-teal-500">
				<div className="flex flex-col md:flex-row bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 h-2/5">
					<div className="flex flex-col justify-center items-center md:w-1/2 mb-6 md:mb-0">
						<h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
							Project Box ENG CMU
						</h2>
						<p className="text-lg text-center text-gray-600">
							Welcome to the CMU OAuth example.
						</p>
					</div>
					<div className="flex flex-col justify-center items-center md:w-1/2">
						<h2 className="text-xl font-semibold text-gray-800 mb-4">
							Sign-in with your CMU Account
						</h2>
						<a href={process.env.NEXT_PUBLIC_CMU_OAUTH_URL}>
							<button className="cmu_button text-white py-2 px-6 rounded-lg shadow hover:bg-blue-700 transition duration-300 flex justify-center items-center gap-3">
								<Image
									src={"/logo-engcmu/RibbinENG2.png"}
									width={50}
									height={50}
									alt="logo login"
								/>
								<div className="flex justify-center font-semibold text-2xl">
									CMU Account
								</div>
							</button>
						</a>
					</div>
				</div>
			</div>
		</>
	);
}
