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


  useEffect(() => {
    const speechEngine = createSpeechEngine({
      onBoundary: (e: SpeechSynthesisEvent) => {
        console.log(e);
        const range: [number, number] = [ e.charIndex, e.charIndex + e.charLength];
        setCurrentWordRange(range);
      },
      onEnd: (e: SpeechSynthesisEvent) => {
        console.log(e);
        const next = currentSentenceIdx + 1; 
        if (next < sentences.length) {
          setCurrentSentenceIdx(next);
          speechEngine.load(sentences[next]);
        }
      },
      onStateUpdate: (state: PlayingState) => {
        setPlaybackState(state);
      },
    });
    setEngine(speechEngine);
    speechEngine.load(sentences[currentSentenceIdx]);

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

  const setSentences = (ss: string[]) => {
    setCurrentSentenceIdx(0);
    setCurrentWordRange([0, 0]);
    setSentences(ss);
  }


  return {
    currentSentenceIdx,
    currentWordRange,
    playbackState,
    play,
    pause,
    setSentences,
  };
};

export { useSpeech };
