import React from "react";

export default function AdvisorStatsPage() {
  function navigateToProfile(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="min-h-screen p-4 bg-stone-100">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-w-6xl mx-auto bg-white rounded-lg p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Advisor Stats</h1>
        <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white">
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500  round-lg">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Position
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Number of Projects
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4">React Developer</td>
              <th
                scope="row"
                className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap"
              >
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://www.w3schools.com/w3images/avatar2.png" // Changed to a generic guest profile picture
                  alt="guest user"
                />
                <div className="ps-3">
                  <span className="text-base font-semibold text-red-700 hover:underline">
                    Pichayoot Hunchainao
                  </span>
                  <div className="font-normal text-gray-500">
                    neil.sims@flowbite.com
                  </div>
                </div>
              </th>
              <td className="px-6 py-4">5</td>
            </tr>
            <tr className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4">Designer</td>
              <th
                scope="row"
                className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap"
              >
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://www.w3schools.com/w3images/avatar2.png" // Changed to a generic guest profile picture
                  alt="guest user"
                />
                <div className="ps-3">
                  <span className="text-base font-semibold text-red-700 hover:underline">
                    Nathapong Phongsawaleesri
                  </span>
                  <div className="font-normal text-gray-500">
                    bonnie@flowbite.com
                  </div>
                </div>
              </th>
              <td className="px-6 py-4">8</td>
            </tr>
            <tr className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4">Vue JS Developer</td>
              <th
                scope="row"
                className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap"
              >
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://www.w3schools.com/w3images/avatar2.png" // Changed to a generic guest profile picture
                  alt="guest user"
                />
                <div className="ps-3">
                  <span className="text-base font-semibold text-red-700 hover:underline">
                    Thanawin Saithong
                  </span>
                  <div className="font-normal text-gray-500">
                    jese@flowbite.com
                  </div>
                </div>
              </th>
              <td className="px-6 py-4">3</td>
            </tr>
            <tr className="bg-white hover:bg-gray-50">
              <td className="px-6 py-4">UI/UX Engineer</td>
              <th
                scope="row"
                className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap"
              >
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://www.w3schools.com/w3images/avatar2.png" // Changed to a generic guest profile picture
                  alt="guest user"
                />
                <div className="ps-3">
                  <span className="text-base font-semibold text-red-700 hover:underline">
                    Nirand Pisutha-Arnond
                  </span>
                  <div className="font-normal text-gray-500">
                    thomes@flowbite.com
                  </div>
                </div>
              </th>
              <td className="px-6 py-4">6</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
