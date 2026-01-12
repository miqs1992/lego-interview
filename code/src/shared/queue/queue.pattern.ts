export enum QueuePattern {
  DEVICE_HEARTBEAT = 'devices/+/connection',
  DEVICE_REBOOT = 'devices/+/reboot',
  DEVICE_DATA = 'devices/+/data',
}

export const setPatternIdentifier = (pattern: QueuePattern, id: string): string => {
  return pattern.replace('+', id);
};
