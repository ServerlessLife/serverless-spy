import { SpyEvent } from '../common/spyEvents/SpyEvent';

export interface WaitForParams<TSpyEvent extends SpyEvent = SpyEvent> {
  condition?: (event: TSpyEvent) => boolean;
  timoutMs?: number;
}
