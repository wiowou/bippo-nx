import { handler } from './main';

const input = {
  arg1: 'blah',
  arg2: 4,
};

handler(input).then((result) => {
  console.log('result', result);
});
