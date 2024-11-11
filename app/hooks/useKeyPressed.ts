import { useState, useEffect } from "react";

const useKeyPressed = () => {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState<string | number>("");

  const runWhenPressed = (key: string | number, callback: () => void) => {
    if (keyPressed === key) {
      callback();
    }
  };

  // If pressed key is our target key then set to true
  function downHandler({ key }: {
    key: string | number;
  }) {
    // console.log("🚀 ~ file: useKeyPressed.ts:11 ~ useKeyPressed ~ key", key.toString())
    // if (key === targetKey) {
    //   setKeyPressed(true);
    // }
    if (key == " " || key == "Space" || key == 32) {
      key = "Space";
    }
    setKeyPressed(key);
  }

  // If released key is our target key then set to false
  const upHandler = () => {
    // if (key === targetKey) {
    //   setKeyPressed(false);
    // }
    setKeyPressed("");
  };

  // Add event listeners
  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return { keyPressed, runWhenPressed };
};

export default useKeyPressed;
