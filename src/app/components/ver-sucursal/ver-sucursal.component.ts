import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { SucursalService } from '../../services/sucursal.service';
import { StatisticsService } from '../../services/statistics.service';
import { TradeService } from '../../services/trade.service';
import { UserService } from '../../services/user.service';
import { SucursalRating } from 'src/app/models/sucursalRating';
import { SucursalRatingService } from 'src/app/services/sucursalRating.service';

@Component({
  selector: 'app-ver-sucursal',
  templateUrl: './ver-sucursal.component.html',
  styleUrls: ['./ver-sucursal.component.css']
})
export class VerSucursalComponent implements OnInit {
  sucursal: any;
  sucursal_rating?: number;
  ratings?: SucursalRating[];
  statistics: any;
  noStatistics: boolean = false;
  isAdmin$: Observable<boolean>;
  isEmployee$: Observable<boolean>;
  sucEmpl?: string;
  oculto: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private sucursalService: SucursalService,
    private statisticsService: StatisticsService,
    private tradeService: TradeService,
    private userService: UserService,
    private sucursalRatingService: SucursalRatingService,
  ) {
    this.isAdmin$ = this.userService.isAdmin$;
    this.isEmployee$ = this.userService.isEmployee$;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.userService.getCurrentUser().pipe(
      switchMap(user => {
        this.sucEmpl = user.suc as unknown as string;
        return this.sucursalService.getSucursal(id as unknown as number);
      }),
      switchMap(sucursal => {
        this.sucursal = sucursal;

        return this.tradeService.getTradeProposalsBySucursal(sucursal.id as unknown as number);
      }),
      switchMap(tradeProposals => {
        if (tradeProposals.length === 0) {
          this.noStatistics = true; // No trade proposals, no need to fetch statistics
          return of([]);
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
        return of([]);
      })
    ).subscribe(
      ({ statistics, tradeProposals }: any) => {
        this.statistics = statistics;
      },
      error => {
        console.error('Error:', error);
        this.noStatistics = true;
      }
    );

    //Conseguir ratings:
    this.sucursalRatingService.getRatingsBySucursalId(id as unknown as number).subscribe({
      next: (ratings: SucursalRating[]) => {
        this.ratings = ratings;
        // Calculate the average rating
        const totalRatings = ratings.length;
        const sumRatings = ratings.reduce((sum, rating) => sum + rating.rating_score, 0);
        this.sucursal_rating = totalRatings > 0 ? sumRatings / totalRatings : 0;
      }
    })

  }

  getPhotos(id: number): string {
    return this.sucursalService.getPhotos(id);
  }

  mostrar(){
    this.oculto = false;
  }

  ocultar(){
    this.oculto = true;
  }
}
