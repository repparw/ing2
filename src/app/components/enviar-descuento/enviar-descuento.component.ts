import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailService } from '../../services/email.service'; // Importa tu servicio de correo electrónico
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-enviar-descuento',
  templateUrl: './enviar-descuento.component.html',
  styleUrls: ['./enviar-descuento.component.css']
})
export class EnviarDescuentoComponent implements OnInit {
  discountOptions: number[] = [10, 15, 20, 25];
  selectedDiscount: number = 10;
  discountForm: FormGroup; // Inicializar correctamente como FormGroup
  emails: string[] = [];
  selectedEmails: string[] = [];

  constructor(private fb: FormBuilder, private emailService: EmailService, private userService: UserService) { 
    this.discountForm = this.fb.group({
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getEmails();
  }

  generateDiscountCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  getEmails(): void {
    this.userService.getAllEmails().subscribe(emails => {
      this.emails = emails.sort(); // Ordena los correos electrónicos alfabéticamente
    });
  }

  sendDiscount(): void {
    if (this.discountForm.valid) {
      const discountCode = this.generateDiscountCode();
      const description = this.discountForm.get('description')?.value; // Obtén la descripción del formulario
      const message = `¡Aprovecha nuestro descuento del ${this.selectedDiscount}% en nuestra ferreteria\nCódigo de descuento: ${discountCode}\nDescripción: ${description}`;
      
      // Envía el correo electrónico con el código de descuento y la descripción
      this.emailService.sendEmail('Descuento imperdible', message, this.selectedEmails).subscribe(() => {
        console.log('Correo electrónico enviado correctamente.');
        window.location.reload();
      });
    } else {
      console.log('El formulario no es válido. Revisa los campos.');
    }
  }

  handleCheckboxChange(event: Event): void {
    const value = (event.target as HTMLInputElement)?.value;
    this.toggleSelection(value);
  }

  toggleSelection(email: string | null | undefined): void {
    if (email) {
      if (this.selectedEmails.includes(email)) {
        this.selectedEmails = this.selectedEmails.filter(e => e !== email);
      } else {
        this.selectedEmails.push(email);
      }
    }
  }
}



