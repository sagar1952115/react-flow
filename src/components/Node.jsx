import React from "react";
import { Handle, Position } from "reactflow";
import whatsapp from "../assets/whatsapp.svg";
import message from "../assets/message.svg";

//custome node
function Node({ data, selected }) {
  return (
    <div
      className={`w-40  overflow-hidden shadow-md rounded-md bg-white   ${
        selected ? "border-solid border border-teal-500/100" : ""
      } `}
    >
      <div className="flex flex-col ">
        <div className="max-h-max flex items-center justify-between px-2 py-2 text-left text-white text-xs font-bold  bg-teal-500">
          <img className="" src={message} alt="" /> send message{" "}
          <img src={whatsapp} alt="" />
        </div>
        <div className="px-3 py-2 ">
          <div className="text-xs font-normal text-black">
            {data.label ?? "Text Node"}
          </div>
        </div>
      </div>

      <Handle
        id="a"
        type="target"
        position={Position.Left}
        className="w-1 rounded-full bg-slate-500"
      />
      <Handle
        id="b"
        type="source"
        position={Position.Right}
        className="w-1 rounded-full bg-gray-500"
      />
    </div>
  );
}

export default Node;
