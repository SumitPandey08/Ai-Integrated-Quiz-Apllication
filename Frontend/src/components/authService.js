export const loginUser = async (email, password) => {
    try {
      const response = await fetch(`http://localhost:3210/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, message: result.msg || "Login failed." };
      }
    } catch (error) {
      return { success: false, message: "Network error. Please try again." };
    }
  };