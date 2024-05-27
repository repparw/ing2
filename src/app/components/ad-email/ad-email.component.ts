// ad-email.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { EmailService } from 'src/app/services/email.service';

@Component({
  selector: 'app-ad-email',
  templateUrl: './ad-email.component.html',
  styleUrls: ['./ad-email.component.css']
})
export class AdEmailComponent {
  adEmailForm: FormGroup;
  allEmails: string[] = [];

  constructor(private fb: FormBuilder, private userService: UserService, private emailService: EmailService) {
    this.adEmailForm = this.fb.group({
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
    this.loadAllEmails();
  }

  private loadAllEmails(): void {
    this.userService.getAllEmails().subscribe(
      emails => {
        this.allEmails = emails;
        console.log('All emails loaded:', this.allEmails);
      },
      error => {
        console.error('Error loading emails:', error);
      }
    );
  }

  onSubmit() {
    if (this.adEmailForm.valid) {
      const { subject, message } = this.adEmailForm.value;
      console.log('Sending ad email to:', this.allEmails);
      // Implement your logic to send the email using the emails in this.allEmails
      this.emailService.sendEmail(subject, message, this.allEmails).subscribe(
        response => {
          console.log('Email sent successfully', response);
        },
        error => {
          console.error('Error sending email', error);
        }
      );
    }
    }
  }

