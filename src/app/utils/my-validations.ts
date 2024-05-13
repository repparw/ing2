import { AbstractControl} from '@angular/forms';

export class MyValidations {

    static esMenorDeEdad(control: AbstractControl){
        const hoy = new Date();
        const fechaNacimiento = new Date(control.value);
        fechaNacimiento.setDate(fechaNacimiento.getDate()+ 1);
        console.log(fechaNacimiento)
        const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        if (edad < 18) {
            return {esMenorDeEdad: true};
        }
        if (edad == 18){
            const mes = hoy.getMonth() - fechaNacimiento.getMonth();
            if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
                    return {esMenorDeEdad: true};
            }
        }
        return null
    }
}