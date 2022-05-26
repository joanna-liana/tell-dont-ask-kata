class SellItemRequest {
  constructor(
    public readonly productName: string,
    public readonly quantity?: number,
  ) {}
}

export default SellItemRequest;
