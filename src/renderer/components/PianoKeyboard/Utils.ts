export const highlight = (
  containerEl: HTMLDivElement,
  type: 'midi' | 'chroma' | 'name',
  value: number | string,
  className: string
) => {
  const elements = containerEl.querySelectorAll(`.${type}-${value}`);
  if (elements && elements.length) {
    for (let i = 0; i < elements.length; i += 1) {
      elements[i].classList.add(className);
    }
  }
};

export const fade = (containerEl: HTMLDivElement, className: string) => {
  const elements = containerEl.querySelectorAll(`.${className}`);

  if (elements && elements.length) {
    for (let i = 0; i < elements.length; i += 1) {
      elements[i].classList.remove(className);
    }
  }
};

export const highlightNotes = (
  containerEl: HTMLDivElement,
  midi: number[],
  className = 'active'
) => {
  for (let i = 0; i < midi.length; i += 1) {
    highlight(containerEl, 'midi', midi[i], className);
  }
};

export const fadeNotes = (
  containerEl: HTMLDivElement,
  className = 'active'
) => {
  fade(containerEl, className);
};

export const highlightInterval = (
  containerEl: HTMLDivElement,
  chroma: number,
  interval: string,
  displayTonic = true
) => {
  const elements = containerEl.querySelectorAll(`.chroma-${chroma}`);
  if (elements && elements.length) {
    for (let i = 0; i < elements.length; i += 1) {
      if (interval === '1P' && displayTonic) {
        elements[i].classList.add('tonic');
      } else {
        elements[i].classList.add('interval');

        const intervalEl = elements[i].querySelector('.pianoInterval');
        if (intervalEl) {
          intervalEl.innerHTML = interval;
        }
      }
    }
  }
};

export const fadeIntervals = (containerEl: HTMLDivElement) => {
  fade(containerEl, 'tonic');
  const elements = containerEl.querySelectorAll(`.interval`);

  if (elements && elements.length) {
    for (let i = 0; i < elements.length; i += 1) {
      elements[i].classList.remove('interval');

      const intervalEl = elements[i].querySelector('.pianoInterval');
      if (intervalEl) {
        intervalEl.innerHTML = '';
      }
    }
  }
};
