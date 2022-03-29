/**
 * Gets the size of one module in a QR code
 * 
 * For example, if you had a 4x4 grid thats rendering on an 8x8 screen,
 * each module would be 2x2.
 * 
 * @param frameWidth - The width of the QR code (frame)
 * @param size - The size of the qr code
 * 
 * @example getModuleSize(frame.width, 100)
 * 
 * @returns The width of the module.
 */
export const getModuleSize = (size: number, frameSize: number): number => {
  const pixels = Math.floor(frameSize / size);

  // Restricted from 1-? to avoid modules being rendered lower than the resolution.
  return Math.max(1, pixels);
};
