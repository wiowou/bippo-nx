import REGEX from './regex';

function validate(uuid) {
  return typeof uuid === 'string' && REGEX.test(uuid);
}

export default validate;
