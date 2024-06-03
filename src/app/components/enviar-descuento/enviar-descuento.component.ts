import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailService } from '../../services/email.service';
import { UserService } from 'src/app/services/user.service';
import { CodigoDescuentoService } from 'src/app/services/codigoDescuento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-enviar-descuento',
  templateUrl: './enviar-descuento.component.html',
  styleUrls: ['./enviar-descuento.component.css']
})
export class EnviarDescuentoComponent implements OnInit {
  discountOptions: number[] = [10, 15, 20, 25];
  discountForm: FormGroup;
  emails: string[] = [];
  selectedEmails: string[] = [];

  constructor(private fb: FormBuilder, private emailService: EmailService, private userService: UserService, private codeService: CodigoDescuentoService) { 
    this.discountForm = this.fb.group({
      description: ['', Validators.required],
      selectedDiscount: [10, Validators.required]
    });
  }

  ngOnInit(): void {
    this.getEmails();
  }

  getEmails(): void {
    this.userService.getAllEmails().subscribe(emails => {
      this.emails = emails.sort();
    });
  }

  sendDiscount(): void {
    if (this.discountForm.valid && this.selectedEmails.length > 0) {
      Swal.fire({
        title: 'Enviando correos...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
  
      setTimeout(() => {
        const selectedDiscount = this.discountForm.get('selectedDiscount')?.value;
        const description = this.discountForm.get('description')?.value;

        this.selectedEmails.forEach(email => {
          const discountCode = this.codeService.generateDiscountCode();
          const message = `¡Aprovecha nuestro descuento del ${selectedDiscount}% en nuestra ferretería\nCódigo de descuento: ${discountCode}\nDescripción: ${description}`;
    
          this.emailService.sendEmail('Descuento imperdible', message, [email]).subscribe(() => {
            this.codeService.saveDiscountCode(discountCode, description, selectedDiscount.toString()).subscribe(() => {
              console.log(`Código de descuento guardado correctamente para ${email}.`);
            }, error => {
              console.error(`Error al guardar el código de descuento para ${email}:`, error);
            });
          }, error => {
            console.error(`Error al enviar el correo electrónico a ${email}:`, error);
          });
        });
    
        Swal.close();
        
        Swal.fire({
          title: 'Correos enviados',
          text: 'Los correos electrónicos se han enviado correctamente.',
          icon: 'success'
        });
      }, 5000); // Espera 5 segundos antes de mostrar el mensaje de confirmación
    } else {
      console.log('El formulario no es válido o no se han seleccionado destinatarios. Revisa los campos.');
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
