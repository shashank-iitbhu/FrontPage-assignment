import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import './App.css';

const App = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Connect to WebSocket server
    const socket = socketIOClient("http://127.0.0.1:5000");

    socket.on("newStories", (newStories) => {
      setStories(newStories);
      setLoading(false);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="App">
      <h1>Hacker News Real-time Updates</h1>
      {loading ? (
        <p>Loading stories...</p>
      ) : (
        <div>
          {stories.length > 0 ? (
            stories.map((story, index) => (
              <div key={index} className="story">
                <h3>{story.title}</h3>
                <p>
                  <a href={story.link} target="_blank" rel="noopener noreferrer">
                    {story.link || "No link available"}
                  </a>
                </p>
              </div>
            ))
          ) : (
            <p>No stories available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
