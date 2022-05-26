import ApprovedOrderCannotBeRejectedException from '../useCase/ApprovedOrderCannotBeRejectedException';
import OrderCannotBeShippedException from '../useCase/OrderCannotBeShippedException';
import OrderCannotBeShippedTwiceException from '../useCase/OrderCannotBeShippedTwiceException';
import RejectedOrderCannotBeApprovedException from '../useCase/RejectedOrderCannotBeApprovedException';
import ShippedOrdersCannotBeChangedException from '../useCase/ShippedOrdersCannotBeChangedException';
import OrderItem from './OrderItem';
import { OrderStatus } from './OrderStatus';

class Order {
  private _currency: string;
  private _total: number;
  private _items: OrderItem[];
  private _tax: number;
  private _status: OrderStatus;

  constructor(public readonly id?: number) {}

  public get currency(): string {
    return this._currency;
  }

  public get total(): number {
    return this._total;
  }

  public get items(): OrderItem[] {
    return [...this._items];
  }

  public addItem(item: OrderItem): void {
    this._items.push(item);

    this._total += item.taxedAmount;
    this._tax += item.tax;
  }

  public get tax(): number {
    return this._tax;
  }

  public get status(): OrderStatus {
    return this._status;
  }

  private get isShipped(): boolean {
    return this.status === OrderStatus.SHIPPED;
  }

  private get isRejected(): boolean {
    return this.status === OrderStatus.REJECTED;
  }

  private get isApproved(): boolean {
    return this.status === OrderStatus.APPROVED;
  }

  private get isCreated(): boolean {
    return this.status === OrderStatus.CREATED;
  }

  public ship(): void {
    if (this.isCreated || this.isRejected) {
      throw new OrderCannotBeShippedException();
    }

    if (this.isShipped) {
      throw new OrderCannotBeShippedTwiceException();
    }

    this._status = OrderStatus.SHIPPED;
  }

  public approve(): void {
    this.ensureStatusCanBeChanged();

    if (this.isRejected) {
      throw new RejectedOrderCannotBeApprovedException();
    }

    this._status = OrderStatus.APPROVED;
  }

  public reject(): void {
    this.ensureStatusCanBeChanged();

    if (this.isApproved) {
      throw new ApprovedOrderCannotBeRejectedException();
    }

    this._status = OrderStatus.REJECTED;
  }

  private ensureStatusCanBeChanged(): void {
    if (this.isShipped) {
      throw new ShippedOrdersCannotBeChangedException();
    }
  }

  static created(id?: number): Order {
    const order = new Order(id);

    order._total = 0;
    order._currency = 'EUR';
    order._items = [];
    order._tax = 0;
    order._status = OrderStatus.CREATED;

    return order;
  }
}

export default Order;
