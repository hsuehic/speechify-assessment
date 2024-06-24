import { useState, useEffect } from 'react';

import { PlayingState, SpeechEngine, createSpeechEngine } from './speech';

/*
  @description
  Implement a custom useSpeech hook that uses a speech engine defined in 'speech.ts'
  to play the sentences that have been fetched and parsed previously.
  
  This hook should return react friendly controls for playing, and pausing audio as well as provide information about
  the currently read word and sentence
*/
const useSpeech = (sentences: Array<string>) => {
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [currentWordRange, setCurrentWordRange] = useState<[number, number]>([0, 0]);

  const [playbackState, setPlaybackState] = useState<PlayingState>("paused");

  const [engine, setEngine] = useState<SpeechEngine | undefined>(undefined);

  let currentIndex = currentSentenceIdx;

  useEffect(() => {
    currentIndex = 0;
    const speechEngine = createSpeechEngine({
      onBoundary: (e: SpeechSynthesisEvent) => {
        console.log(e);
        const range: [number, number] = [ e.charIndex, e.charIndex + e.charLength];
        setCurrentWordRange(range);
      },
      onEnd: (e: SpeechSynthesisEvent) => {
        console.log(e);
        console.log(currentSentenceIdx + 1);
        console.log(sentences);
        currentIndex ++;

        if (currentIndex < sentences.length) { 
          setCurrentSentenceIdx(currentIndex);
          speechEngine.load(sentences[currentIndex]);
          speechEngine.play();
        }
      },
      onStateUpdate: (state: PlayingState) => {
        setPlaybackState(state);
      },
    });
    setEngine(speechEngine);
    setCurrentSentenceIdx(currentIndex);
    setCurrentWordRange([0, 0]);
    speechEngine.load(sentences[currentIndex]);

    return () => {
      if (engine) {
        engine.cancel();
      }
    }
  }, [sentences]);

  const play = () => {
    if (engine) {
      engine.play();
    }
  };
  const pause = () => {
    if (engine) {
      engine.pause();
    }
  };

  return {
    currentSentenceIdx,
    currentWordRange,
    playbackState,
    play,
    pause,
  };
};

export { useSpeech };
