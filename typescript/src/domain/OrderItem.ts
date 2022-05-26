import Product from './Product';

class OrderItem {
  private _product: Product;
  private _quantity: number;
  private _taxedAmount: number;
  private _tax: number;

  public get product(): Product {
    return this._product;
  }

  public get quantity(): number {
    return this._quantity;
  }

  public get taxedAmount(): number {
    return this._taxedAmount;
  }

  public get tax(): number {
    return this._tax;
  }

  static create(product: Product, quantity: number): OrderItem {
    const item = new OrderItem();

    item._product = product;
    item._quantity = quantity;

    const unitaryTax: number = Math.round(product.price / 100 * product.category.taxPercentage * 100) / 100;
    const unitaryTaxedAmount: number = Math.round((product.price + unitaryTax) * 100) / 100;
    const taxedAmount: number = Math.round(unitaryTaxedAmount * quantity * 100) / 100;
    const taxAmount: number = unitaryTax * quantity;

    item._tax = taxAmount;
    item._taxedAmount = taxedAmount;

    return item;
  }
}

export default OrderItem;
