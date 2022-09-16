import { TestData } from '../test/TestData';
export const handler = async (event: TestData) => {
  console.log('My console log message', event);

  return <TestData>{
    ...event,
    message: `${event.message} ServerlessSpy`,
  };
};
