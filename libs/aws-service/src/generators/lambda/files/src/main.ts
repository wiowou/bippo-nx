import { Context, Handler } from 'aws-lambda';
import * as AppService from './app/app.service';

export const handler: Handler = async (event, context: Context) => {
  console.log(event, context.functionName);

  const message = await AppService.getData();

  return {
    body: JSON.stringify(message),
  };
};
