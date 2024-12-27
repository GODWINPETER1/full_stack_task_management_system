import React, { useMemo } from 'react';
import ReactFlow, { Edge, Node, Controls, Background } from 'react-flow-renderer';
import { Task, TaskDependency } from '../../redux/taskSlice';

interface DependencyGraphProps {
  tasks: Task[];
  dependencies: TaskDependency[];
}

const DependencyGraph: React.FC<DependencyGraphProps> = ({ tasks, dependencies }) => {
  // Convert tasks to nodes
  const nodes: Node[] = useMemo(() => {
    return tasks.map((task) => ({
      id: task.id.toString(),
      data: { label: task.title },
      position: { x: Math.random() * 400, y: Math.random() * 400 }, // Randomized positions
    }));
  }, [tasks]);

  // Convert dependencies to edges
  const edges: Edge[] = useMemo(() => {
    return dependencies.map((dependency) => ({
      id: `edge-${dependency.task_id}-${dependency.dependent_task_id}`,
      source: dependency.task_id.toString(),
      target: dependency.dependent_task_id.toString(),
      type: 'smoothstep',
    }));
  }, [dependencies]);

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background gap={16} size={0.5} /> {/* Simplified grid */}
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default DependencyGraph;
