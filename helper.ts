const createEmpty = <T extends Record<string | number, unknown>>() => {
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
      [key in keyof T]: boolean | Array<boolean>;
    }
    & {
      [key in K[number]]?: boolean | Array<boolean>;
    };
  /**
   * alias -> FormErrorMessages<T, K>
   */
  messages:
    & {
      [key in keyof T]?: string | Array<string | undefined>;
    }
    & {
      [key in K[number]]?: string | Array<string | undefined>;
    };
  hasError: boolean;
}

/**
 * type alias
 */
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
    public messages: FormErrorMessages<T, K>,
  ) {
    this.#parameters = parameters;
  }

  get invalid(): FormError<T, K>['invalid'] {
    const paramsInvalid = createEmpty<
      { [key in keyof T]: boolean | Array<boolean> }
    >();
    const messagesInvalid = createEmpty<
      { [key in keyof FormErrorMessages<T, K>]: boolean | Array<boolean> }
    >();

    Object.keys(this.#parameters).forEach((key: keyof T) => {
      paramsInvalid[key] = Array.isArray(this.#parameters[key]) === true
        ? new Array(this.#parameters[key].length)
          .fill(false)
          .map((_value, index) => {
            const message = this.messages[key];
            if (message === undefined) return false;

            return message[index] !== undefined;
          })
        : paramsInvalid[key] = this.messages[key] !== undefined;
    });

    Object.keys(this.messages).forEach(
      (key: keyof FormErrorMessages<T, K>) => {
        messagesInvalid[key] = Array.isArray(this.messages[key]) === true
          ? new Array((this.messages[key] as Array<any>).length)
            .fill(undefined)
            .map((_message, index) => {
              const value = this.messages[key] as Array<string | undefined>;
              return value[index] !== undefined;
            })
          : this.messages[key] !== undefined;
      },
    );

    return Object.assign(paramsInvalid, messagesInvalid);
  }

  get hasError(): boolean {
    return Object.keys(this.messages).map((key) => this.messages[key] ?? null)
      .some((
        value,
      ) => value !== undefined);
  }
}

export interface FormValidateResult<
  T extends FormParameters,
  K extends Array<string | number> = [],
> {
  parameters: Partial<T>;
  errors?: Omit<FormError<T, K>, 'hasError'>;
}

export type FormValidator<
  T extends FormParameters,
  K extends Array<string | number> = [],
> = (parameters: Partial<T>) => FormValidateResult<T, K>;

export const createFormValidateResult = <
  T extends FormParameters,
  K extends Array<string | number> = [],
>(
  parameters: Partial<T>,
  errorMessages: FormErrorMessages<T, K>,
): FormValidateResult<T, K> => {
  const { invalid, messages, hasError } = new FormErrorInstance<T, K>(
    parameters,
    errorMessages,
  );

  return {
    parameters,
    errors: hasError === true ? { invalid, messages } : undefined,
  };
};
