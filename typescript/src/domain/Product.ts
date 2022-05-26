import Category from './Category';

class Product {
  constructor(
    public readonly name: string,
    public readonly price: number,
    public readonly category: Category,
  ) {}
}

export default Product;
