"use client";
import { useState } from 'react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Icon */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 w-14 h-14 bg-[#a52a2a] rounded-full flex items-center justify-center cursor-pointer shadow-xl z-[1000] hover:scale-110 transition"
      >
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
        </svg>
      </div>

      {/* Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-5 w-[90%] max-w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl z-[1000] flex flex-direction-column overflow-hidden border">
          <div className="bg-[#FFC107] p-4 flex justify-between items-center">
            <h2 className="font-bold text-[#a52a2a]">Halu Chatbot</h2>
            <button onClick={() => setIsOpen(false)} className="text-2xl text-[#a52a2a]">&times;</button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="bg-gray-200 p-3 rounded-lg rounded-bl-none max-w-[80%] mb-2">
              Halo! Ada yang bisa Halu bantu?
            </div>
          </div>
          <form className="p-3 border-top flex gap-2">
            <input type="text" className="flex-1 border rounded-full px-4 py-2 outline-none" placeholder="Ketik pesan..." />
            <button className="bg-[#a52a2a] text-white p-2 rounded-full w-10 h-10">Send</button>
          </form>
        </div>
      )}
    </>
  );
}