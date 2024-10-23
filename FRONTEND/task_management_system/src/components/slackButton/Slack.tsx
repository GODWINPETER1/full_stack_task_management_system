import React from 'react';
import { useAuth } from '../../context/AuthContext'; // Import the AuthContext

const SlackAuthComponent = () => {
  const { slackLogin } = useAuth(); // Access slackLogin from AuthContext

  const handleSlackLogin = () => {
    const clientId = '7907772510593.7888487042758'; // Replace with your Slack Client ID
    const redirectUri = 'https://localhost:8000/api/v1/auth/slack/callback'; // Your redirect URL
    const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=identity.basic,identity.email,identity.avatar&redirect_uri=${redirectUri}`;

    window.location.href = slackAuthUrl; // Redirect to Slack OAuth
  };

  return (
    <div>
      <button onClick={handleSlackLogin}>
        <img src="/path-to-slack-logo.png" alt="Slack Logo" /> Login with Slack
      </button>
    </div>
  );
};

export default SlackAuthComponent;
