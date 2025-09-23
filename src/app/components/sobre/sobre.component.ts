import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-sobre',
  standalone: true,
  imports: [],
  templateUrl: './sobre.component.html',
  styleUrl: './sobre.component.css'
})
export class SobreComponent implements OnInit {

  ngOnInit(): void {
      window.scrollTo(0,0)
  }

}
