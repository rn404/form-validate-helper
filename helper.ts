export const createEmpty = <T extends Record<string | number, unknown>>() => {
  return {} as T;
};

export interface FormParameters {
  [key: string | number]: any;
}

export interface FormError<
  T extends FormParameters,
  Append extends FormParameters = Record<never, never>
> {
  invalid:
    & {
      [key in keyof T]: boolean;
    }
    & {
      [key in keyof Append]: boolean;
    };
  messages:
    & {
      [key in keyof T]?: string;
    }
    & {
      [key in keyof Append]?: string;
    };
  hasError: boolean;
}

export class FormErrorClass<
  T extends FormParameters,
  Append extends FormParameters = Record<never, never>,
> implements FormError<T, Append> {
  #parameters: T;

  constructor(
    parameters: T,
    public messages: FormError<T, Append>['messages'],
  ) {
    this.#parameters = parameters;
  }

  get invalid(): FormError<T, Append>['invalid'] {
    const paramsInvalid = createEmpty<{ [key in keyof T]: boolean }>();
    const messagesInvalid = createEmpty<
      { [key in keyof FormError<T, Append>['messages']]: boolean }
    >();

    Object.keys(this.#parameters).forEach((key: keyof T) => {
      paramsInvalid[key] = this.messages[key] !== undefined;
    });

    Object.keys(this.messages).forEach((key: keyof Append) => {
      messagesInvalid[key] = this.messages[key] !== undefined;
    });

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
  Append extends FormParameters = Record<never, never>,
> {
  parameters: Partial<T>;
  errors?: FormError<T, Append>;
}

export type FormValidator<
  T extends FormParameters,
  Append extends FormParameters = Record<never, never>,
> = (parameters: Partial<T>) => FormValidateResult<T, Append>;
