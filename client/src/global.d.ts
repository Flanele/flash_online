declare global {
  interface RufflePlayerElement extends HTMLElement {
    load: (url: string) => void;
    play: () => void;
    pause: () => void;
  }

  interface RuffleConstructor {
    createPlayer: () => RufflePlayerElement;
  }

  interface Window {
    RufflePlayer: {
      newest: () => RuffleConstructor;
    };
  }
}

export {};