
 // script.js
document.getElementById("send-btn").addEventListener("click", function() {
    const userInput = document.getElementById("user-input").value;
    if (!userInput.trim()) return;  // Don't send empty input
    
    // Add user's message to the chat
    const userMessage = document.createElement("div");
    userMessage.classList.add("chat-message", "user-message");
    userMessage.innerHTML = `<p>${userInput}</p>`;
    document.getElementById("chat-box").appendChild(userMessage);
    
    // Clear the input field
    document.getElementById("user-input").value = "";
  
    // Send input to backend for processing
    fetch("/check-symptoms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ input: userInput })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();  // Try to parse the response JSON
    })
    .then(data => {
      if (data && data.possibleConditions) {
        const botMessage = document.createElement("div");
        botMessage.classList.add("chat-message", "bot-message");
        botMessage.innerHTML = `<p>Possible conditions: ${data.possibleConditions.join(', ')}</p>`;
        document.getElementById("chat-box").appendChild(botMessage);
      } else {
        const botMessage = document.createElement("div");
        botMessage.classList.add("chat-message", "bot-message");
        botMessage.innerHTML = `<p>Sorry, I couldn't identify any conditions based on your symptoms.</p>`;
        document.getElementById("chat-box").appendChild(botMessage);
      }
      
      // Scroll to the bottom of the chat box
      document.getElementById("chat-box").scrollTop = document.getElementById("chat-box").scrollHeight;
    })
    .catch(error => {
      const botMessage = document.createElement("div");
      botMessage.classList.add("chat-message", "bot-message");
      botMessage.innerHTML = `<p>There was an error: ${error.message}</p>`;
      document.getElementById("chat-box").appendChild(botMessage);
      console.error("Error:", error);
    });
  });
  