// src/api/invitation.ts
const token = localStorage.getItem('accessToken')
const sendInvitation = async (projectId: string, email: string, role: string) => {
    const response = await fetch(
      `http://localhost:8000/api/v1/projects/${projectId}/invite?role=${role}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email }),
      }
    );
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to send invitation");
    }
  };
  
  export default sendInvitation;
  