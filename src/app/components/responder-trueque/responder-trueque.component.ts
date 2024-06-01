import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-responder-trueque',
  templateUrl: './responder-trueque.component.html',
  styleUrls: ['./responder-trueque.component.css']
})
export class ResponderTruequeComponent implements OnInit{
  tradeID?: number;

  constructor(private route: ActivatedRoute){}

  ngOnInit(): void {
    this.tradeID = parseInt(this.route.snapshot.params['id'], 10);
  }
}
