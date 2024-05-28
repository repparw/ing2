import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import Swal from 'sweetalert2';

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
    this.getCurrentUserAndPublications(); // Fetch current user and their publications
    this.getRecipient(pubId); // Fetch recipient ID based on publication ID
    this.tradeProposal.patchValue({ publication: pubId }); // Set publication ID in form
    if ( this.tradeProposal.value.proposer === this.tradeProposal.value.recipient ) {
      Swal.fire('Error', 'No puedes proponerte un trueque a ti mismo', 'error').then(() => this.location.back());
    }
    this.getPublicationPrice(pubId); // Fetch publication price
  }

  // Fetch recipient (user) ID based on publication ID
  getRecipient(pubId: number) {
    this.publicationService.getPublication(pubId).pipe(
      take(1), // Take only first emission
      switchMap(publication => of(publication.user)) // Map to user ID
    ).subscribe(userId => {
      this.tradeProposal.patchValue({ recipient: userId }); // Update recipient ID in form
    });
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
  getPublicationPrice(pubId: number) {
    this.publicationService.getPublicationPrice(pubId).subscribe(price => {
      this.recipientPubPrice = price; // Update recipient publication price
    });
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
  getCurrentUserAndPublications(): void {
    this.userService.getCurrentUser().pipe(
      switchMap(user => {
        if (user) {
          this.tradeProposal.patchValue({ proposer: user.id }); // Update proposer ID in form
          this.proposerName = user.name; // Set proposer name
          return this.publicationService.getPublicationsById(user.id); // Fetch user publications
        } else {
          return of([]); // Return empty array if user is not found
        }
      })
    ).subscribe(publications => {
      this.userPublications = publications; // Set user publications
    });
  }

  // Get category based on price
  getCategory(price: number): string {
    return this.publicationService.getCategory(price); // Fetch category based on price
  }
}
