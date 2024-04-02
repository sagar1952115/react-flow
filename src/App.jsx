import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Panel,
  useReactFlow,
  MiniMap,
  Controls,
  Background,
} from "reactflow";
import "reactflow/dist/base.css";

import "../tailwind.config.js";
import Sidebar from "./components/Sidebar.jsx";
import Node from "./components/Node.jsx";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar.jsx";

// Key for local storage
const flowKey = "flow-key";

// Initial node setup
const generateId = () => {
  const timestamp = Date.now(); // Get current timestamp (milliseconds since Unix epoch)
  const random = Math.floor(Math.random() * 1000); // Generate a random number between 0 and 999
  return `node_${timestamp}_${random}`;
};
const initialNodes = [
  {
    id: generateId(),
    type: "textnode",
    data: { label: "Test message" },
    position: { x: 250, y: 5 },
  },
];

let id = 0;

// Function for generating unique IDs for nodes

// App component
const App = () => {
  // Define custom node types
  const nodeTypes = useMemo(
    () => ({
      textnode: Node,
    }),
    []
  );

  // States and hooks setup
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedElements, setSelectedElements] = useState([]);
  const [nodeName, setNodeName] = useState("");

  // Update nodes data when nodeName or selectedElements changes
  useEffect(() => {
    if (selectedElements.length > 0) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedElements[0]?.id) {
            node.data = {
              ...node.data,
              label: nodeName,
            };
          }
          return node;
        })
      );
    } else {
      setNodeName(""); // Clear nodeName when no node is selected
    }
  }, [nodeName, selectedElements, setNodes]);

  useEffect(() => {
    handleRestore();
  }, []);

  // Handle node click
  const onNodeClick = useCallback((event, node) => {
    setSelectedElements([node]);
    setNodeName(node.data.label);
    setNodes((nodes) =>
      nodes.map((n) => ({
        ...n,
        selected: n.id === node.id,
      }))
    );
  }, []);

  // Setup viewport
  const { setViewport } = useReactFlow();

  // Check for empty target handles
  const checkEmptyTargetHandles = () => {
    let emptyTargetHandles = 0;
    edges.forEach((edge) => {
      if (!edge.targetHandle) {
        emptyTargetHandles++;
      }
    });
    return emptyTargetHandles;
  };

  // Check if any node is unconnected
  const isNodeUnconnected = useCallback(() => {
    let unconnectedNodes = nodes.filter(
      (node) =>
        !edges.find(
          (edge) => edge.source === node.id || edge.target === node.id
        )
    );

    return unconnectedNodes.length > 0;
  }, [nodes, edges]);

  // Save flow to local storage
  const handleSave = useCallback(() => {
    if (reactFlowInstance) {
      const emptyTargetHandles = checkEmptyTargetHandles();

      if (nodes.length > 1 && (emptyTargetHandles > 1 || isNodeUnconnected())) {
        toast.error(
          "More than one node has an empty target point or there are unconnected nodes."
        );
      } else {
        const flow = reactFlowInstance.toObject();
        localStorage.setItem(flowKey, JSON.stringify(flow));
        toast.success("Flow saved successfully!"); // Provide feedback when save is successful
      }
    }
  }, [reactFlowInstance, nodes, isNodeUnconnected]);

  // Restore flow from local storage
  const handleRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey));

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setNodes, setViewport]);

  // Handle edge connection
  const onConnect = useCallback(
    (params) => {
      const { source, target } = params;

      // Check if there's already an edge originating from the source node
      const existingEdge = edges.find((edge) => edge.source === source);

      if (existingEdge) {
        toast.error(
          "Can not have more than one edge originating from the source node."
        );

        // Deselect the source node
        setSelectedElements([]);

        return;
      }

      // Add the new edge
      setEdges((currentEdges) => addEdge(params, currentEdges));
    },
    [edges, setEdges, setSelectedElements]
  );

  // Enable drop effect on drag over
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Handle drop event to add a new node
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: generateId(),
        type,
        position,
        data: { label: `Test Message` },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const rfStyle = {
    backgroundColor: "#ffffff",
  };

  return (
    <div className="h-screen">
      <Toaster />
      <Navbar handleSave={handleSave} handleRestore={handleRestore} />
      <div className="flex flex-row lg:flex-row min-h-[calc(100vh-5rem)]">
        <div className="flex-grow h-[calc(100vh-5rem)]" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            style={rfStyle}
            onNodeClick={onNodeClick}
            onPaneClick={() => {
              setSelectedElements([]); // Reset selected elements when clicking on pane
              setNodes((nodes) =>
                nodes.map((n) => ({
                  ...n,
                  selected: false, // Reset selected state of nodes when clicking on pane
                }))
              );
            }}
            fitView
          >
            <Controls />
            <MiniMap zoomable pannable />
          </ReactFlow>
        </div>

        <Sidebar
          nodeName={nodeName}
          setNodeName={setNodeName}
          selectedNode={selectedElements[0]}
          setSelectedElements={setSelectedElements}
        />
      </div>
    </div>
  );
};

export default App;
