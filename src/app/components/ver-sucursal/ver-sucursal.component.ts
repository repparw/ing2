import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { SucursalService } from '../../services/sucursal.service';
import { StatisticsService } from '../../services/statistics.service';
import { TradeService } from '../../services/trade.service';

@Component({
  selector: 'app-ver-sucursal',
  templateUrl: './ver-sucursal.component.html',
  styleUrls: ['./ver-sucursal.component.css']
})
export class VerSucursalComponent implements OnInit {
  sucursal: any;
  statistics: any;
  noStatistics: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private sucursalService: SucursalService,
    private statisticsService: StatisticsService,
    private tradeService: TradeService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    // First fetch the sucursal details
    this.sucursalService.getSucursal(id as unknown as number).pipe(
      switchMap(sucursal => {
        this.sucursal = sucursal;

        // Then fetch trade proposals by sucursal
        return this.tradeService.getTradeProposalsBySucursal(sucursal.id as unknown as number);
      }),
      switchMap(tradeProposals => {
        if (tradeProposals.length === 0) {
          this.noStatistics = true; // No trade proposals, no need to fetch statistics
          return [];
        } else {
          // Fetch statistics only if there are trade proposals
          return forkJoin({
            statistics: this.statisticsService.getStatistics(id!),
            tradeProposals: of(tradeProposals) // Pass trade proposals downstream
          });
        }
      }),
      catchError(error => {
        console.error('Error fetching data:', error);
        this.noStatistics = true;
        return [];
      })
    ).subscribe(
      ({ statistics, tradeProposals }) => {
        this.statistics = statistics;
      },
      error => {
        console.error('Error:', error);
        this.noStatistics = true;
      }
    );
  }

  getPhotos(id: number): string {
    return this.sucursalService.getPhotos(id);
  }
}
