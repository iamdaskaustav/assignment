"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const decimalPoint = Number(process.env.DECIMAL_POINT);
const port = process.env.PORT;
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
app.post("/order-allocate", (req, res) => {
    console.time("response time:");
    const { portfolio, totalAmount, orderType } = req.body;
    if (!portfolio || portfolio.length <= 0) {
        return res.status(400).send({
            success: false,
            message: "Please provide valid portfolio format.",
        });
    }
    if (!totalAmount || totalAmount <= 0) {
        return res.status(400).send({
            success: false,
            message: "Please provide valid Total Amount format. Total amount should be greater than 0 and not negative.",
        });
    }
    let actuallyInvested = 0;
    let totalInvested = 0;
    let totalWeight = 0;
    let notMentionWeight = false;
    const order = portfolio.map((item) => {
        if (!item.weight) {
            notMentionWeight = true;
        }
        const weightInDec = Number(item.weight / 100);
        totalWeight += item.weight;
        let amount = Number(totalAmount * weightInDec);
        const stockPrice = typeof (item === null || item === void 0 ? void 0 : item.currentPrice) !== "undefined"
            ? Number(item.currentPrice)
            : Number(process.env.DEFAULT_STOCK_PRICE);
        let quantity = Number((amount / stockPrice).toFixed(decimalPoint));
        const moneyAllocated = Number(amount);
        if (moneyAllocated < stockPrice * quantity) {
            quantity =
                Math.floor((amount / stockPrice) * Math.pow(10, decimalPoint)) /
                    Math.pow(10, decimalPoint);
        }
        quantity = Number(quantity.toFixed(decimalPoint));
        totalInvested = stockPrice * Number(quantity.toFixed(decimalPoint));
        actuallyInvested += totalInvested;
        const respo = {
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
            message: "Please provide valid stock weight. Sum of the weight of total should not be more than 100",
        });
    }
    const data = {
        success: true,
        orderType: orderType,
        balance: totalAmount,
        actuallyInvested,
        remainBalance: Number((totalAmount - actuallyInvested).toFixed(decimalPoint)),
        order,
    };
    console.timeEnd("response time:");
    return res.status(200).send(data);
});
app.all("*", (req, res) => {
    res.status(401).send("Invalid Url");
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
