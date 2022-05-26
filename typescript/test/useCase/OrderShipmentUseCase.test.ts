import Order from '../../src/domain/Order';
import { OrderStatus } from '../../src/domain/OrderStatus';
import OrderCannotBeShippedException from '../../src/useCase/OrderCannotBeShippedException';
import OrderCannotBeShippedTwiceException from '../../src/useCase/OrderCannotBeShippedTwiceException';
import OrderShipmentRequest from '../../src/useCase/OrderShipmentRequest';
import OrderShipmentUseCase from '../../src/useCase/OrderShipmentUseCase';
import TestOrderRepository from '../doubles/TestOrderRepository';
import TestShipmentService from '../doubles/TestShipmentService';

describe('OrderShipmentUseCase', () => {
  let orderRepository: TestOrderRepository;
  let shipmentService: TestShipmentService;
  let useCase: OrderShipmentUseCase;

  beforeEach(() => {
    orderRepository = new TestOrderRepository();
    shipmentService = new TestShipmentService();
    useCase = new OrderShipmentUseCase(orderRepository, shipmentService);
  });

  it('shipApprovedOrder', () => {
    const initialOrder: Order = Order.created(1);
    initialOrder.approve();
    orderRepository.addOrder(initialOrder);

    const request: OrderShipmentRequest = new OrderShipmentRequest();
    request.setOrderId(1);

    useCase.run(request);

    expect(orderRepository.getSavedOrder().status).toBe(OrderStatus.SHIPPED);
    expect(shipmentService.getShippedOrder()).toBe(initialOrder);
  });

  it('createdOrdersCannotBeShipped', () => {
    const initialOrder: Order = Order.created(2);
    orderRepository.addOrder(initialOrder);

    const request: OrderShipmentRequest = new OrderShipmentRequest();
    request.setOrderId(2);

    expect(() => useCase.run(request)).toThrow(OrderCannotBeShippedException);
    expect(orderRepository.getSavedOrder()).toBe(null);
    expect(shipmentService.getShippedOrder()).toBe(null);
  });

  it('rejectedOrdersCannotBeShipped', () => {
    const initialOrder: Order = Order.created(3);
    initialOrder.reject();
    orderRepository.addOrder(initialOrder);

    const request: OrderShipmentRequest = new OrderShipmentRequest();
    request.setOrderId(3);

    expect(() => useCase.run(request)).toThrow(OrderCannotBeShippedException);
    expect(orderRepository.getSavedOrder()).toBe(null);
    expect(shipmentService.getShippedOrder()).toBe(null);
  });

  it('shippedOrdersCannotBeShippedAgain', () => {
    const initialOrder: Order = new Order(4);
    initialOrder.ship();
    orderRepository.addOrder(initialOrder);

    const request: OrderShipmentRequest = new OrderShipmentRequest();
    request.setOrderId(4);

    expect(() => useCase.run(request)).toThrow(OrderCannotBeShippedTwiceException);
    expect(orderRepository.getSavedOrder()).toBe(null);
    expect(shipmentService.getShippedOrder()).toBe(null);
  });
});
