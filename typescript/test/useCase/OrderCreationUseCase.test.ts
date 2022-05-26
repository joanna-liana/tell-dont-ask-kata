import Category from '../../src/domain/Category';
import Order from '../../src/domain/Order';
import { OrderStatus } from '../../src/domain/OrderStatus';
import Product from '../../src/domain/Product';
import { ProductCatalog } from '../../src/repository/ProductCatalog';
import OrderCreationUseCase from '../../src/useCase/OrderCreationUseCase';
import SellItemRequest from '../../src/useCase/SellItemRequest';
import SellItemsRequest from '../../src/useCase/SellItemsRequest';
import UnknownProductException from '../../src/useCase/UnknownProductException';
import InMemoryProductCatalog from '../doubles/InMemoryProductCatalog';
import TestOrderRepository from '../doubles/TestOrderRepository';

describe('Order Creation Use Case', () => {
  const orderRepository: TestOrderRepository = new TestOrderRepository();
  const food: Category = new Category(
    'food',
    10
  );

  const saladProduct = new Product(
    'salad',
    3.56,
    food
  );

  const tomatoProduct = new Product(
    'tomato',
    4.65,
    food
  );

  const productCatalog: ProductCatalog = new InMemoryProductCatalog([saladProduct, tomatoProduct]);
  const useCase: OrderCreationUseCase = new OrderCreationUseCase(orderRepository, productCatalog);

  it('sellMultipleItems', () => {
    // given
    const saladRequest: SellItemRequest = new SellItemRequest(
      'salad',
      2
    );

    const tomatoRequest: SellItemRequest = new SellItemRequest(
      'tomato',
      3
    );

    const request: SellItemsRequest = new SellItemsRequest();
    request.setRequests([]);
    request.getRequests().push(saladRequest);
    request.getRequests().push(tomatoRequest);

    // when
    useCase.run(request);

    // then
    const insertedOrder: Order = orderRepository.getSavedOrder();
    expect(insertedOrder.status).toBe(OrderStatus.CREATED);
    expect(insertedOrder.total).toBe(23.20);
    expect(insertedOrder.tax).toBe((2.13));
    expect(insertedOrder.currency).toBe(('EUR'));

    expect(insertedOrder.items.length).toBe(2);
    expect(insertedOrder.items[0].product.name).toBe('salad');
    expect(insertedOrder.items[0].product.price).toBe(3.56);
    expect(insertedOrder.items[0].quantity).toBe(2);
    expect(insertedOrder.items[0].taxedAmount).toBe(7.84);
    expect(insertedOrder.items[0].tax).toBe(0.72);
    expect(insertedOrder.items[1].product.name).toBe('tomato');
    expect(insertedOrder.items[1].product.price).toBe(4.65);
    expect(insertedOrder.items[1].quantity).toBe(3);
    expect(insertedOrder.items[1].taxedAmount).toBe(15.36);
    expect(insertedOrder.items[1].tax).toBe(1.41);
  });

  it('unknownProduct', () => {
    const request: SellItemsRequest = new SellItemsRequest();
    request.setRequests([]);
    const unknownProductRequest: SellItemRequest = new SellItemRequest(
      'unknown product'
    );
    request.getRequests().push(unknownProductRequest);

    expect(() => useCase.run(request)).toThrow(UnknownProductException);
  });
});
