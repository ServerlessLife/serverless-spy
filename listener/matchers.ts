/*
// import { ServerlessSpyListener } from "./ServerlessSpyListener";

type CustomMatcherResult = {
  message: () => string;
  pass: boolean;
};

export const toReceiveEvent = async (
  spy: any,
  serviceKey: string,
  condition?: (data: any) => boolean
): Promise<CustomMatcherResult> => {
  console.log('NOTRI');

  await sleep(3000);

  // console.log("SPY", spy);
  // const events = await spy.awaitEvents((events) => {
  //   return events.some((event) => event["detail-type"] === expected);
  // });

  // const pass = events.some((event) => event["detail-type"] === expected);

  // const message = pass
  //   ? () => {
  //       return (
  //         matcherHint("toHaveEventWithDetailType", "eventsSpy", "detail-type") +
  //         "\n\n" +
  //         `Expected: not ${printExpected(expected)}\n` +
  //         `Number of events: ${printReceived(events.length)}`
  //       );
  //     }
  //   : () => {
  //       return (
  //         matcherHint("toHaveEventWithDetailType", "eventsSpy", "detail-type") +
  //         "\n\n" +
  //         `Expected: ${printExpected(expected)}\n` +
  //         (events.length > 0
  //           ? `Received: ${printReceived(events[0]?.["detail-type"])}`
  //           : `Number of events: ${printReceived(events.length)}`)
  //       );
  //     };

  return { message: () => 'OK', pass: true };
};

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
*/
