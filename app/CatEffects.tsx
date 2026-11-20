"use client";
import { useEffect } from "react";

export function CatEffects() {
  useEffect(() => {
    const audio = new Audio("/meow.mp3");
    audio.volume = 0.4; // Громкость 40%

    const handleClick = () => {
      audio.currentTime = 0;
      audio.play().catch(() => {}); // Игнорируем блокировку звука браузером
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
