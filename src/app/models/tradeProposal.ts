export interface TradeProposal {
  id?: number;
  proposer: number;
  recipient: number;
  publication: number;
  proposed_items: number[];
  suc: number;
  status: string;
  code?: string;
  created_at?: Date;
  date?: Date;
}
