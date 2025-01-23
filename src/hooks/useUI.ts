export const useUi = () => {
  const setTransition = (
    element: HTMLElement,
    transition: string,
    duration: number,
    hide?: boolean
  ) => {
    element.classList.add(
      `transition-${transition}`,
      'ease-in-out',
      `duration-${duration}`
    );
    element.classList.remove('hidden');

    setTimeout(() => {
      if (hide) {
        element.classList.add('hidden');
      } else if (element.offsetTop > 200) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, duration);
  };

  const animateResize = (
    element: HTMLElement | null,
    duration: number,
    hide?: boolean
  ) => {
    if (!element) {
      return;
    }

    setTransition(element, 'maxheight', duration, hide);

    if (hide) {
      element.classList.remove('max-h-screen');
      element.classList.add('max-h-0');
    } else {
      element.classList.remove('hidden');
      setTimeout(() => {
        element.classList.remove('max-h-0');
        element.classList.add('max-h-screen');
      }, duration / 100);
    }
  };

  const animateBg = (
    element: HTMLElement | null,
    color: string,
    startColor: string,
    duration: number
  ) => {
    if (!element) {
      return;
    }

    setTransition(element, 'colors', duration);

    setTimeout(() => {
      element.classList.remove(startColor);
      element.classList.add(`${color}`);
    }, duration / 100);
    setTimeout(() => {
      element.classList.remove(color);
      element.classList.add(startColor);
    }, duration);
  };

  const animateOpacity = (
    element: HTMLElement | null,
    duration: number,
    hide?: boolean
  ) => {
    if (!element) {
      return;
    }

    setTransition(element, 'opacity', duration, hide);

    if (hide) {
      element.classList.remove('opacity-100');
      element.classList.add('opacity-0');
    } else {
      element.classList.remove('hidden');
      setTimeout(() => {
        element.classList.remove('opacity-0');
        element.classList.add('opacity-100');
      }, duration / 100);
    }
  };

  return {
    animateResize,
    animateBg,
    animateOpacity,
  };
};
