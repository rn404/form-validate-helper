import { FormErrorMessages, FormValidator, createFormValidateResult } from '../helper.ts';

export interface UserRegister {
  name: string;
  email: string;
}

export const validator: FormValidator<UserRegister, ['other']> = (
  parameters: Partial<UserRegister>,
) => {
  const errorMessages: FormErrorMessages<UserRegister, ['other']> = {};

  if (parameters.name !== undefined && parameters.name.length > 25) {
    errorMessages.name = '25文字以内で入力してください';
  }

  if (parameters.name === undefined) {
    errorMessages.name = '名前は必須項目です';
  }

  if (parameters.name === undefined && parameters.email === undefined) {
    errorMessages.other = '名前、メールアドレスは必須項目です';
  }

  return createFormValidateResult<UserRegister, ['other']>(
    parameters,
    errorMessages,
  )
};
