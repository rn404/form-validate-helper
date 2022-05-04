TBD

# Motivation

フォームの値を検証し、エラーがあればフォームに表示する.
フロントエンドエンジニアなら何度も実装してきたと思います.
その実装の一部を定型化するために作りました.

# Usage

`helper.ts` が本体です. `examples` には実際の使われ方を想定したコードを書いています.

```ts
// validator.ts
import {
  createFormValidateResult,
  FormErrorMessages,
  FormValidator,
} from 'helper.ts';

export interface UserRegister {
  name: string;
  email: string;
}

export const validator: FormValidator<UserRegister> = (
  parameters: Partial<UserRegister>,
) => {
  const errorMessages: FormErrorMessages<UserRegister> = {};

  // checking parameters value
  // and add errorMessages

  return createFormValidateResult<UserRegister>(
    parameters,
    errorMessages,
  );
};
```

`template` での使い方は、以下のようにします.

```ts
// examples.ts
import { UserRegister, validator } from 'validator.ts';

const parameters: UserRegister = {
  /* ... */
};

const { errors } = validator(parameters);

if (errors === undefined) {
  displayError('フォームの内容を確認してください');
  return;
}

postForm(parameters);
```

```tsx
// vue markup sample
<div v-if="errors.invalid.name === true">
  {{ errors.message.name }}
<div>
```
