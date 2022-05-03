export const createEmpty = <T extends Record<string | number, unknown>>() => {
  return {} as T;
};

export interface FormParameters {
  [key: string | number]: any;
}

export interface FormError<
  T extends FormParameters,
  K extends Array<string | number> = [],
> {
  invalid:
    & {
      [key in keyof T]: boolean;
    }
    & {
      [key in K[number]]?: boolean;
    };
  messages:
    & {
      [key in keyof T]?: string;
    }
    & {
      [key in K[number]]?: string;
    };
  hasError: boolean;
}

export type FormErrorMessages<
  T extends FormParameters,
  K extends Array<string | number> = [],
> = FormError<T, K>['messages'];

class FormErrorInstance<
  T extends FormParameters,
  K extends Array<string | number> = [],
> implements FormError<T, K> {
  #parameters: Partial<T>;

  constructor(
    parameters: Partial<T>,
    public messages: FormError<T, K>['messages'],
  ) {
    this.#parameters = parameters;
  }

  get invalid(): FormError<T, K>['invalid'] {
    const paramsInvalid = createEmpty<{ [key in keyof T]: boolean }>();
    const messagesInvalid = createEmpty<
      { [key in keyof FormErrorMessages<T, K>]: boolean }
    >();

    Object.keys(this.#parameters).forEach((key: keyof T) => {
      paramsInvalid[key] = this.messages[key] !== undefined;
    });

    Object.keys(this.messages).forEach(
      (key: keyof FormError<T, K>['messages']) => {
        messagesInvalid[key] = this.messages[key] !== undefined;
      },
    );

    return Object.assign(paramsInvalid, messagesInvalid);
  }

  get hasError(): boolean {
    return Object.keys(this.messages).map((key) => this.messages[key]).some((
      value,
    ) => value !== undefined);
  }
}

export interface FormValidateResult<
  T extends FormParameters,
  K extends Array<string | number> = [],
> {
  parameters: Partial<T>;
  errors?: FormError<T, K>;
}

export type FormValidator<
  T extends FormParameters,
  K extends Array<string | number> = [],
> = (parameters: Partial<T>) => FormValidateResult<T, K>;

export const createFormValidateResult = <
  T extends FormParameters,
  K extends Array<string | number> = [],
>(parameters: Partial<T>, errorMessages: FormErrorMessages<T, K>): FormValidateResult<T, K> => {
  const { invalid, messages, hasError } = new FormErrorInstance<T, K>(
    parameters,
    errorMessages,
  );

  return {
    parameters,
    errors: hasError === true ? { invalid, messages, hasError } : undefined,
  };
}
