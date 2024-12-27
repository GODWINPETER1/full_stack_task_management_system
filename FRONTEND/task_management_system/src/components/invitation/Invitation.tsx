// src/components/InvitationDialog.tsx

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import sendInvitation from "../../utils/invitation";

interface InvitationDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: string | undefined;
}

const InvitationDialog: React.FC<InvitationDialogProps> = ({
  open,
  onClose,
  projectId,
}) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Admin");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email || !projectId) return;

    setLoading(true);
    try {
      await sendInvitation(projectId, email, role);
      alert("Invitation sent successfully!");
      onClose();
    } catch (error) {
      console.error("Failed to send invitation:", error);
      alert("Failed to send invitation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Invite Member</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Email Address"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            label="Role"
            variant="outlined"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSend}
          color="primary"
          disabled={loading || !email}
        >
          {loading ? <CircularProgress size={24} /> : "Send"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvitationDialog;
