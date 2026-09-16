/** Camera input is independent of the story clock and all questionnaire state. */
export type GlobeCamera = { longitude: number; latitude: number; zoom: number }
export const DEFAULT_CAMERA: GlobeCamera = { longitude: 15, latitude: 8, zoom: 1 }
export const MIN_ZOOM = 1
export const MAX_ZOOM = 2.4
export function wrapLongitude(longitude: number) { return ((longitude + 180) % 360 + 360) % 360 - 180 }
export function rotateCamera(camera: GlobeCamera, longitude: number, latitude: number): GlobeCamera {
  return { ...camera, longitude: wrapLongitude(camera.longitude + longitude), latitude: Math.max(-89, Math.min(89, camera.latitude + latitude)) }
}
export function dragCamera(start: GlobeCamera, dx: number, dy: number, width: number): GlobeCamera {
  const degrees = 180 / (Math.max(width, 1) * start.zoom)
  return rotateCamera(start, -dx * degrees, dy * degrees)
}
export function zoomCamera(camera: GlobeCamera, zoom: number): GlobeCamera {
  return { ...camera, zoom: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom)) }
}
