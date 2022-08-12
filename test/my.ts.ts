import * as fs from 'fs';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { createServerlessSpyListener } from 'serverless-spy';
import { SpyEvents } from './SpyEvents';

jest.setTimeout(30000);

describe('Ingredient DAL', () => {
  const output: any = JSON.parse(
    fs.readFileSync('../cdk/cdkExports.json').toString()
  );

  test('two plus two is four', async () => {
    // expect(2 + 2).toBe(4);
    const serverlessSpyListener = await createServerlessSpyListener<SpyEvents>({
      // events: SpyEvents,
      serverlessSpyWsUrl: output.ServerlessSpyWsUrl,
    });

    const lambdaClient = new LambdaClient({});

    const data = <DataType>{
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
    };

    const command = new InvokeCommand({
      FunctionName: output.FunctionNameTestA,
      // FunctionName: "dev-smooth-test-SmoothTest-TestA10A9AF62-TOBalsgDLBhU",
      InvocationType: 'RequestResponse',
      LogType: 'Tail',
      Payload: JSON.stringify(data) as any,
    });

    const r = await lambdaClient.send(command);
    JSON.parse(Buffer.from(r.Payload!).toString());

    // expect(data).toMatchObject;

    // await expect(serverlessSpyListener).toReceiveEvent(
    //   "Function#TestA#Request"
    // );

    /*
    (
      await (
        await (
          await serverlessSpyListener.waitForFunctionTestARequest<DataType>(
            (data) => data.request.key1 === "value1"
          )
        )
          .toMatchObject(data)
          .follwedByConsoleLog()
      )
        .toMatchObject(data)
        .follwedByResponse()
    ).toMatchObject(data);
    */

    // @ts-ignore

    const f = (
      await serverlessSpyListener.waitForFunctionTestARequest<DataType>()
    ).getData();
    console.log('req', f.request.key1);

    const waitForRequest = (
      await serverlessSpyListener.waitForFunctionTestARequest<DataType>()
    )
      .toMatchObject({
        request: { key1: 'value1' },
      })
      .toMatchObject({ request: { key2: 'value2' } })
      .toMatchObject({ request: { key3: 'value3' } });

    const req = waitForRequest.getData();
    console.log('req', req.request.key1);

    const resp = (
      await waitForRequest.followedByResponse<DataType>({
        condition: (d) => {
          return d.response.key1 === 'value1';
        },
      })
    )
      .toMatchObject({ response: { key2: 'value2' } })
      .getData();

    console.log('resp', resp.response.key1);

    await serverlessSpyListener.waitForDynamoDBDDBTable<DataType>({
      condition: (d) => d.newImage.key1 === 'value1',
    });

    const x = (
      await serverlessSpyListener.waitForDynamoDBDDBTable<DataType>({
        condition: (d) => d.newImage.key1 === 'value1',
      })
    )
      .toMatchObject({ newImage: { key2: 'value2' } })
      .getData();
    console.log('x', x.newImage.key1);

    // const d = (
    //   await serverlessSpyListener.waitForDynamoDBDDBTable<DataType>({
    //     condition: (d) => d.data.newImage.data.key1 === "value1",
    //     timoutMs: 10000,
    //   })
    // ).getData(); //toMatchObject({ newImage: { data: { key1: "value1" } } });
    // console.log(d.newImage.key1);

    serverlessSpyListener.stop();
  });
});

type DataType = {
  key1: string;
  key2: string;
  key3: string;
};
