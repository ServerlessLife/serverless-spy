export const handler = async (event: any) => {
  console.log('RECEIVED EVENT:', JSON.stringify(event));

  return { message: 'Hello SST1' };
};
