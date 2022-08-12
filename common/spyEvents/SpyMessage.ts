import { SpyEvent } from './SpyEvent';

export type SpyMessage<T extends SpyEvent = SpyEvent> = {
  timestamp: string;
  serviceKey: string;
  data: T;
};
