import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function ReturnHomeButton(){
  return (
    <div className="fixed top-4 left-4"
    style={{ zIndex: '9999' }}>
    <button 
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
    
    onClick={()=>window.location.href = '/'}
    >
    <FontAwesomeIcon icon="home" className="text-xl mr-2" />
      Home
    </button>
  </div>
  );
};

