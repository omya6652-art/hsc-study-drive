import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ChevronDown, FileText, Download, HardDrive } from 'lucide-react';

// Connects to your database
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

function App() {
  const [sections, setSections] = useState({});
  const [openSection, setOpenSection] = useState(null);

  useEffect(() => {
    async function fetchFiles() {
      const { data } = await supabase.from('files').select('*');
      if (data) {
        // This logic groups your files into "Test 1", "Test 2", etc.
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
        <header className="flex items-center gap-2 mb-8 py-4 border-b border-zinc-800">
          <HardDrive className="text-blue-500" size={20} />
          <h1 className="text-sm font-bold tracking-widest uppercase text-white">HSC Resource Vault</h1>
        </header>

        <div className="space-y-3">
          {Object.keys(sections).length === 0 && <p className="text-center text-zinc-600">No files found. Add rows in Supabase!</p>}
          
          {Object.keys(sections).map((category) => (
            <div key={category} className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-zinc-800">
              <button 
                onClick={() => setOpenSection(openSection === category ? null : category)}
                className="w-full flex items-center justify-between p-4"
              >
                <span className="font-bold text-white text-xs uppercase tracking-wider">{category}</span>
                <ChevronDown size={16} className={`transition-transform ${openSection === category ? '' : '-rotate-90'}`} />
              </button>

              {openSection === category && (
                <div className="px-4 pb-4 space-y-3 pt-2 border-t border-zinc-800/50">
                  {sections[category].map((file) => (
                    <div key={file.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText size={16} className="text-zinc-500" />
                        <span className="text-sm">{file.title}</span>
                      </div>
                      <a href={file.file_url} target="_blank" className="text-[10px] font-bold bg-blue-600 text-white px-2 py-1 rounded">
                        GET FILE
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