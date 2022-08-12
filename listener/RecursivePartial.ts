import { PrettifyForDisplay } from './PrettifyForDisplay';

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? PrettifyForDisplay<RecursivePartial<U>>[]
    : T[P] extends object
    ? PrettifyForDisplay<RecursivePartial<T[P]>>
    : T[P];
};
