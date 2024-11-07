import express, { Application, Request, Response } from "express";
import {
  Stock,
  OrderItem,
  OrderRequest,
  OrderResponse,
} from "./Interfaces/order";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
app.use(express.json());

const decimalPoint = Number(process.env.DECIMAL_POINT);
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post("/order-allocate", (req: Request, res: Response): any => {
  console.time("response time:");

  const { portfolio, totalAmount, orderType}: OrderRequest  = req.body;

  if (!portfolio || portfolio.length <= 0) {
    return res.status(400).send({
      success: false,
      message: "Please provide valid portfolio format.",
    });
  }

  if (!totalAmount || totalAmount <= 0) {
    return res.status(400).send({
      success: false,
      message:
        "Please provide valid Total Amount format. Total amount should be greater than 0 and not negative.",
    });
  }


  let actuallyInvested: number = 0;
  let totalInvested: number = 0;
  let totalWeight: number = 0;
  let notMentionWeight: boolean = false;

  const order = portfolio.map((item: Stock) => {
    if (!item.weight) {
      notMentionWeight = true;
    }

    const weightInDec = Number(item.weight / 100);
    totalWeight += item.weight;

    let amount: number = Number(totalAmount * weightInDec);

    const stockPrice: number =
      typeof item?.currentPrice !== "undefined"
        ? Number(item.currentPrice)
        : Number(process.env.DEFAULT_STOCK_PRICE);

    let quantity: number = Number((amount / stockPrice).toFixed(decimalPoint));

    const moneyAllocated = Number(amount);




    if (moneyAllocated < stockPrice * quantity) {
      quantity =
        Math.floor((amount / stockPrice) * Math.pow(10, decimalPoint)) /
        Math.pow(10, decimalPoint);
    }

    quantity = Number(quantity.toFixed(decimalPoint));
    totalInvested = stockPrice * Number(quantity.toFixed(decimalPoint));
    actuallyInvested += totalInvested;

    const respo: OrderItem = {
      symbol: item.symbol,
      moneyAllocated: amount,
      price: stockPrice,
      quantity: quantity,
      totalInvested: Number(totalInvested.toFixed(decimalPoint)),
    };



    return respo;
  });




  if (totalWeight > 100 || totalWeight <= 0 || notMentionWeight) {
    return res.status(400).send({
      success: false,
      message:
        "Please provide valid stock weight. Sum of the weight of total should not be more than 100",
    });
  }

  const data: OrderResponse = {
    success: true,
    orderType: orderType,
    balance: totalAmount,
    actuallyInvested,
    remainBalance: Number(
      (totalAmount - actuallyInvested).toFixed(decimalPoint)
    ),
    order,
  };

  console.timeEnd("response time:");
  return res.status(200).send(data);
});

app.all("*", (req: Request, res: Response) => {
  res.status(401).send("Invalid Url");
});

app.listen(port, (): void => {
  console.log(`Server is running at http://localhost:${port}`);
});
