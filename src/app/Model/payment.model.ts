export class Payment {
    token: string;
    amount: number;
  
    constructor(token: string, amount: number) {
      this.token = token;
      this.amount = amount;
    }
  }
  