import { TestData } from '../test/TestData';
export const handler = async (event: TestData) => {
  return <TestData>{
    ...event,
    message: `${event.message} ServerlessSpy`,
  };
};
