// MicrosoftAuthComponent.tsx

import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../microsoftConfig";
import Button from "@mui/material/Button";
import MicrosoftIcon from "@mui/icons-material/Microsoft";
import { useAuth } from "../../context/AuthContext";

const MicrosoftAuthComponent: React.FC = () => {
  const { instance } = useMsal();
  const { setEmail, setUser } = useAuth();

  const handleMicrosoftLogin = async () => {
    try {
      const response = await instance.loginPopup(loginRequest);
      const account = response.account;
      if (account) {
        setEmail(account.username);
        setUser({
          email: account.username,
          picture: "", // Microsoft doesn't provide a picture URL by default
          name: account.name || "Unknown User",
        });

        // Access token can be sent to your backend if needed
        const accessToken = response.accessToken;
        console.log("Access Token:", accessToken);
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  return (
    <Button
      startIcon={<MicrosoftIcon style={{ color: "#0078D4" }} />}
      variant="outlined"
      fullWidth
      onClick={handleMicrosoftLogin}
      style={{ borderColor: "#0078D433", color: "#0078D4", marginLeft: 8 }}
    >
      Microsoft
    </Button>
  );
};

export default MicrosoftAuthComponent;
