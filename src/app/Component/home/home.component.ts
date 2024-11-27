import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  tourPackages = [
    {
      id: 1,
      title: '3 Days Sri Lanka Tour Package',
      description: 'Sri Lanka',
      imageUrl: '/assets/tourbook2.webp',
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
