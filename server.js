const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

const logStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" });

app.use((req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const now = new Date().toISOString();
  console.log(`[${now}] IP: ${ip} | ${req.method} ${req.originalUrl}`);
  const logLine = `[${now}] IP: ${ip} | ${req.method} ${req.originalUrl}\n`;
  logStream.write(logLine);
  next();
});

const data = {
  branches: [
    { branch_id: "B001", name: "Main St Bank", address: "123 Main St", city: "Metropolis", ifsc_code: "IFSC000001" },
    { branch_id: "B002", name: "Riverbank Branch", address: "45 River Dr", city: "Gotham", ifsc_code: "IFSC000002" },
    { branch_id: "B003", name: "Hilltop Bank", address: "67 Hill Rd", city: "Star City", ifsc_code: "IFSC000003" },
    { branch_id: "B004", name: "Lakeside Branch", address: "89 Lake Ave", city: "Coast City", ifsc_code: "IFSC000004" },
    { branch_id: "B005", name: "Airport Branch", address: "22 Skyway Blvd", city: "Central City", ifsc_code: "IFSC000005" }
  ],
  customers: [
    { customer_id: "C001", name: "Alice Morgan", email: "alice@example.com", phone: "1234567890", address: "10 Apple St", branch_id: "B001" },
    { customer_id: "C002", name: "Bob Smith", email: "bob@example.com", phone: "2345678901", address: "20 Banana Ave", branch_id: "B003" },
    { customer_id: "C003", name: "Charlie King", email: "charlie@example.com", phone: "3456789012", address: "30 Cherry Blvd", branch_id: "B002" }
  ],
  accounts: [
    { account_id: "A0010", customer_id: "C001", branch_id: "B001", account_type: "Savings", balance: 20500.75 },
    { account_id: "A0011", customer_id: "C001", branch_id: "B001", account_type: "Current", balance: 15000.00 },
    { account_id: "A0020", customer_id: "C002", branch_id: "B003", account_type: "Savings", balance: 30000.20 },
    { account_id: "A0021", customer_id: "C002", branch_id: "B003", account_type: "Current", balance: 4500.00 },
    { account_id: "A0030", customer_id: "C003", branch_id: "B002", account_type: "Savings", balance: 18000.99 },
    { account_id: "A0031", customer_id: "C003", branch_id: "B002", account_type: "Current", balance: 22000.00 }
  ],
  account_details: [
    { account_id: "A0010", opened_date: "2020-01-15", status: "Active", nominee: "John Doe" },
    { account_id: "A0011", opened_date: "2021-03-22", status: "Active", nominee: "Jane Doe" },
    { account_id: "A0020", opened_date: "2019-07-30", status: "Active", nominee: "Emily Stone" },
    { account_id: "A0021", opened_date: "2022-08-18", status: "Active", nominee: "Dylan Kent" },
    { account_id: "A0030", opened_date: "2021-11-05", status: "Active", nominee: "Sophie Lee" },
    { account_id: "A0031", opened_date: "2020-06-10", status: "Active", nominee: "Liam Wong" }
  ],
  transactions: [
    { transaction_id: "T001", account_id: "A0010", date: "2024-11-12", amount: 1500.50, type: "Debit", description: "Grocery" },
    { transaction_id: "T002", account_id: "A0010", date: "2025-01-08", amount: 1000.00, type: "Credit", description: "Salary" },
    { transaction_id: "T003", account_id: "A0011", date: "2024-12-25", amount: 700.00, type: "Debit", description: "Restaurant" },
    { transaction_id: "T004", account_id: "A0020", date: "2025-03-01", amount: 2000.00, type: "Credit", description: "Refund" },
    { transaction_id: "T005", account_id: "A0021", date: "2024-09-09", amount: 450.00, type: "Credit", description: "Transfer from 123XXXXXXXXX10" },
    { transaction_id: "T006", account_id: "B0021", date: "2026-02-12", amount: 100.00, type: "Debit", description: "Top-up to +1122XXXXXXX00" },
    { transaction_id: "T007", account_id: "B0021", date: "2026-02-12", amount: 3000.00, type: "Credit", description: "Cash Deposit ATM" },
    { transaction_id: "T008", account_id: "B0021", date: "2026-02-11", amount: 45.50, type: "Debit", description: "ECOMM Tran 613121" },
    { transaction_id: "T009", account_id: "B0021", date: "2026-02-10", amount: 200.00, type: "Debit", description: "Transfer to 123XXXXXXXXX10" },
    { transaction_id: "T010", account_id: "B0021", date: "2026-02-10", amount: 500.00, type: "Debit", description: "Cheque Clg MICR 1212100" },
    { transaction_id: "T011", account_id: "B0021", date: "2026-02-09", amount: 75.00, type: "Debit", description: "POS - Max Clothings" },
  ],
  credit_cards: [
    { card_id: "CC001", customer_id: "C001", card_number: "4111111111111111", expiry_date: "12/27", card_type: "Visa", limit: 100000, balance: 25000.00 },
    { card_id: "CC002", customer_id: "C002", card_number: "5500000000000004", expiry_date: "08/26", card_type: "MasterCard", limit: 100000, balance: 30000.00 },
    { card_id: "CC003", customer_id: "C003", card_number: "4012888888881881", expiry_date: "03/28", card_type: "Visa", limit: 100000, balance: 45000.00 }
  ],
  card_transactions: [
    { card_trx_id: "CTX001", card_id: "CC001", date: "2025-02-14", amount: 499.99, merchant: "Amazon", description: "Books" },
    { card_trx_id: "CTX002", card_id: "CC001", date: "2025-03-10", amount: 1200.00, merchant: "Flipkart", description: "Electronics" },
    { card_trx_id: "CTX003", card_id: "CC002", date: "2024-11-20", amount: 999.99, merchant: "Snapdeal", description: "Shoes" },
    { card_trx_id: "CTX004", card_id: "CC003", date: "2025-04-01", amount: 300.00, merchant: "Zomato", description: "Food" }
  ]
};

app.get("/branches", (req, res) => {
  res.json(data.branches);
});

app.get("/customer/:id", (req, res) => {
  const customer = data.customers.find(c => c.customer_id === req.params.id);
  if (!customer) return res.status(404).json({ error: "Customer not found" });
  res.json(customer);
});

app.get("/accounts/customer/:id", (req, res) => {
  const accounts = data.accounts.filter(a => a.customer_id === req.params.id);
  res.json(accounts);
});

app.get("/account-details/:accountId", (req, res) => {
  const details = data.account_details.find(a => a.account_id === req.params.accountId);
  if (!details) return res.status(404).json({ error: "Account details not found" });
  res.json(details);
});

app.get("/transactions/:accountId", (req, res) => {
  const txns = data.transactions.filter(t => t.account_id === req.params.accountId);
  res.json(txns);
});

app.get("/cards/customer/:id", (req, res) => {
  const cards = data.credit_cards.filter(c => c.customer_id === req.params.id);
  res.json(cards);
});

app.get("/card-transactions/:cardId", (req, res) => {
  const c_txns = data.card_transactions.filter(t => t.card_id === req.params.cardId);
  res.json(c_txns);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Bank API server running on port ${port}`);
});
