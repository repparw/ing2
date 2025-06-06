import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';

@Component({
  selector: 'app-estadisticas-globales',
  templateUrl: './estadisticas-globales.component.html',
  styleUrls: ['./estadisticas-globales.component.css']
})

export class EstadisticasGlobalesComponent implements OnInit {

  statistics: any = {};

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.statisticsService.getStatistics().subscribe(data => {
      this.statistics = data;
    });
  }

}
