import { useEffect, useRef } from "react";
import * as PIXI from 'pixi.js'; // Import PIXI
import { Live2DModel } from "pixi-live2d-display-lipsyncpatch";
import { useChat } from "../context/ChatContext";
import { aiPreferences } from "../constants";

window.PIXI = PIXI;

const Character2d = () => {
  const { selectedCharacter, audioUrl, setIsTalking, setSelectedCharacter } = useChat();
  const appRef = useRef(null); // Reference for PIXI app
  const modelRef = useRef(null); // Reference for current model

  useEffect(() => {
    let cubism2Model;
    if (selectedCharacter) cubism2Model = aiPreferences.filter((aiCharacter) => aiCharacter.id === selectedCharacter)[0].modelData;
    if (!selectedCharacter) setSelectedCharacter(aiPreferences[0].id);

    // Initialize PIXI application
    // const app = new PIXI.Application({
    //   view: document.getElementById('canvas'),
    //   autoStart: true,
    //   resizeTo: window,
    //   backgroundAlpha: 0, // Transparent background
    // });

    // Initialize PIXI application once
    if (!appRef.current) {
      appRef.current = new PIXI.Application({
        view: document.getElementById('canvas'),
        autoStart: true,
        resizeTo: window,
        backgroundAlpha: 0, // Transparent background
      });
    }

    const app = appRef.current;

    // Remove the previous model if exists
    if (modelRef.current) {
      console.log('Remove the previous model if exists');
      app.stage.removeChild(modelRef.current);
      modelRef.current.destroy(); // Properly destroy the old model
      modelRef.current = null;
    }

    try {
      if (cubism2Model) {
        // Load Live2D model
        Live2DModel.from(cubism2Model, { autoHitTest: false, autoFocus: false }).then((model) => {
          modelRef.current = model;
          app.stage.addChild(model);

          // Center model in canvas
          model.anchor.set(0.5, 0.5);
          model.position.set(window.innerWidth / 2, window.innerHeight / 2);
          model.scale.set(0.3, 0.3);

          // Handle window resize
          const handleResize = () => {
            model.position.set(window.innerWidth / 2, window.innerHeight / 2);
            model.scale.set(0.3, 0.3);
          };
          window.addEventListener('resize', handleResize);

          const playAudio = async (url) => {
            if (!url) return;
            try {
              var volume = 1;
              var expression = 4;
              var resetExpression = true;
              var crossOrigin = "anonymous";
              // Play model speech with lipsync
              model.speak(url, {
                volume: volume,
                expression: expression,
                resetExpression: resetExpression,
                crossOrigin: crossOrigin,
                onFinish: async () => {
                  try {
                    // Extract the audio ID from the URL (filename without extension)
                    const audioId = url.split("/").pop().replace(".mp3", "");
                    // Send a DELETE request to the backend to delete the audio file
                    await fetch(`http://localhost:5000/audio/${audioId}`, { method: "DELETE" });
                    console.log("Audio file deleted successfully.");
                  } catch (error) {
                    console.error("Error deleting audio file:", error);
                  }
                  setIsTalking(false); // Finish Talking, set to false
                },
              });
            } catch (error) {
              console.error("Error playing audio file:", error);
            }
          };

          // Watch for changes in audioUrl
          if (audioUrl) {
            playAudio(audioUrl);
          }

          return () => {
            window.removeEventListener('resize', handleResize);
          };
        });
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }, [audioUrl, setIsTalking, selectedCharacter]);

  return (
    <div className="flex justify-center items-center mx-auto">
      <canvas id="canvas" style={{ background: "transparent" }}></canvas>
    </div>
  )
}

export default Character2d;