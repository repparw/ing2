import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, switchMap, take, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { PublicationService } from '../../services/publicacion.service';
import { UserService } from '../../services/user.service';
import { TradeProposal } from '../../models/tradeProposal';
import { Pub } from '../../models/pub';

@Component({
  selector: 'app-proponer-trueque',
  templateUrl: './proponer-trueque.component.html',
  styleUrls: ['./proponer-trueque.component.css']
})
export class ProponerTruequeComponent implements OnInit {
  tradeProposal: FormGroup;
  proposerName: string = '';

  userPublications: Pub[] = [];

  constructor(private publicationService: PublicationService,
              private userService: UserService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
             ){
              this.tradeProposal = this.formBuilder.group({
                proposer: [0, Validators.required],
                recipient: [0, Validators.required],
                publication: [0, Validators.required],
                proposed_items: [[], Validators.required],
                status: ['PENDING', Validators.required],
              });
             }

  ngOnInit() {
    const pubId = parseInt(this.route.snapshot.params['id']);
    this.getCurrentUserAndPublications();
    this.getRecipient(pubId);
    this.tradeProposal.patchValue({publication: pubId});
    // get user id from publication id and set it as recipient
  }

  getRecipient(pubId: number) {
    this.publicationService.getPublication(pubId).pipe(
      take(1),  // Ensure we only take the first emission
      switchMap(publication => {
        const userId = publication.user;
        return of(userId);  // Emit userId directly
      })
    ).subscribe(userId => {
      this.tradeProposal.patchValue({recipient: userId});
    });
  }

  proposeTrade(proposal: TradeProposal) {
    this.publicationService.createTradeProposal(proposal).subscribe(response => {
      alert('Propuesta de trueque enviada exitosamente!');
    });
  }

  onSubmit() {
    if (this.tradeProposal.valid) {
      this.proposeTrade(this.tradeProposal.value);
    }
  }

  private getCurrentUserAndPublications(): void {
    this.userService.getCurrentUser().pipe(
      switchMap(user => {
        if (user) {
          this.tradeProposal.patchValue({proposer: user.id});
          this.proposerName = user.name;
          return this.publicationService.getPublicationsById(user.id);
        } else {
          return []; // Return an empty array if user is falsy
        }
      }),
      catchError(error => {
        console.error('Error fetching current user or publications:', error);
        return []; // Return empty array to handle error gracefully
      })
    ).subscribe(publications => {
      this.userPublications = publications;
    });
  }

}
