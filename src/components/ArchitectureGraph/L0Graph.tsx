import React, { useEffect, useCallback } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  Node,
  Edge,
  MarkerType,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';

import { GraphDTO } from '../../domain/project';

interface L0GraphProps {
  data: GraphDTO;
  className?: string;
  onNodeClick?: (event: React.MouseEvent, node: Node) => void;
  onEdgeClick?: (event: React.MouseEvent, edge: Edge) => void;
}

// 节点尺寸
const NODE_WIDTH = 180;
const NODE_HEIGHT = 80;

// 自动布局函数
const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: 'LR', nodesep: 60, ranksep: 120 });
  g.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((node) => {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = g.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

// 简单的节点组件
const SystemNode: React.FC<{ data: { label: string; summary?: string; category?: string } }> = ({ data }) => {
  return (
    <div className="px-4 py-3 rounded-lg border-2 border-blue-500 bg-white shadow-md min-w-[180px]">
      <div className="font-semibold text-sm text-gray-900">{data.label}</div>
      {data.summary && (
        <div className="text-xs text-gray-600 mt-1 line-clamp-2">{data.summary}</div>
      )}
      {data.category && (
        <div className="text-xs text-blue-600 mt-1">{data.category}</div>
      )}
    </div>
  );
};

const nodeTypes: NodeTypes = {
  system: SystemNode,
};

const L0Graph: React.FC<L0GraphProps> = ({ data, className, onNodeClick, onEdgeClick }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    // 转换节点
    const initialNodes: Node[] = data.nodes.map((node) => ({
      id: node.id,
      type: 'system',
      data: {
        label: node.label,
        summary: node.summary,
        category: node.category,
      },
      position: { x: 0, y: 0 },
    }));

    // 转换边，根据类型设置样式
    const initialEdges: Edge[] = data.edges.map((edge) => {
      let style: any = { strokeWidth: 2 };
      let animated = false;
      let markerColor = '#64748b';
      let label = edge.protocolOrSignal;

      switch (edge.type) {
        case 'power':
          style = { stroke: '#ef4444', strokeWidth: 3 };
          markerColor = '#ef4444';
          break;
        case 'bus':
          style = { stroke: '#3b82f6', strokeDasharray: '5,5' };
          animated = true;
          markerColor = '#3b82f6';
          break;
        case 'io':
          style = { stroke: '#10b981' };
          markerColor = '#10b981';
          break;
        case 'rf':
          style = { stroke: '#8b5cf6', strokeDasharray: '3,3' };
          animated = true;
          markerColor = '#8b5cf6';
          break;
        case 'net':
          style = { stroke: '#06b6d4', strokeDasharray: '5,5' };
          animated = true;
          markerColor = '#06b6d4';
          break;
        case 'debug':
          style = { stroke: '#f59e0b' };
          markerColor = '#f59e0b';
          break;
        case 'dependency':
          style = { stroke: '#64748b', strokeDasharray: '2,2' };
          markerColor = '#64748b';
          break;
      }

      // 关键路径加粗
      if (edge.criticality === 'high') {
        style.strokeWidth = 4;
        style.filter = 'drop-shadow(0 0 3px currentColor)';
      }

      return {
        id: edge.id,
        source: edge.from.nodeId,
        target: edge.to.nodeId,
        type: 'smoothstep',
        animated,
        style,
        label,
        labelStyle: { fontSize: 10, fill: markerColor },
        labelBgStyle: { fill: 'white', fillOpacity: 0.8 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: markerColor,
        },
      };
    });

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [data, setNodes, setEdges]);

  return (
    <div className={`w-full h-full bg-slate-50 ${className || ''}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.2}
        maxZoom={2}
      >
        <Background color="#ccc" gap={20} />
        <Controls />
      </ReactFlow>

      {/* 图例 */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 text-xs">
        <div className="font-semibold mb-2">连接类型</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-red-500"></div>
            <span>电源 (Power)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 border-t-2 border-dashed border-blue-500"></div>
            <span>总线 (Bus)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-green-500"></div>
            <span>IO</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 border-t-2 border-dashed border-purple-500"></div>
            <span>射频 (RF)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 border-t-2 border-dashed border-cyan-500"></div>
            <span>网络 (Net)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-orange-500"></div>
            <span>调试 (Debug)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 border-t-2 border-dotted border-gray-500"></div>
            <span>依赖</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default L0Graph;
