import React from "react";

export default function Sidebar({
  nodeName,
  setNodeName,
  selectedNode,
  setSelectedElements,
}) {
  // Function to handle input change for node name
  const handleInputChange = (event) => {
    setNodeName(event.target.value);
  };

  // Function to handle drag start event for adding a new node
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="border-l-2 border-blue-200 p-4 text-sm bg-white w-1/5 min-h-[calc(100vh-5rem  )] text-black">
      {selectedNode ? (
        <div>
          {/* Update Node Section */}
          <h3 className="text-2xl font-extrabold mb-2  text-teal-500">
            Update Node
          </h3>
          <label className="block mb-2 text-sm font-medium text-teal-500">
            Node Name:
          </label>
          <input
            type="text"
            className="block w-full pt-2 px-3 pb-3 text-gray-700 border-2 font-bold  border-teal-300 rounded-lg bg-white focus:outline-none focus:border-teal-500"
            value={nodeName}
            onChange={handleInputChange}
          />
          <button
            className="mt-4 px-4 p-2 font-bold bg-teal-500 text-white rounded p-2 hover:bg-teal-600"
            onClick={() => setSelectedElements([])}
          >
            Go Back
          </button>
        </div>
      ) : (
        <>
          {/* Nodes Panel Section */}
          <h3 className=" mb-4 text-teal-500 font-bold text-2xl">
            Nodes Panel
          </h3>
          <div
            className="bg-white p-3 font-bold border-2 border-teal-500 rounded cursor-move flex justify-center items-center text-teal-500 hover:bg-teal-500 hover:text-white transition-colors duration-200"
            onDragStart={(event) => onDragStart(event, "textnode")}
            draggable
          >
            Message Node
          </div>
        </>
      )}
    </div>
  );
}
