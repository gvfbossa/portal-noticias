import { Component } from '@angular/core'
import { AddsComponent } from "../adds/adds.component"

@Component({
  selector: 'app-sobre',
  standalone: true,
  imports: [
    AddsComponent
  ],
  templateUrl: './sobre.component.html',
  styleUrl: './sobre.component.css'
})
export class SobreComponent {

}
