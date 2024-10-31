// src/microsoftConfig.ts
export const msalConfig = {
    auth: {
      clientId: "2b1267ba-bbc7-436e-87e9-148477edec88",
      authority: "https://login.microsoftonline.com/common",
      redirectUri: "http://localhost:8000/api/v1/auth/microsoft/callback", // Adjust based on your app URL
    },
    cache: {
      cacheLocation: "sessionStorage", // Adjust to `localStorage` if needed
      storeAuthStateInCookie: false,
    },
  };
  
  export const loginRequest = {
    scopes: ["User.Read"],
  };
  