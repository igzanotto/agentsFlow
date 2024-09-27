import React, { useState, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  { 
    id: '1', 
    type: 'custom',
    position: { x: 0, y: 0 }, 
    data: { 
      label: 'Start',
      onEdit: () => {}, // These will be replaced in the component
      onDelete: () => {}
    } 
  },
  { 
    id: '2', 
    type: 'custom',
    position: { x: 0, y: 100 }, 
    data: { 
      label: 'Process',
      onEdit: () => {}, // These will be replaced in the component
      onDelete: () => {}
    } 
  },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2', type: 'smoothstep' }];

const CustomNode = ({ data }) => {
  return (
    <div style={{ 
      background: 'white', 
      border: '1px solid #ddd', 
      padding: '10px', 
      borderRadius: '5px',
      minWidth: '150px'
    }}>
      <Handle type="target" position={Position.Top} />
      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{data.label}</div>
      <button 
        onClick={() => data.onEdit(data.id)}
        style={{ marginRight: '5px', cursor: 'pointer' }}  // Add some styling
      >
        Edit
      </button>
      <button 
        onClick={() => data.onDelete(data.id)}
        style={{ cursor: 'pointer' }}  // Add some styling
      >
        Delete
      </button>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

function FlowDiagramBoard() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      onEdit: () => startEditingNode(node.id),
      onDelete: () => deleteNode(node.id)
    }
  })));

  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeName, setNodeName] = useState('');
  const [editingNode, setEditingNode] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep' }, eds)),
    [setEdges]
  );

  const addNode = () => {
    if (nodeName) {
      const newNode = {
        id: Date.now().toString(),
        type: 'custom',  
        position: { x: Math.random() * 500, y: Math.random() * 500 },
        data: { 
          label: nodeName,
          onEdit: () => startEditingNode(newNode.id),
          onDelete: () => deleteNode(newNode.id)
        }
      };
      setNodes((nds) => nds.concat(newNode));
      setNodeName('');
    }
  };

  const startEditingNode = (id) => {
    setEditingNode(id);
    const node = nodes.find((n) => n.id === id);
    if (node) {
      setNodeName(node.data.label);
    }
  };

  const saveEditingNode = () => {
    if (editingNode && nodeName) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === editingNode
            ? { ...node, data: { ...node.data, label: nodeName } }
            : node
        )
      );
      setEditingNode(null);
      setNodeName('');
    }
  };

  const deleteNode = (id) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
  };

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
      <div style={{ marginTop: '10px' }}>
        <input
          type="text"
          value={nodeName}
          onChange={(e) => setNodeName(e.target.value)}
          placeholder="Enter node name"
        />
        {editingNode ? (
          <button onClick={saveEditingNode}>Save</button>
        ) : (
          <button onClick={addNode}>Add Node</button>
        )}
      </div>
    </div>
  );
}

export default FlowDiagramBoard;