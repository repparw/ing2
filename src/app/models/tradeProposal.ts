export interface TradeProposal {
  id?: number;
  proposer: number;
  recipient: number;
  publication: number;
  proposed_items: number[];
  status: string;
  created_at?: Date;
  date?: Date;
}
