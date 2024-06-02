import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-sucursal',
  templateUrl: './crear-sucursal.component.html',
  styleUrls: ['./crear-sucursal.component.css']
})
export class CrearSucursalComponent implements OnInit {

  authToken = localStorage.getItem('token');
  
  public uploader: FileUploader = new FileUploader({
    url: 'http://localhost:8000/branches/',
    itemAlias: 'photos',
    headers: [{ name: 'Authorization', value: `Token ${this.authToken}` }]
  });

  sucForm!: FormGroup;
  center: google.maps.LatLngLiteral = { lat: -34.913719, lng: -57.951228 };
  zoom = 17;
  display: any;
  selectedMarker: google.maps.LatLngLiteral | null = null;

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.sucForm = this.formBuilder.group({
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/), Validators.maxLength(10), Validators.minLength(10)]],
      address: ['', Validators.required],
      photos: new FormControl<File | null>(null, Validators.required),
    });
  }

  onSubmit(): void {
    if (this.sucForm.invalid) {
      this.sucForm.markAllAsTouched();
      return;
    }

    this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
      form.append('phone', this.sucForm.get('phone')?.value);
      form.append('address', this.sucForm.get('address')?.value);
      form.append('subject', this.sucForm.get('subject')?.value);
    };

    this.uploader.onCompleteAll = () => {
      Swal.fire({
        icon: 'success',
        title: 'Sucursal creada',
        text: 'La sucursal se ha creado correctamente.',
      }).then(() => {
        this.router.navigate(['/home']);
      });
    };

    console.log('Agregando formulario a la base de datos');
    this.uploader.uploadAll();
    console.log('Formulario agregado a la base de datos', this.sucForm.value);
  }

  hasErrors(controlName: string, errorType: string) {
    const control = this.sucForm.get(controlName);
    return control && control.hasError(errorType) && (control.dirty || control.touched);
  }

  direccionValida: boolean = true;
  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      if (
        lat < -55.0 || lat > -21.0 || 
        lng < -73.0 || lng > -53.0   
      ) {
        this.direccionValida = false;
        return;
      }
      this.selectedMarker = event.latLng.toJSON();
      this.center = this.selectedMarker;
      this.updateAddressFromCoords(this.selectedMarker);
      this.direccionValida = true;
    }
  }

  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }

  updateAddressFromCoords(coords: google.maps.LatLngLiteral) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: coords }, (results, status) => {
      if (status === 'OK' && results![0]) {
        const address = results![0].formatted_address;
        this.sucForm.get('address')?.setValue(address);
      } else {
        console.error('Geocoding failed:', status);
      }
    });
  }

  getSelectedMarkerPosition(): google.maps.LatLngLiteral | null {
    return this.selectedMarker;
  }
}
