import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-espace-cavalier',
  templateUrl: './espace-cavalier.component.html',
  styleUrls: ['./espace-cavalier.component.scss']
})
export class EspaceCavalierComponent implements OnInit {
  viewDate: Date = new Date();
  constructor() { }

  ngOnInit(): void {
  }

}
