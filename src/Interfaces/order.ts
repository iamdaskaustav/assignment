export interface Stock{
    symbol:string;
    weight:number;
    currentPrice?:number
}

export interface OrderItem{
    symbol:string;
    moneyAllocated:number;
    price:number;
    quantity:number;
    totalInvested:number;
}

export interface OrderRequest{
    portfolio:Stock[];
    orderType:string;
    totalAmount:number;
}

export interface OrderResponse{
    success: boolean;
    orderType: string;
    balance:number;
    actuallyInvested: number;
    remainBalance:number;
    order: OrderItem[];
}