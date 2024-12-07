import React, { useEffect, useRef } from "react";
import CanvasDraw from "react-canvas-draw";
import axios from "axios";
import styled from "styled-components";

const MasterWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const App = () => {
  const canvasRef = useRef(null);
 

  const sendDrawing = async () => {
    const canvas = canvasRef.current.canvasContainer.children[1]; // Access the drawing layer

    // Get the full-size image from the canvas
    const fullImage = canvas.toDataURL("image/png");

    // Create an offscreen canvas for resizing
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = 28;
    offscreenCanvas.height = 28;

    const offscreenContext = offscreenCanvas.getContext("2d");

    // Draw the full-size image onto the smaller canvas
    const img = new Image();
    img.onload = async () => {
      offscreenContext.fillStyle = "#000000"; // White background
      offscreenContext.fillRect(0, 0, 28, 28);
      offscreenContext.drawImage(img, 0, 0, 28, 28);

      // Get the resized image as base64
      const resizedImage = offscreenCanvas.toDataURL("image/png");

      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/predict`, {
          Image: resizedImage, // Send the resized base64 image to the backend
        });
        console.log(`Predicted Letter: ${response.data.prediction}`);
      } catch (error) {
        console.error("Error predicting letter:", error);
      }
    };
    img.src = fullImage; // Load the full-size image into the offscreen canvas
  };

  const clearCanvas = () => {
    canvasRef.current.clear();
  };
 
  return (
    <MasterWrapper>
      <div>
        <h1>Draw a Letter</h1>
        <CanvasDraw
          ref={canvasRef}
          brushColor="#fff"
          canvasWidth={700}
          brushRadius={33} 
          canvasHeight={700}
          style={{ backgroundColor: "#000" }}
        />
        <button onClick={sendDrawing}>Predict</button>
        <button onClick={clearCanvas}>Clear</button>
      </div>
    </MasterWrapper>
  );
};

export default App;
