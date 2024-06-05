import { User } from './user';
import { Pub } from './pub';
import { Sucursal } from './sucursal';

export interface TradeProposal {
  id?: number;
  proposer_id: number;
  recipient_id: number;
  publication_id: number;
  proposed_items_id: number[];
  suc_id?: number;
  proposer: User;
  recipient: User;
  publication: Pub;
  proposed_items: Pub[];
  suc?: Sucursal;
  status: string;
  code?: string;
  created_at?: Date;
  date?: Date;
}
