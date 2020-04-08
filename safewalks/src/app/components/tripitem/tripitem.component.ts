import { Component, OnInit, Input } from '@angular/core';
import { TripItemInfo } from '../../tripiteminfo';

@Component({
  selector: 'app-tripitem',
  templateUrl: './tripitem.component.html',
  styleUrls: ['./tripitem.component.scss'],
})
export class TripitemComponent implements OnInit {

  @Input() tripiteminfo: TripItemInfo;

  constructor() { }

  ngOnInit() {}

}
