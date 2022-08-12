export type PrettifyForDisplay<T> = T extends Function
  ? T
  : {
      [K in keyof T]: T[K];
    };
