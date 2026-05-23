export type PurchaseData = {
  purchaseCases: {
    case: string;
    user: {
      title: string;
      firstName: string;
      lastName: string;
      password: string;
      company: string;
      address1: string;
      address2: string;
      country: string;
      state: string;
      city: string;
      zipCode: string;
      mobileNumber: string;
    };
    product: {
      name: string;
      quantity: number;
    };
    payment: {
      nameOnCard: string;
      cardNumber: string;
      cvc: string;
      expiryMonth: string;
      expiryYear: string;
    };
  }[];
  negativeCases: {
    case: string;
    name: string;
    email: string;
  }[];
  boundaryCases: {
    case: string;
    quantity: number;
  }[];
};
