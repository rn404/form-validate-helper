import {
  FormError,
  FormErrorClass,
  FormValidator,
} from '../helper.ts';

export interface UserRegister {
  name: string;
  email: string;
}

export const validator: FormValidator<UserRegister, { other: string }> = (
  parameters: Partial<UserRegister>,
) => {
  const errorMessages: FormError<UserRegister, { other: string }>['messages'] = {};

  if (parameters.name !== undefined && parameters.name.length > 25) {
    errorMessages.name = '25文字以内で入力してください';
  }

  if (parameters.name === undefined) {
    errorMessages.name = '名前は必須項目です';
  }

  if (parameters.name === undefined && parameters.email === undefined) {
    errorMessages.other = '名前、メールアドレスは必須項目です';
  }

  const { invalid, messages, hasError } = new FormErrorClass(
    parameters,
    errorMessages,
  );

  return {
    parameters,
    errors: hasError === true ? { invalid, messages, hasError }: undefined,
  };
};
