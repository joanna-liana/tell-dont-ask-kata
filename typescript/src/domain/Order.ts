import OrderCannotBeShippedException from '../useCase/OrderCannotBeShippedException';
import OrderCannotBeShippedTwiceException from '../useCase/OrderCannotBeShippedTwiceException';
import OrderItem from './OrderItem';
import { OrderStatus } from './OrderStatus';

class Order {
  private total: number;
  private currency: string;
  private items: OrderItem[];
  private tax: number;
  private status: OrderStatus;
  private id: number;

  public getTotal(): number {
    return this.total;
  }

  public getCurrency(): string {
    return this.currency;
  }

  public getItems(): OrderItem[] {
    return this.items;
  }

  public addItem(item: OrderItem): void {
    this.items.push(item);

    this.total += item.getTaxedAmount();
    this.tax += item.getTax();
  }

  public getTax(): number {
    return this.tax;
  }

  public getStatus(): OrderStatus {
    return this.status;
  }

  public setStatus(status: OrderStatus): void {
    this.status = status;
  }

  public getId(): number {
    return this.id;
  }

  public setId(id: number): void {
    this.id = id;
  }

  private get isShipped(): boolean {
    return this.getStatus() === OrderStatus.SHIPPED;
  }

  private get isRejected(): boolean {
    return this.getStatus() === OrderStatus.REJECTED;
  }

  private get isCreated(): boolean {
    return this.getStatus() === OrderStatus.CREATED;
  }

  public ship(): void {
    if (this.isCreated || this.isRejected) {
      throw new OrderCannotBeShippedException();
    }

    if (this.isShipped) {
      throw new OrderCannotBeShippedTwiceException();
    }

    this.status = OrderStatus.SHIPPED;
  }

  static created(id?: number): Order {
    const order = new Order();

    order.id = id;
    order.total = 0;
    order.currency = 'EUR';
    order.items = [];
    order.tax = 0;
    order.status = OrderStatus.CREATED;

    return order;
  }
}

export default Order;
