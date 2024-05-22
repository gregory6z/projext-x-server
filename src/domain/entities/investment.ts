import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface InvestmentProps {
  name: string;
  description: string;
  imageUrl: string;
  investmentId: number;
  accountId: number;
  investmentType: string;
  amount: number;
  quantity: number;
  purchasePricePerUnit: number;
  currentPricePerUnit: number;
  timestamp: Date;
  annualProfit: number;
  risk: string;
  term: string;
  paymentMethod: string;
  fundraisingProgress: number;
  releaseDate: Date;
}

export class Investment extends Entity<InvestmentProps> {
  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get imageUrl(): string {
    return this.props.imageUrl;
  }

  get investmentId(): number {
    return this.props.investmentId;
  }

  get accountId(): number {
    return this.props.accountId;
  }

  get investmentType(): string {
    return this.props.investmentType;
  }

  get amount(): number {
    return this.props.amount;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get purchasePricePerUnit(): number {
    return this.props.purchasePricePerUnit;
  }

  get currentPricePerUnit(): number {
    return this.props.currentPricePerUnit;
  }

  get timestamp(): Date {
    return this.props.timestamp;
  }

  get annualProfit(): number {
    return this.props.annualProfit;
  }

  get risk(): string {
    return this.props.risk;
  }

  get term(): string {
    return this.props.term;
  }

  get paymentMethod(): string {
    return this.props.paymentMethod;
  }

  get fundraisingProgress(): number {
    return this.props.fundraisingProgress;
  }

  get releaseDate(): Date {
    return this.props.releaseDate;
  }

  static create(props: InvestmentProps, id?: UniqueEntityID) {
    const investment = new Investment(props, id)

    return investment
  }
}