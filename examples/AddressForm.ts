import {
  createFormValidateResult,
  FormErrorMessages,
  FormValidator,
} from '../helper.ts';

export interface AddressForm {
  zipCode: string;
  area: string;
  city: string;
  town: string;
  address1: string;
  address2?: string;
}

type HttpResponse<T, K> = {
  response: T;
  error?: K;
};

const getAddressFromZipCode = (zipCode: string): HttpResponse<
  { address: Pick<AddressForm, 'area' | 'city' | 'town'> },
  { status: { code: number } }
> => {
  const response = {
    address: {
      area: 'area1',
      city: 'city2',
      town: 'town3',
    },
  };

  return {
    response,
    error: zipCode === '444-4444' ? { status: { code: 404 } } : undefined,
  };
};

export const validator: FormValidator<AddressForm> = (
  parameters: Partial<AddressForm>,
) => {
  const errorMessages: FormErrorMessages<AddressForm> = {};

  if (parameters.zipCode === undefined && parameters.zipCode === '') {
    errorMessages.zipCode = '郵便番号の入力は必須です';
  } else {
    // zipCode が実在するか API でチェックする想定
    const { response, error } = getAddressFromZipCode(parameters.zipCode!);
    const { address } = response;

    if (error !== undefined) {
      errorMessages.zipCode = '郵便番号が正しいかご確認ください';
    } else if (
      parameters.area !== undefined && parameters.area !== address.area
    ) {
      errorMessages.area = '都道府県に誤りがないか確認してください';
    } else if (
      parameters.city !== undefined && parameters.city !== address.city
    ) {
      errorMessages.city = '市区町村に誤りがないか確認してください';
    } else if (
      parameters.town !== undefined && parameters.town !== address.town
    ) {
      errorMessages.town = '市区町村以下に誤りがないか確認してください';
    }
  }

  return createFormValidateResult<AddressForm>(
    parameters,
    errorMessages,
  );
};
