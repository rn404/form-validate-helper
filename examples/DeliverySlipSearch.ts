import {
  createFormValidateResult,
  FormErrorMessages,
  FormValidator,
} from '../helper.ts';

/**
 * 普通は伝票番号を入力するだけだが、ここでは便宜上、
 * 伝票の地域絞り込みという目的で配達エリアを入力させているという設定です.
 */

export interface DeliverySlipSearch {
  address: {
    zipCode: string;
    area: string;
  };
  receiptData: Array<{ identifier: string }>;
}

type AdditionalKey = ['address_zipCode', 'address_area'];

export const validator: FormValidator<DeliverySlipSearch, AdditionalKey> = (
  parameters: Partial<DeliverySlipSearch>,
) => {
  const errorMessages: FormErrorMessages<DeliverySlipSearch, AdditionalKey> =
    {};

  if (
    parameters.receiptData === undefined || parameters.receiptData.length === 0
  ) {
    errorMessages.receiptData = '伝票情報は1つ以上入力が必要です';
  }

  if (parameters.address !== undefined) {
    if (
      parameters.address.zipCode === undefined &&
      parameters.address.area
    ) {
      errorMessages.address = '住所の入力は必須です';
    } else if (parameters.address.area === undefined) {
      errorMessages.address_area = '地域を入力してください';
    } else if (parameters.address.zipCode === undefined) {
      errorMessages.address_zipCode = '郵便番号を入力してください';
    }
  }

  return createFormValidateResult<DeliverySlipSearch>(
    parameters,
    errorMessages,
  );
};
