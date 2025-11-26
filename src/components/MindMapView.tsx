import { useCallback } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
} from 'reactflow'
import 'reactflow/dist/style.css'
import './MindMapView.css'
import { useLibraryStore } from '../store/libraryStore'

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '研究中心主题' }, type: 'input' },
]

const MindMapView = () => {
  const { papers } = useLibraryStore()

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const addNode = () => {
    const id = crypto.randomUUID()
    const newNode = {
      id,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `新笔记节点` },
    }
    setNodes((nds) => nds.concat(newNode))
  }

  return (
    <div className="mindmap-view">
      <div className="mindmap-toolbar">
        <div className="toolbar-group">
          <button className="tool-btn" onClick={addNode}>+ 添加笔记</button>
          <button className="tool-btn">💾 保存导图</button>
        </div>
        <div className="toolbar-info">
          关联论文数: {papers.length}
        </div>
      </div>

      <div className="flow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          attributionPosition="bottom-left"
        >
          <Background color="#aaa" gap={16} />
          <Controls />
          <MiniMap style={{height: 100}} zoomable pannable />
        </ReactFlow>
      </div>
    </div>
  )
}

export default MindMapView
