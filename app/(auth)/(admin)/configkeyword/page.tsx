'use client'
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { apiConfig } from '@/config/apiConfig';
import { Keyword } from '@/dtos/Keyword';
import { useProgram } from '@/context/ProgramContext';
import getAllProgram from '@/utils/getAllProgram';
import { AllProgram } from '@/models/AllPrograms';
import Spinner from '@/components/Spinner';
import Pagination from '@/components/Pagination';
import getKeywordByProgramID from '@/app/api/keywords/getKeywordByProgramID';
import deleteKeywordByProgramID from '@/app/api/keywords/deleteKeyword';
import { createKeyword } from '@/app/api/keywords/createKeyword';

const ConfigKeywordPage = () => {
  const { selectedMajor } = useProgram();
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [filter, setFilter] = useState('');
  const [newKeywords, setNewKeywords] = useState<string[]>(['']);
  const [allProgram, setAllProgram] = useState<AllProgram[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const itemsPerPage = 10;

  const fetchKeywords = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getKeywordByProgramID(selectedMajor);
      const allProgram = await getAllProgram();
      setKeywords(response);
      setAllProgram(allProgram);
    } catch (error) {
      console.error('Error fetching keywords:', error);
      setError('Failed to load keywords.');
    } finally {
      setLoading(false);
    }
  }, [selectedMajor]);

  useEffect(() => {
    fetchKeywords();
  }, [fetchKeywords]);

  const handleAddKeyword = async () => {
    try {
      for (const keyword of newKeywords) {
        
        await createKeyword(keyword, selectedMajor);
      }
      setNewKeywords(['']);
      setIsModalOpen(false);
      fetchKeywords();
    } catch (error) {
      console.error('Error adding keyword:', error);
    }
  };

  const handleEditKeyword = async (id: number, updatedKeyword: string, programID: number) => {
    // Add logic to edit a keyword
  };

  const handleDeleteKeyword = async (id: number) => {
    try {
      await deleteKeywordByProgramID(id);
      setKeywords(keywords.filter(keyword => keyword.id !== id));
    } catch (error) {
      console.error('Error deleting keyword:', error);
    }
  };

  const handleKeywordChange = (index: number, value: string) => {
    const updatedKeywords = [...newKeywords];
    updatedKeywords[index] = value;
    setNewKeywords(updatedKeywords);
  };

  const addKeywordInput = () => {
    setNewKeywords([...newKeywords, '']);
  };

  const programName = allProgram.find(program => program.id === selectedMajor)?.program_name_en;

  const filteredKeywords = keywords.filter(keyword => 
    keyword.keyword.toLowerCase().includes(filter.toLowerCase())
  );

  const removeKeywordInput = (index: number) => {
    const updatedKeywords = newKeywords.filter((_, i) => i !== index);
    setNewKeywords(updatedKeywords.length ? updatedKeywords : ['']); // Ensure at least one input remains
  };
  
  const resetKeywordInputs = () => {
    setNewKeywords(['']);
  };

  const currentKeywords = filteredKeywords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <Spinner />;
  if (error) {
    return (
      <div className="min-h-screen p-4 bg-gray-100 flex items-center justify-center">
        <p className="text-primary_text">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="p-4 mb-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <h2 className="text-lg font-semibold text-gray-900">Keyword Configuration for {programName}</h2>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-medium text-gray-800">Manage Keywords</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Add Keyword
          </button>
        </div>

        <input
          type="text"
          placeholder="Filter keywords"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mb-4 w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-light focus:border-primary-light transition-colors"
        />

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                  No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Keyword
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentKeywords.length > 0 ? (
                currentKeywords.map((keyword, index) => (
                  <tr key={keyword.id} className="hover:bg-gray-200/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1 + (currentPage - 1) * itemsPerPage}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {keyword.keyword}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex gap-3 justify-center" style={{color: '#ffa000'}}>
                        <button
                          onClick={() => handleEditKeyword(keyword.id, keyword.keyword, selectedMajor)}
                          className="text-sm font-medium text-primary-DEFAULT hover:text-primary-dark transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteKeyword(keyword.id)}
                          className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                    No Data Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="px-6 py-3 border-t border-gray-100">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredKeywords.length / itemsPerPage)}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Keywords</h2>
            {newKeywords.map((keyword, index) => (
                <div key={index} className="flex items-center gap-2">
              <input
                key={index}
                type="text"
                value={keyword}
                onChange={(e) => handleKeywordChange(index, e.target.value)}
                className="mb-2 w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-light focus:border-primary-light transition-colors"
                placeholder={`Keyword ${index + 1}`}
              />
               <button
                onClick={() => removeKeywordInput(index)}
                className="text-red-600 hover:text-red-700 font-medium text-sm"
                >
                Remove
                </button>
              </div>
            ))}
            <button
              onClick={addKeywordInput}
              className="text-blue-700 hover:text-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 focus:outline-none"
            >
              Add Another Keyword
            </button>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setIsModalOpen(false); resetKeywordInputs(); }}
                className="text-gray-700 hover:text-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={handleAddKeyword}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 focus:outline-none"
              >
                Save Keywords
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigKeywordPage;