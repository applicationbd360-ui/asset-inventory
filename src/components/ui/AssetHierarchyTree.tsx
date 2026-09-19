import React, { useState } from 'react';
import { ChevronRight, ChevronDown, MapPin, Settings, Wrench, Package } from 'lucide-react';
import './AssetHierarchyTree.css';

interface TreeNode {
  id: string;
  label: string;
  type: 'plant' | 'location' | 'equipment' | 'part';
  children?: TreeNode[];
}

// Mock hierarchy mimicking the SAP screenshot
const MOCK_HIERARCHY: TreeNode[] = [
  {
    id: 'p1',
    label: 'Eagle_Ford_Field',
    type: 'plant',
    children: [
      {
        id: 'p1-c4',
        label: 'North_Field',
        type: 'location',
        children: [
          {
            id: 'p1-c4-u3',
            label: 'Well_Cluster_3',
            type: 'location',
            children: [
              {
                id: 'p1-c4-u3-a1',
                label: 'Centrifugal_Pump',
                type: 'equipment',
                children: [
                  { id: 'loc-1', label: 'Location_1', type: 'location' },
                  { id: 'loc-2', label: 'Location_2', type: 'location' },
                  {
                    id: 'pump-00554',
                    label: 'Pump 00554',
                    type: 'equipment',
                    children: [
                      { id: 'hyd', label: 'Hydraulics Assembly', type: 'part' },
                      { id: 'base', label: 'Baseplate', type: 'part' },
                      { id: 'bearings', label: 'Bearings', type: 'part' },
                      { id: 'casing', label: 'Casing', type: 'part' },
                      { id: 'foundation', label: 'Foundation', type: 'part' },
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

const NodeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'plant': return <MapPin size={16} />;
    case 'location': return <MapPin size={16} />;
    case 'equipment': return <Settings size={16} />;
    case 'part': return <Wrench size={14} />;
    default: return <Package size={16} />;
  }
};

const TreeNodeComponent = ({ node, level, selectedId, onSelect }: { node: TreeNode, level: number, selectedId: string, onSelect: (id: string) => void }) => {
  const [expanded, setExpanded] = useState(level < 3); // auto-expand first 3 levels

  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedId === node.id;

  return (
    <div className="asset-tree-node">
      <div 
        className={`asset-tree-item ${isSelected ? 'active' : ''}`}
        onClick={() => {
          onSelect(node.id);
          if (hasChildren) setExpanded(!expanded);
        }}
      >
        <div className="asset-tree-toggle">
          {hasChildren && (expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
        </div>
        <div className="asset-tree-icon">
          <NodeIcon type={node.type} />
        </div>
        <span className="asset-tree-label">{node.label}</span>
      </div>
      
      {hasChildren && expanded && (
        <div className="asset-tree-children">
          {node.children!.map(child => (
            <TreeNodeComponent 
              key={child.id} 
              node={child} 
              level={level + 1} 
              selectedId={selectedId}
              onSelect={onSelect} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function AssetHierarchyTree({ 
  onSelectNode 
}: { 
  onSelectNode: (id: string) => void 
}) {
  const [selectedId, setSelectedId] = useState('pump-00554');

  const handleSelect = (id: string) => {
    setSelectedId(id);
    onSelectNode(id);
  };

  return (
    <div className="asset-tree-container">
      {MOCK_HIERARCHY.map(node => (
        <TreeNodeComponent 
          key={node.id} 
          node={node} 
          level={0} 
          selectedId={selectedId}
          onSelect={handleSelect} 
        />
      ))}
    </div>
  );
}
