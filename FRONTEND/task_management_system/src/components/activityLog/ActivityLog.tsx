import React, { useState, useEffect } from "react";
import api from "../../services/activityLog";

interface ActivityLog {
  id: number;
  user_id: number;
  action: string;
  details: string | null;
  timestamp: string;
}

const ActivityLogPanel: React.FC = () => {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivityLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/activity-logs");
      setActivityLogs(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to fetch activity logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  if (loading) return <div>Loading activity logs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="activity-log-panel">
      <h3>Activity Logs</h3>
      <ul>
        {activityLogs.map((log) => (
          <li key={log.id} className="activity-log-entry">
            <div className="activity-header">
              <strong>{log.action}</strong>
              <span>{new Date(log.timestamp).toLocaleString()}</span>
            </div>
            <p>{log.details || "No details provided"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityLogPanel;
