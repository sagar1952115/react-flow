import React from "react";

const Navbar = ({ handleSave, handleRestore }) => {
  return (
    <div className="shadow border h-20 items-center px-10 flex justify-start ">
      <div>
        <button
          onClick={handleSave}
          className=" border-2 mr-10 h-max w-max hover:bg-teal-500 hover:text-white transform transition-all duration-500  border-teal-500 text-teal-500  px-4 p-2 rounded-md font-bold"
        >
          Save Changes
        </button>
        <button
          onClick={handleRestore}
          className="border-2 mr-10 h-max w-max hover:bg-red-500 hover:text-white transform transition-all duration-300  border-red-500 text-red-500 px-4 p-2 rounded-md font-bold"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Navbar;
