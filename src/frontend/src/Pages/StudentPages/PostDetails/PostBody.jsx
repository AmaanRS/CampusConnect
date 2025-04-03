import React, { useState } from "react";
import parse from "html-react-parser";

export default function PostBody({ content = "" }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechSynthesis = window.speechSynthesis;

  const cleanText = (htmlString) => {
    // Remove HTML tags
    let text = htmlString.replace(/<[^>]*>/g, "");

    // Remove emojis (covers most Unicode emoji ranges)
    text = text.replace(
      /[\uD83C-\uDBFF\uDC00-\uDFFF]|\p{Extended_Pictographic}/gu,
      ""
    );

    return text.trim();
  };

  const speakText = () => {
    if (!speechSynthesis) {
      alert("Sorry, your browser does not support text-to-speech!");
      return;
    }

    const cleanedContent = cleanText(content);
    if (!cleanedContent) {
      alert("Nothing to read!");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanedContent);
    speechSynthesis.speak(utterance);
    setIsSpeaking(true);

    utterance.onend = () => setIsSpeaking(false);
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="tiptap mt-4">
      {parse(content)}
      <button
        onClick={isSpeaking ? stopSpeaking : speakText}
        className="   mb-2"
      >
        {isSpeaking ? (
          <span className="text-red-600">⛔ Stop</span>
        ) : (
          <span className="text-blue-600">🔊 Listen</span>
        )}
      </button>
    </div>
  );
}
