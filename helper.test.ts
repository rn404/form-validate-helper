import { assertEquals } from './dependencies.ts';
import { createFormValidateResult } from './helper.ts';

Deno.test('createFormValidateResult: No error without errorMessages', () => {
  const parameters = {
    name: 'tom',
    email: 'aaa@aaa',
  } as const;

  const { errors } = createFormValidateResult<typeof parameters>(
    parameters,
    {},
  );

  assertEquals(errors, undefined);
});

Deno.test('createFormValidateResult: No error without errorMessages, even when array values are included', () => {
  const parameters = {
    shipCodes: ['0001', '0002', '0003', '000004'],
  } as const;

  const { errors } = createFormValidateResult<typeof parameters>(
    parameters,
    {},
  );

  assertEquals(errors, undefined);
});

Deno.test('createFormValidateResult: errorMessages is correctly applied to invalid', () => {
  const parameters = {
    name: 'tom',
    email: 'aaa@aaa',
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

Deno.test('createFormValidateResult: errorMessages is correctly applied to invalid. Even if if parameter values are missing', () => {
  const parameters: Partial<{
    name: string;
    email: string;
  }> = {
    name: 'tom',
  };

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

Deno.test('createFormValidateResult: Adding errorMessages with key that is not in parameters is applied to invalid', () => {
  const parameters = {
    name: 'tom',
    email: 'aaa@aaa',
  } as const;

  const { errors } = createFormValidateResult<typeof parameters, ['other']>(
    parameters,
    {
      other: 'something message',
    },
  );

  assertEquals(errors?.invalid, {
    name: false,
    email: false,
    other: true,
  });
});

Deno.test('createFormValidateResult: Additional keys are not applied to invalid if there is no errorMessages', () => {
  const parameters = {
    name: 'tom',
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

Deno.test('createFormValidateResult: If errorMessages correctly refers to Array, invalid returns Array<boolean>', () => {
  const parameters = {
    shipCodes: ['0001', '0002', '0003', '000004'],
  } as const;

  const { errors } = createFormValidateResult<typeof parameters>(
    parameters,
    {
      shipCodes: [undefined, undefined, undefined, 'too long'],
    },
  );

  assertEquals(errors?.invalid, {
    shipCodes: [false, false, false, true],
  });
});

Deno.test('createFormValidateResult: If errorMessages correctly refers to Array, invalid returns Array<boolean>. Even if it contains empty', () => {
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

Deno.test('createFormValidateResult: errorMessages always override invalid, even when array values are included', () => {
  const parameters = {
    skills: [],
  } as const;

  const { errors } = createFormValidateResult<typeof parameters>(
    parameters,
    { skills: '1 or more required' },
  );

  assertEquals(errors?.invalid, {
    skills: true,
  });
});

Deno.test('createFormValidateResult: errorMessages always override invalid, even when object values are included', () => {
  const parameters = {
    address: {
      zipCode: '123-4567',
      area: 'area01',
      town: 'town01',
      contact: {
        telnumber: '810-9999-9999',
      },
    },
  } as const;

  const { errors } = createFormValidateResult<typeof parameters>(
    parameters,
    {
      address: 'something wrong',
    },
  );

  assertEquals(errors?.invalid, {
    address: true,
  });
});
