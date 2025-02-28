import Image from "next/image";
import { redirect } from "next/navigation";
import { serverGetCookie } from "../utils/helpFunction";
import ImageCarousel from "@/components/dashboard/ImageCarousel";

export default function Home() {
  const cmuURL = process.env.NEXT_PUBLIC_CMU_ENTRAID_URL as string;
  const token = serverGetCookie();

  if (token) redirect("/dashboard");

  return (
    <>
      <div className="min-h-screen w-full flex flex-col items-center bg-gray-900 text-white">
        {/* Hero Section */}
        <header className="w-full text-center py-16 px-6 bg-gradient-to-r from-purple-600 to-pink-500">
          <div className="max-w-4xl mx-auto">
            <Image
              src="/logo-engcmu/cmu_eng.png"
              width={200}
              height={200}
              alt="Project Box Logo"
              className="mx-auto mb-6"
            />
            <h1 className="text-5xl font-bold">Project Box</h1>
            <p className="text-lg mt-4 opacity-90">
              A powerful platform for <strong>storing, managing, and searching</strong> academic & research projects.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
              <a href={cmuURL} className="w-full sm:w-auto">
                <button className="bg-white text-gray-800 font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-200 transition w-full sm:w-auto flex items-center justify-center gap-3">
                  <Image src="/logo-engcmu/CMU_LOGO_Crop.jpg" width={30} height={30} alt="CMU Logo" />
                  Sign in with CMU
                </button>
              </a>
              <a href="/search" className="w-full sm:w-auto">
                <button className="bg-teal-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-teal-600 transition w-full sm:w-auto">
                  Search Projects
                </button>
              </a>
            </div>
          </div>
        </header>

        {/* Features Section */}
        <section className="max-w-6xl px-6 py-16">
          <h2 className="text-4xl font-bold text-center mb-10">Why Use Project Box?</h2>

          {/* Parent Container: Split into Two Columns */}
<div className="flex flex-col md:flex-row items-start mb-12 gap-12">
  
  {/* Left Column: Store & Manage */}
  <div className="md:w-1/2">
    <h3 className="text-3xl font-semibold mb-3">📦 Store & Manage</h3>
    <p className="text-gray-300">
      Securely store and organize your academic & research projects in one place.
    </p>
    <div className="flex justify-center mt-2">
      <ImageCarousel 
        images={[
          { src: "/dashboard/create_project.png", alt: "Create Project", description: "Insert or store new projects." },
          { src: "/dashboard/manage_staff.png", alt: "Manage Staff", description: "For administrators to add staff (e.g., Advisors, Committee Members, External Committee Members)." },
          { src: "/dashboard/manage_submission.png", alt: "Manage Submission", description: "Manage the data input form for creating new projects. If a field is not required, it can be disabled to remove the input requirement." },
        ]} />
    </div>
  </div>

  {/* Right Column: Powerful Search */}
  <div className="md:w-1/2">
    <h3 className="text-3xl font-semibold mb-3">🔍 Powerful Search</h3>
    <p className="text-gray-300">
      Quickly find projects with <strong>advanced search</strong> and filtering options.
    </p>
    <div className="flex justify-center mt-8">
    <ImageCarousel
      images={[
        { src: "/dashboard/quick_search.png", alt: "Quick Search", description: "Quick Search allows you to search using a single input, combining project name, course, student name, and more" },
        { src: "/dashboard/detail_search.png", alt: "Advance Search", description: "Advance Search provides structured fields for more precise filtering, helping you find projects efficiently" },
        { src: "/dashboard/pdf_content_search.png", alt: "PDF Content Search", description: "PDF Content Search scans project PDFs to find specific words within the document’s content." },
      ]}
    />

    </div>
  </div>

  </div>
        </section>

        {/* Footer */}
        <footer className="w-full py-6 bg-gray-800 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Project Box | Designed for CMU Faculty of Engineering
        </footer>
      </div>
    </>
  );
}
