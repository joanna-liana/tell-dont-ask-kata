import Product from './Product';

export type TaxCalculator = (product: Product, quantity: number) => ItemTax;

export interface ItemTax {
  taxAmount: number;
  taxedAmount: number;
}

export function calculateTax(product: Product, quantity: number): ItemTax {
  const unitaryTax: number = Math.round(product.price / 100 * product.category.taxPercentage * 100) / 100;

  const unitaryTaxedAmount: number = Math.round((product.price + unitaryTax) * 100) / 100;

  const taxedAmount: number = Math.round(unitaryTaxedAmount * quantity * 100) / 100;

  const taxAmount: number = unitaryTax * quantity;

  return { taxAmount, taxedAmount };
}
