import { assertEquals } from './dependencies.ts';
import { FormError } from './helper.ts';

Deno.test('Testing FormErrorClass #1', () => {
  const parameters = {
    name: 'hoge',
    birth: {
      year: 1964,
      month: 5,
      day: 24,
    },
    skill: ['ability1', 'ability2', 'ability3'],
  } as const;

  const { invalid, hasError } = new FormError<typeof parameters, ['birthDay']>(
    parameters,
    {
      birthDay: 'something message',
    },
  );

  assertEquals(invalid, {
    name: false,
    birth: false,
    skill: false,
    birthDay: true,
  });
  assertEquals(hasError, true);
});

Deno.test('Testing FormErrorClass #2', () => {
  const parameters = {
    name: 'hoge',
    email: undefined,
  } as const;

  const { invalid, hasError } = new FormError<typeof parameters>(
    parameters,
    {
      email: 'something message',
    },
  );

  assertEquals(invalid, {
    name: false,
    email: true,
  });
  assertEquals(hasError, true);
});

Deno.test('Testing FormErrorClass #3', () => {
  const parameters = {
    name: 'hoge',
    email: undefined,
  } as const;

  const { invalid, hasError } = new FormError<typeof parameters, ['other']>(
    parameters,
    {
      email: 'something message',
    },
  );

  assertEquals(invalid, {
    name: false,
    email: true,
  });
  assertEquals(hasError, true);
});
