'use client';
import { useState } from 'react';

interface ProjectNode {
  id: string;
  name: string;
  emoji: string;
  color: string;
  category: string;
  x: number;
  y: number;
}

interface Connection {
  from: string;
  to: string;
  label: string;
  type: 'data' | 'content' | 'ip' | 'revenue' | 'curriculum';
}

const NODES: ProjectNode[] = [
  // Digital Products (left column)
  { id: 'ryp-red', name: 'RYP Red', emoji: '🔴', color: '#ef4444', category: 'Digital', x: 150, y: 100 },
  { id: 'known', name: 'Known', emoji: '⛳', color: '#00af51', category: 'Digital', x: 150, y: 250 },
  { id: 'certification', name: 'Certification', emoji: '🏅', color: '#f97316', category: 'Digital', x: 150, y: 400 },
  { id: 'command-center', name: 'Command Center', emoji: '🧠', color: '#8b5cf6', category: 'Digital', x: 150, y: 550 },

  // Physical Products (center column)
  { id: 'forge', name: 'FORGE', emoji: '🔥', color: '#f4ee19', category: 'Physical', x: 450, y: 100 },
  { id: 'rypstick', name: 'Rypstick', emoji: '⚡', color: '#22d3ee', category: 'Physical', x: 450, y: 250 },
  { id: 'preformed-grip', name: 'Preformed Grip', emoji: '🤚', color: '#a855f7', category: 'Physical', x: 450, y: 400 },

  // Marketing (right column)
  { id: 'textbook', name: 'Textbook', emoji: '📖', color: '#6366f1', category: 'Marketing', x: 750, y: 100 },
  { id: 'content-machine', name: 'Content Machine', emoji: '🎬', color: '#10b981', category: 'Marketing', x: 750, y: 250 },
  { id: 'social-media', name: 'Social Media', emoji: '📱', color: '#f472b6', category: 'Marketing', x: 750, y: 400 },

  // Operations (bottom)
  { id: 'foundation', name: 'Foundation', emoji: '🤝', color: '#ec4899', category: 'Operations', x: 300, y: 650 },
  { id: 'chip', name: 'CHIP', emoji: '🎯', color: '#0ea5e9', category: 'Operations', x: 600, y: 650 },
];

const CONNECTIONS: Connection[] = [
  { from: 'ryp-red', to: 'known', label: 'Player data feeds member recognition', type: 'data' },
  { from: 'ryp-red', to: 'rypstick', label: 'Speed data enriches dispersion model', type: 'data' },
  { from: 'forge', to: 'certification', label: 'FORGE methodology = cert curriculum', type: 'curriculum' },
  { from: 'forge', to: 'ryp-red', label: 'Assessment data flows to Red', type: 'data' },
  { from: 'forge', to: 'chip', label: 'Drill framework powers lessons', type: 'curriculum' },
  { from: 'content-machine', to: 'social-media', label: 'Pipeline generates all social content', type: 'content' },
  { from: 'textbook', to: 'content-machine', label: 'Book content cascades to all platforms', type: 'content' },
  { from: 'textbook', to: 'certification', label: 'Textbook is cert study material', type: 'curriculum' },
  { from: 'command-center', to: 'content-machine', label: 'CC manages content pipeline', type: 'content' },
  { from: 'certification', to: 'foundation', label: 'Cert funds foundation programs', type: 'revenue' },
  { from: 'ryp-red', to: 'content-machine', label: 'Red data → stat carousels', type: 'content' },
  { from: 'known', to: 'chip', label: 'Member recognition improves lessons', type: 'data' },
  { from: 'forge', to: 'textbook', label: 'FORGE methods documented in book', type: 'content' },
  { from: 'foundation', to: 'forge', label: 'Youth use FORGE curriculum', type: 'curriculum' },
];

const CONN_COLORS = {
  data: '#00af51',
  content: '#0ea5e9',
  ip: '#f97316',
  revenue: '#f4ee19',
  curriculum: '#a855f7',
};

