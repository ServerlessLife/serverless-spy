import { SpyEvent } from './SpyEvent';

export interface S3SpyEvent extends SpyEvent {
  spyEventType: 'S3';
  eventName: string;
  eventTime: string;
  bucket: string;
  key: string;
}
