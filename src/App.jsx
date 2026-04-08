import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ChevronDown, FileText, HardDrive } from 'lucide-react';

// Connect to the Supabase database using the hidden keys
const supabaseUrl = import.meta.env.VITE_DB_LINK;
const supabaseKey = import.meta.env.VITE_DB_SECRET;
const supabase = createClient(supabaseUrl, supabaseKey);
function App() {
  const [sections, setSections] = useState({});
  const [openSection, setOpenSection] = useState(null);

  useEffect(() => {
    async function fetchFiles() {
      // Grab everything from the 'files' table
      const { data, error } = await supabase.from('files').select('*');
      
      if (error) {
        console.error("Error fetching data:", error);
        return;
      }

      if (data) {
        // Group the files automatically by whatever category you type in Supabase
        const grouped = data.reduce((acc, file) => {
          acc[file.category] = acc[file.category] || [];
          acc[file.category].push(file);
          return acc;
        }, {});
        setSections(grouped);
      }
    }
    
    fetchFiles();
  }, []);

  return (
    <div className="min-h-screen bg-[#111] text-zinc-300 p-5 font-sans">
      <div className="max-w-md mx-auto">
        
        {/* Header Section */}
        <header className="flex items-center gap-2 mb-8 py-4 border-b border-zinc-800">
          <HardDrive className="text-blue-500" size={24} />
          <h1 className="text-base font-bold tracking-widest uppercase text-white">HSC Resource Vault</h1>
        </header>

        {/* Dynamic Sections */}
        <div className="space-y-4">
          {Object.keys(sections).length === 0 && (
            <p className="text-center text-zinc-500 text-sm mt-10">Vault is empty. Add files via Supabase.</p>
          )}
          
          {Object.keys(sections).map((category) => (
            <div key={category} className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-zinc-800 shadow-lg">
              
              {/* Dropdown Button */}
              <button 
                onClick={() => setOpenSection(openSection === category ? null : category)}
                className="w-full flex items-center justify-between p-4 hover:bg-[#222] transition-colors"
              >
                <span className="font-bold text-white text-sm uppercase tracking-wider">{category}</span>
                <ChevronDown 
                  size={18} 
                  className={`text-zinc-400 transition-transform duration-300 ${openSection === category ? '' : '-rotate-90'}`} 
                />
              </button>

              {/* The Files inside the Dropdown */}
              {openSection === category && (
                <div className="px-4 pb-4 space-y-3 pt-2 border-t border-zinc-800/50 bg-[#141414]">
                  {sections[category].map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileText size={18} className="text-blue-400 flex-shrink-0" />
                        <span className="text-sm text-zinc-200 truncate">{file.title}</span>
                      </div>
                      <a 
                        href={file.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold bg-blue-600 hover:bg-blue-500 transition-colors text-white px-3 py-1.5 rounded flex-shrink-0 ml-2"
                      >
                        OPEN
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;