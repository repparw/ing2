import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-concretar-trueque',
  templateUrl: './concretar-trueque.component.html',
  styleUrls: ['./concretar-trueque.component.css']
})
export class ConcretarTruequeComponent implements OnInit {
  tradeID?: number;

  constructor(private route: ActivatedRoute){}

  ngOnInit(): void {
    this.tradeID = parseInt(this.route.snapshot.params['id'], 10);
  }
}
