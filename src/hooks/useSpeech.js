import { useState, useRef } from 'react';

export function useSpeech() {
  const [speechStatus, setSpeechStatus] = useState('idle'); // 'idle' | 'speaking' | 'paused'
  const speechRef = useRef(null);

  const speakText = (htmlOrText) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    const div = document.createElement('div');
    div.innerHTML = htmlOrText;
    const plain = div.textContent || div.innerText || '';

    const utt = new SpeechSynthesisUtterance(plain);
    utt.lang = 'es-ES';
    utt.onstart = () => setSpeechStatus('speaking');
    utt.onend = () => setSpeechStatus('idle');
    utt.onpause = () => setSpeechStatus('paused');
    utt.onresume = () => setSpeechStatus('speaking');
    utt.onerror = () => setSpeechStatus('idle');
    
    speechRef.current = utt;
    window.speechSynthesis.speak(utt);
  };

  const pauseSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setSpeechStatus('paused');
    }
  };

  const resumeSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume();
      setSpeechStatus('speaking');
    }
  };

  const cancelSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      speechRef.current = null;
      setSpeechStatus('idle');
    }
  };

  return {
    speechStatus,
    speakText,
    pauseSpeech,
    resumeSpeech,
    cancelSpeech
  };
}
