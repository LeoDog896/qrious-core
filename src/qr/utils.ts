/** Make one property in a type required */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

/**
 * Gets the size of one module in a QR code
 * 
 * For example, if you had a 4x4 grid thats rendering on an 8x8 screen,
 * each module would be 2x2.
 * 
 * @param frameSize - The width of the QR code (frame)
 * @param size - The size of the qr code
 * 
 * @example getModuleSize(frame.width, 100)
 * 
 * @returns The width of the module.
 */
export const getModuleSize = (size: number, frameSize: number): number => {
  return frameSize / size;
};
