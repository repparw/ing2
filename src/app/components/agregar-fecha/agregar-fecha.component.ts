import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-agregar-fecha',
  templateUrl: './agregar-fecha.component.html',
  styleUrls: ['./agregar-fecha.component.css']
})
export class AgregarFechaComponent implements OnInit {
  tradeID?: number;

  constructor(private route: ActivatedRoute){}

  ngOnInit(): void {
    this.tradeID = parseInt(this.route.snapshot.params['id'], 10);
  }
}