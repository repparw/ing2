import { Component, OnInit } from '@angular/core';
import { TradeService } from 'src/app/services/trade.service';
import { UserService } from '../../services/user.service';
import { TradeProposal } from 'src/app/models/tradeProposal';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listar-ofertas-recibidas',
  templateUrl: './listar-ofertas-recibidas.component.html',
  styleUrls: ['./listar-ofertas-recibidas.component.css']
})
export class ListarOfertasRecibidasComponent implements OnInit {
    data: TradeProposal[] = [];

    mensajeFallidoPropuesta: string = 'propuestas de trueque recibidas';
    tituloPropuesta: string = '¡Oferta de trueque recibida!';

    currentUserId!: number;

    constructor(private tradeService: TradeService,
                private router: Router,
                private userService: UserService) {}

    ngOnInit(): void {
        this.userService.getCurrentUser().subscribe({
            next: (user: User) => {
                this.currentUserId = user.id;
                this.fetchTradeProposals();
            },
            error: (error: any) => {
                console.error('Error fetching current user:', error);
            }
        });
    }

    fetchTradeProposals(): void {
        this.tradeService.getTradeProposals().subscribe({
            next: (response: TradeProposal[]) => {
                this.data = response.filter(proposal => proposal.recipient.id === this.currentUserId);
                console.log('Proposals:', this.data);
            },
            error: (error: any) => {
                console.error('Error fetching trade proposals:', error);
            }
        });
    }

    navigateToEnviadas(): void {
        this.router.navigate(['/trueques-enviados']);
    }

}