export default function DependencyMapPage() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredConn, setHoveredConn] = useState<number | null>(null);

  const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n]));

  const relatedConnections = selectedNode
    ? CONNECTIONS.filter(c => c.from === selectedNode || c.to === selectedNode)
    : CONNECTIONS;

  const relatedNodeIds = selectedNode
    ? new Set([selectedNode, ...relatedConnections.map(c => c.from), ...relatedConnections.map(c => c.to)])
    : new Set(NODES.map(n => n.id));

  return (
    <div className="page">
      <div className="animate-fade-up mb-5">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Raleway, sans-serif' }}>Dependency Map</h1>
        <p className="text-white/40 text-sm mt-0.5">{NODES.length} projects · {CONNECTIONS.length} connections</p>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-3">
          {Object.entries(CONN_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded-full" style={{ background: color }} />
              <span className="text-[10px] text-white/30 capitalize">{type}</span>
            </div>
          ))}
        </div>

        {selectedNode && (
          <button onClick={() => setSelectedNode(null)} className="mt-2 text-xs text-[#00af51] hover:underline">
            ← Show all connections
          </button>
        )}
      </div>

      {/* SVG Map */}
      <div className="animate-fade-up bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
        <svg viewBox="0 0 900 750" className="w-full h-auto">
          {/* Connections */}
          {CONNECTIONS.map((conn, i) => {
            const from = nodeMap[conn.from];
            const to = nodeMap[conn.to];
            if (!from || !to) return null;
            const isRelated = !selectedNode || conn.from === selectedNode || conn.to === selectedNode;
            const isHovered = hoveredConn === i;

            return (
              <g key={i}
                onMouseEnter={() => setHoveredConn(i)}
                onMouseLeave={() => setHoveredConn(null)}
                style={{ cursor: 'pointer' }}
              >
                <line
                  x1={from.x} y1={from.y}
                  x2={to.x} y2={to.y}
                  stroke={CONN_COLORS[conn.type]}
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  opacity={isRelated ? (isHovered ? 0.8 : 0.3) : 0.05}
                  strokeDasharray={conn.type === 'revenue' ? '6,3' : 'none'}
                />
                {isHovered && (
                  <text
                    x={(from.x + to.x) / 2}
                    y={(from.y + to.y) / 2 - 8}
                    textAnchor="middle"
                    fill="white"
                    fontSize="9"
                    opacity="0.7"
                  >
                    {conn.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {NODES.map(node => {
            const isSelected = selectedNode === node.id;
            const isRelated = relatedNodeIds.has(node.id);
            return (
              <g
                key={node.id}
                onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                style={{ cursor: 'pointer' }}
              >
                {/* Glow */}
                {isSelected && (
                  <circle cx={node.x} cy={node.y} r="40" fill={node.color} opacity="0.1" />
                )}
                {/* Node circle */}
                <circle
                  cx={node.x} cy={node.y} r="28"
                  fill="#0d0d0d"
                  stroke={node.color}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  opacity={isRelated ? 1 : 0.2}
                />
                {/* Emoji */}
                <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="18" opacity={isRelated ? 1 : 0.2}>
                  {node.emoji}
                </text>
                {/* Label */}
                <text
                  x={node.x} y={node.y + 45}
                  textAnchor="middle"
                  fill="white"
                  fontSize="11"
                  fontWeight="600"
                  opacity={isRelated ? 0.7 : 0.15}
                >
                  {node.name}
                </text>
                {/* Category */}
                <text
                  x={node.x} y={node.y + 58}
                  textAnchor="middle"
                  fill="white"
                  fontSize="8"
                  opacity={isRelated ? 0.25 : 0.08}
                >
                  {node.category}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Connection details */}
      {selectedNode && (
        <div className="mt-4 animate-fade-up">
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-2">
            Connections for {nodeMap[selectedNode]?.name}
          </div>
          <div className="space-y-1.5">
            {relatedConnections.map((conn, i) => {
              const other = conn.from === selectedNode ? nodeMap[conn.to] : nodeMap[conn.from];
              const direction = conn.from === selectedNode ? '→' : '←';
              return (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full" style={{ background: CONN_COLORS[conn.type] }} />
                  <span className="text-white/40">{direction}</span>
                  <span className="text-white/60">{other?.name}</span>
                  <span className="text-white/25 text-xs flex-1">{conn.label}</span>
                  <span className="text-white/15 text-[10px] capitalize">{conn.type}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
