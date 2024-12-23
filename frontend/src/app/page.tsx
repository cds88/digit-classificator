"use client";
import styled from "styled-components";
import { toast } from "react-toastify";
import CanvasDraw from "react-canvas-draw";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

const ButtonGroupWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 5px;
`;

const CanvasWrapper = styled.div`
  border: 2px solid lightgray;
  border-radius: 10px;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #352b2b;
  color: #e7e7e7;
  padding: 1rem 0rem;
`;

const ButtonGroup = styled.div`
  display: inline-flex;
  border: 1px solid #5a5656;
  border-radius: 8px;
  overflow: hidden;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  background-color: #070606;
  color: #333;
  color: #e7e7e7;

  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #ddd;
    color:black;
  }

  &:active {
    background-color: #bbb;
    color:black;

  }

  &:first-child {
    border-right: 1px solid #ccc;
  }

  &:last-child {
    border-left: none;
  }

  &:focus {
    outline: none;
    background-color: #eee;
    color:black;

  }
`;

const MasterWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(145deg, #353535, #3b3b3b);
`;

export default function Home() {
  const canvasRef = useRef<CanvasDraw>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(()=>{
    axios.get('/api/predict/').then(e=>{
      console.log(e)
    }).catch(console.error)
  },[])
 
  
  const sendDrawing = async () => {
    if (!canvasRef.current) return;
    //const canvas = canvasRef.current.canvasContainer.children[1]; // Access the drawing layer

    // Get the full-size image from the canvas

    // const fullImage =  canvasRef.current.getDataUrl("image/png");
    const canvasElement = (canvasRef.current as any).canvas.drawing; // Casting to `any` to bypass type restrictions
    const fullImage = canvasElement.toDataURL("image/png");
    // Create an offscreen canvas for resizing
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = 28;
    offscreenCanvas.height = 28;

    const offscreenContext = offscreenCanvas.getContext("2d");

    if (!offscreenContext) return;

    // Draw the full-size image onto the smaller canvas
    const img = new Image();
    img.onload = async () => {
      offscreenContext.fillStyle = "#000000"; // White background
      offscreenContext.fillRect(0, 0, 28, 28);
      offscreenContext.drawImage(img, 0, 0, 28, 28);

      // Get the resized image as base64
      const resizedImage = offscreenCanvas.toDataURL("image/png");

      try {
        const response = await axios.post(
          `/api/predict`,
          {
            Image: resizedImage,  
          }
        );
        // const responseJson = JSON.parse(response.data.prediction);
        // const result = responseJson.prediction;
        // console.log(`Predicted Letter: ${response.data.prediction}`);
        // console.log(JSON.parse(response.data.prediction));
        // toast.success(`Predicted number: ${result}`);
      } catch (error) {
        console.error("Error predicting letter:", error);
      }
    };
    img.src = fullImage; // Load the full-size image into the offscreen canvas
  };

  const clearCanvas = () => {
    canvasRef.current?.clear();
  };

 

  return (
    <MasterWrapper>
      <CanvasWrapper>
        <TitleWrapper>
          <h1>Draw a Letter</h1>
        </TitleWrapper>
        <div 
          onMouseEnter={()=>{
            setIsDrawing(true)
          }}
          onMouseLeave={()=>{
            setIsDrawing(false)
          }}
   
        >
          <CanvasDraw

            ref={canvasRef}
            brushColor={ isDrawing? "#fff"  :'transparent'}
            canvasWidth={700}
            brushRadius={33}
            canvasHeight={700}
            style={{ backgroundColor: "#000" }}
          />
        </div>
        <ButtonGroupWrapper>
          <ButtonGroup>
            <Button onClick={sendDrawing}>Predict</Button>
            <Button onClick={clearCanvas}>Clear</Button>
          </ButtonGroup>
        </ButtonGroupWrapper>
      </CanvasWrapper>
    </MasterWrapper>
  );
}
