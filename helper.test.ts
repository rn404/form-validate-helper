import { assertEquals } from './dependencies.ts';
import { createFormValidateResult } from './helper.ts';

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

  const { errors } = createFormValidateResult<typeof parameters, ['birthDay']>(
    parameters,
    {
      birthDay: 'something message',
    },
  );

  assertEquals(errors?.invalid, {
    name: false,
    birth: false,
    skill: [false, false, false],
    birthDay: true,
  });
});

Deno.test('Testing FormErrorClass #2', () => {
  const parameters = {
    name: 'hoge',
    email: undefined,
  } as const;

  const { errors } = createFormValidateResult<typeof parameters>(
    parameters,
    {
      email: 'something message',
    },
  );

  assertEquals(errors?.invalid, {
    name: false,
    email: true,
  });
});

Deno.test('Testing FormErrorClass #3', () => {
  const parameters = {
    name: 'hoge',
    email: undefined,
  } as const;

  const { errors } = createFormValidateResult<typeof parameters, ['other']>(
    parameters,
    {
      email: 'something message',
    },
  );

  assertEquals(errors?.invalid, {
    name: false,
    email: true,
  });
});

Deno.test('Testing FormErrorClass #4', () => {
  const parameters = {
    shipCodes: ['0001', '0002', '0003', '000004'],
  } as const;

  const { errors } = createFormValidateResult<typeof parameters>(
    parameters,
    {
      shipCodes: [, , , 'too long'],
    },
  );

  assertEquals(errors?.invalid, {
    shipCodes: [false, false, false, true],
  });
});

Deno.test('Testing FormErrorClass #5', () => {
  const parameters = {
    shipCodes: ['0001', '0002', '0003', '000004'],
  } as const;

  const { errors } = createFormValidateResult<typeof parameters>(
    parameters,
    {},
  );

  assertEquals(errors?.invalid, undefined);
});

Deno.test('Testing FormErrorClass #6', () => {
  const parameters = {
    skills: []
  } as const;

  const { errors } = createFormValidateResult<typeof parameters>(
    parameters,
    { skills: '1 or more required' },
  );

  assertEquals(errors?.invalid, {
    skills: true
  });
});
