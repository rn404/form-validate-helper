import { assertEquals } from '../dependencies.ts';
import { UserRegister, validator } from './UserRegister.ts';

const fullFillForm: UserRegister = {
  name: 'tarou',
  email: 'hoge@hoge',
};

const emptyForm = {
  name: undefined,
  email: undefined,
};

const onlyEmailExistForm = {
  email: 'hoge@hoge',
};

Deno.test('Hello world #1', () => {
  const actual = validator(fullFillForm);

  const expected = {
    parameters: fullFillForm,
    errors: undefined,
  };

  assertEquals(actual, expected);
});

Deno.test('Hello world #2', () => {
  const actual = validator(onlyEmailExistForm);

  const expected = {
    parameters: onlyEmailExistForm,
    errors: {
      invalid: {
        name: true,
        email: false,
      },
      messages: {
        name: '名前は必須項目です',
      },
      hasError: true,
    },
  };

  assertEquals(actual, expected);
});

Deno.test('Hello world #3', () => {
  const actual = validator(emptyForm);

  const expected = {
    parameters: emptyForm,
    errors: {
      invalid: {
        name: true,
        email: false,
        other: true,
      },
      messages: {
        name: '名前は必須項目です',
        other: '名前、メールアドレスは必須項目です',
      },
      hasError: true,
    },
  };

  assertEquals(actual, expected);
});
