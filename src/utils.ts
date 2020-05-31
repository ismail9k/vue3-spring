/**
 * Find the nearest value in array
 * @param arr
 * @param val
 */
export function getFarestValue(array: Array<number>, goal: number) {
  return array.reduce((prev, curr) =>
    Math.abs(curr - goal) > Math.abs(prev - goal) ? curr : prev
  );
}

/**
 * requestAnimationFrame
 * @param fun
 */
export function requestAnimation(fun: FrameRequestCallback) {
  return window.requestAnimationFrame(fun);
}

/**
 * requestAnimationFrame
 * @param fun
 */
export function cancelAnimation(id: number) {
  return window.cancelAnimationFrame(id);
}
