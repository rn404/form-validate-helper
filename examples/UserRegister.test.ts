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
  const { errors } = validator(fullFillForm);

  assertEquals(errors, undefined);
});

Deno.test('Hello world #2', () => {
  const { errors } = validator(onlyEmailExistForm);

  const expected = {
    invalid: {
      name: true,
      email: false,
    },
    messages: {
      name: '名前は必須項目です',
    },
  };

  assertEquals(errors, expected);
});

Deno.test('Hello world #3', () => {
  const { errors } = validator(emptyForm);

  const expected = {
    invalid: {
      name: true,
      email: false,
      other: true,
    },
    messages: {
      name: '名前は必須項目です',
      other: '名前、メールアドレスは必須項目です',
    },
  };

  assertEquals(errors, expected);
});
