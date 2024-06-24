import './App.css';

import { useState, useEffect } from 'react';

import { Controls } from './components/Controls';
import { CurrentlyReading } from './components/CurrentlyReading';
import { useSpeech } from './lib/useSpeech';
import { fetchContent, parseContentIntoSentences } from './lib/content';

function App() {
  const [sentences, setSentences] = useState<Array<string>>([]);
  const { 
    currentSentenceIdx,
    currentWordRange,
    playbackState,
    play,
    pause,
  } = useSpeech(sentences);

  useEffect(() => {
    fetchContent().then((ssml) => {
      const ss = parseContentIntoSentences(ssml);
      setSentences(ss);
    });
  }, []);

  return (
    <div className="App">
      <h1>Text to speech</h1>
      <div>
        <CurrentlyReading sentences={sentences} currentSentenceIdx={currentSentenceIdx} currentWordRange={currentWordRange} />
      </div>
      <div>
        <Controls play={play} pause={pause} loadNewContent={() => {
          fetchContent().then((ssml) => {
            const ss = parseContentIntoSentences(ssml);
            setSentences(ss);
          });
        }} state={playbackState} />
      </div>
    </div>
  );
}

export default App;
