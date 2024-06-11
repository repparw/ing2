import { Component, OnInit } from '@angular/core';
import { SucursalService } from '../../services/sucursal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listar-sucursales',
  templateUrl: './listar-sucursales.component.html',
  styleUrls: ['./listar-sucursales.component.css']
})
export class ListarSucursalesComponent implements OnInit {
  data: any[] = [];

  constructor(private sucursalService: SucursalService, private router: Router) { }

  ngOnInit(): void {
    this.sucursalService.getSucursales().subscribe((data: any[]) => {
      this.data = data;
    });
  }

  getPhotos(id: number): string {
    return this.sucursalService.getPhotos(id);
  }

  navigateToSucursal(id: number): void {
    this.router.navigate(['/sucursal', id]);
  }
}
