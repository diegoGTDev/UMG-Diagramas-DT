import React, { useCallback, useState } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  BaseEdge,
  getBezierPath,
} from 'reactflow';
import type { Connection, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import './AutomataDiagram.css';

const initialNodes = [
  {
    id: '1',
    position: { x: 100, y: 100 },
    data: { label: 'q0 (Inicial)' },
    type: 'default',
  },
  {
    id: '2',
    position: { x: 400, y: 100 },
    data: { label: 'q1 (Final)' },
    type: 'default',
  },
];

const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    label: 'a',
    markerEnd: { type: MarkerType.ArrowClosed },
  },
];

interface AutomataDiagramProps {
  setAddStateRef?: (fn: () => void) => void;
}

export default function AutomataDiagram({ setAddStateRef }: AutomataDiagramProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  // const reactFlowInstance = useReactFlow(); // Not used

  // Manejar la eliminación de nodos y edges seleccionados
  const onNodesDelete = useCallback((deleted: { id: string }[]) => {
    setNodes((nds) => nds.filter((n) => !deleted.find((d) => d.id === n.id)));
    setEdges((eds) => eds.filter((e) => !deleted.find((d) => d.id === e.id)));
  }, [setNodes, setEdges]);

  // Añadir un nuevo estado
  const addState = useCallback(() => {
    const newId = (nodes.length + 1).toString();
    setNodes((nds) => [
      ...nds,
      {
        id: newId,
        position: { x: 100 + nds.length * 60, y: 200 },
        data: { label: `q${nds.length}` },
        type: 'default',
      },
    ]);
  }, [nodes, setNodes]);

  // Permitir que el padre acceda a la función
  React.useEffect(() => {
    if (setAddStateRef) setAddStateRef(addState);
  }, [addState, setAddStateRef]);

  // Referencia para el id del edge recién creado
  const lastCreatedEdgeId = React.useRef<string | null>(null);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      setEdges((eds) => {
        // Generar un id único para el nuevo edge
        const newId = `e${params.source}-${params.target}-${Date.now()}`;
        const newEdge = { ...params, id: newId, markerEnd: { type: MarkerType.ArrowClosed }, label: '' };
        lastCreatedEdgeId.current = newId;
        return addEdge(newEdge, eds);
      });
    },
    [setEdges]
  );

  // Detectar edge recién creado y activar input solo para ese edge
  const handleEdgesChange = useCallback(
    (changes: any) => {
      onEdgesChange(changes);
      if (lastCreatedEdgeId.current) {
        setEditingEdgeId(lastCreatedEdgeId.current);
        setEdgeLabelInput('');
        lastCreatedEdgeId.current = null;
      }
    },
    [onEdgesChange]
  );

  // Doble click en la etiqueta del edge para editar
  const [editingEdgeId, setEditingEdgeId] = useState<string | null>(null);
  const [edgeLabelInput, setEdgeLabelInput] = useState('');

  const onEdgeDoubleClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.stopPropagation();
    setEditingEdgeId(edge.id);
    setEdgeLabelInput(edge.label ? String(edge.label) : '');
  }, []);

  const handleEdgeLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEdgeLabelInput(e.target.value);
  };
  const handleEdgeLabelBlur = () => {
    if (editingEdgeId !== null) {
      setEdges((eds) => eds.map((edge) => edge.id === editingEdgeId ? { ...edge, label: edgeLabelInput } : edge));
      setEditingEdgeId(null);
    }
  };

  // Edge custom alineado correctamente
  const CustomEdge = (props: any) => {
    const { id, sourceX, sourceY, targetX, targetY, label } = props;
    const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, targetX, targetY });
    if (editingEdgeId === id) {
      return (
        <g>
          <BaseEdge path={edgePath} {...props} />
          <foreignObject width={60} height={30} x={labelX - 30} y={labelY - 15}>
            <input
              value={edgeLabelInput}
              onChange={handleEdgeLabelChange}
              onBlur={handleEdgeLabelBlur}
              autoFocus
              className="edge-label-input"
              placeholder="Etiqueta"
              title="Editar etiqueta"
            />
          </foreignObject>
        </g>
      );
    }
    return (
      <g>
        <BaseEdge path={edgePath} {...props} />
        <g onDoubleClick={(e) => onEdgeDoubleClick(e, props)} className="edge-label-group">
          <text
            x={labelX}
            y={labelY - 10}
            textAnchor="middle"
            className="edge-label-text"
          >
            {label}
          </text>
        </g>
      </g>
    );
  };

  const edgeTypes = {
    custom: CustomEdge,
  };

  // Modal para editar el nombre del nodo
  const [modalOpen, setModalOpen] = useState(false);
  const [modalNodeId, setModalNodeId] = useState<string | null>(null);
  const [modalInput, setModalInput] = useState('');

  const handleNodeDoubleClick = (_event: React.MouseEvent, node: any) => {
    setModalNodeId(node.id);
    setModalInput(node.data.label);
    setModalOpen(true);
  };

  const handleModalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModalInput(e.target.value);
  };

  const handleModalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && modalNodeId && modalInput.trim() !== '') {
      setNodes((nds) => nds.map((n) => n.id === modalNodeId ? { ...n, data: { ...n.data, label: modalInput } } : n));
      setModalOpen(false);
      setModalNodeId(null);
    } else if (e.key === 'Escape') {
      setModalOpen(false);
      setModalNodeId(null);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalNodeId(null);
  };

  return (
    <div className="w-full h-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges.map(e => ({ ...e, type: 'custom' }))}
        onNodesChange={onNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodesDelete={onNodesDelete}
        deleteKeyCode={['Backspace', 'Delete']}
        fitView
        edgeTypes={edgeTypes}
        onNodeDoubleClick={handleNodeDoubleClick}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
  {/* Edición de nodo por prompt, sin input flotante */}
      {/* Modal para editar nombre de nodo */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded shadow-lg p-6 min-w-[260px] flex flex-col items-center">
            <h2 className="mb-2 text-lg font-semibold">Editar nombre del estado</h2>
            <input
              className="border rounded px-2 py-1 w-full mb-3 text-center"
              value={modalInput}
              onChange={handleModalInputChange}
              onKeyDown={handleModalKeyDown}
              autoFocus
              maxLength={32}
            />
            <div className="flex gap-2">
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                onClick={() => {
                  if (modalNodeId && modalInput.trim() !== '') {
                    setNodes((nds) => nds.map((n) => n.id === modalNodeId ? { ...n, data: { ...n.data, label: modalInput } } : n));
                    setModalOpen(false);
                    setModalNodeId(null);
                  }
                }}
              >Guardar</button>
              <button
                className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                onClick={handleModalClose}
              >Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
