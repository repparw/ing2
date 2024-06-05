import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Observable, of } from 'rxjs';
import { switchMap, take, tap, map } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { PublicationService } from '../../services/publication.service';
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
  recipientPubPrice: number = 0;
  userPublications: Pub[] = [];

  constructor(
    private publicationService: PublicationService,
    private userService: UserService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private location: Location,
  ) {
    // Initialize form group with necessary controls
    this.tradeProposal = this.formBuilder.group({
      proposer: [0, Validators.required], // Assuming 0 is placeholder for default value
      recipient: [0, Validators.required], // Assuming 0 is placeholder for default value
      publication: [0, Validators.required], // Assuming 0 is placeholder for default value
      proposed_items: [[], Validators.required],
      status: ['pending', Validators.required],
    });
  }

  ngOnInit() {
    const pubId = parseInt(this.route.snapshot.params['id']); // Extract publication ID from route

    // Fetch current user and their publications, then fetch recipient
    this.getCurrentUserAndPublications().pipe(
      switchMap(() => this.getRecipient(pubId)),
      switchMap(() => {
        // Once both proposer and recipient are set, check if they are the same
        if (this.tradeProposal.value.proposer === this.tradeProposal.value.recipient) {
          return Swal.fire('Error', 'No puedes proponerte un trueque a ti mismo', 'error').then(() => {
            this.location.back();
            return of(null);
          });
        } else {
          // Set publication ID in form and fetch publication price
          this.tradeProposal.patchValue({ publication: pubId });
          return this.getPublicationPrice(pubId);
        }
      })
    ).subscribe();
  }

  // Fetch recipient (user) ID based on publication ID
  getRecipient(pubId: number): Observable<void> {
    return this.publicationService.getPublication(pubId).pipe(
      take(1),
      tap(publication => {
        const userId = publication.user;
        this.tradeProposal.patchValue({ recipient: userId });
      }),
      map(() => void 0) // Use map to map the observable to void
    );
  }

  // Submit form data (called on form submission)
  onSubmit() {
    if (this.tradeProposal.valid) {
      this.validateTrade(); // Validate trade proposal
    }
  }

  // Cancel operation and navigate back
  onCancel() {
    this.location.back();
  }

  // Fetch publication price based on ID
  getPublicationPrice(pubId: number): Observable<void> {
    return this.publicationService.getPublicationPrice(pubId).pipe(
      tap(price => {
        this.recipientPubPrice = price;
      }),
      map(() => void 0) // Use map to map the observable to void
    );
  }

  // Validate trade proposal
  validateTrade() {
    const proposedItems = this.tradeProposal.value.proposed_items;
    const priceObservables: Observable<number>[] = proposedItems.map((itemId: number) =>
      this.publicationService.getPublicationPrice(itemId)
    );

    forkJoin(priceObservables).subscribe({
      next: (prices: number[]) => {
        const totalValue = prices.reduce((total, price) => total + price, 0);
        const proposedCategory = this.getCategory(totalValue);
        const recipientCategory = this.getCategory(this.recipientPubPrice);

        if (proposedCategory === recipientCategory) {
          this.proposeTrade(this.tradeProposal.value); // Propose trade if categories match
        } else {
          Swal.fire('Error', 'La suma de los valores de tus artículos no corresponde a la categoría del artículo que deseas.', 'error');
        }
      },
      error: (error) => {
        console.error('Error fetching prices', error);
        Swal.fire('Error', 'Error consiguiendo los precios del backend', 'error');
      }
    });
  }

  // Propose trade using provided proposal data
  proposeTrade(proposal: TradeProposal) {
    this.publicationService.createTradeProposal(proposal).subscribe(response => {
      Swal.fire('Success', 'Propuesta de trueque enviada exitosamente!', 'success');
    });
  }

  // Fetch current user and their publications
  getCurrentUserAndPublications(): Observable<void> {
    return this.userService.getCurrentUser().pipe(
      switchMap(user => {
        if (user) {
          this.tradeProposal.patchValue({ proposer: user.id });
          this.proposerName = user.name;
          return this.publicationService.getPublicationsById(user.id);
        } else {
          return of([]);
        }
      }),
      tap(publications => {
        // filter only price <> 0
        this.userPublications = publications.filter(pub => pub.price > 0);
      }),
      map(() => void 0) // Use map to map the observable to void
    );
  }

  // Get category based on price
  getCategory(price: number): string {
    return this.publicationService.getCategory(price); // Fetch category based on price
  }
}
