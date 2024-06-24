import { PlayingState } from '../lib/speech';

/*
 * Implement a component that provides basic UI options such as playing, pausing and loading new content
 * This component should have the following,
 * - A button with text "Play" if the player is not playing
 * - A button with text "Pause" if the player is playing
 * - A button with text "Load new content" that loads new content from the API
 */
export const Controls = ({
  play,
  pause,
  loadNewContent,
  state,
}: {
  play: () => void;
  pause: () => void;
  loadNewContent: () => void;
  state: PlayingState;
}) => {
  return <div>
    <button data-testid="action-play" disabled={state === 'playing'} onClick={() => {play(); }}>Play</button>
    <button data-testid="action-pause" disabled={ state !== 'playing'} onClick={() => { pause(); }}>Pause</button>
    <button data-testid="action-loadcontent" disabled={state === 'playing'} onClick={() => { loadNewContent();}}>Load new content</button>
  </div>;
};
