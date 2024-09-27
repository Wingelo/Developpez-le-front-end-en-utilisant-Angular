import {Component, HostListener, OnInit} from '@angular/core';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {Olympic} from "../core/models/Olympic";
import {OlympicService} from "../core/services/olympic.service";
import {ChartData} from "chart.js";

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [
    NgxChartsModule
  ],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss'
})
export class PieChartComponent implements OnInit {
  // Variable pour ngx-charts
  single: any[] = [];
  view!: [number, number];
  // Liste des segments actifs
  activeEntries: any[] = [];
  //Option pour ngx-charts
  showLabels: boolean = true;
  isDoughnut: boolean = false;


  constructor(private olympicService: OlympicService) {
  }

  ngOnInit(): void {
    this.calculateView;
    this.olympicService.loadInitialData().subscribe(data => {
      if (data) {
        this.single = this.transformDataForChart(data)
      }
    })
  }

  transformDataForChart(olympics: Olympic[]): any[] {
    return olympics.map(olympic => {
      const totalMedals = olympic.participations.reduce((total, participation) => total + participation.medalsCount, 0);
      return {
        name: olympic.country,
        value: totalMedals
      }
    })
  }

  calculateView() {
    const width = Math.min(window.innerWidth * 0.8, 600); // Prend 80% de la largeur, max 600px
    const height = width * 0.6;             // Proportionnel à la largeur (60%)
    this.view = [width, height];
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent) {
    this.calculateView();
  }


  // Méthodes pour gérer les événements du graphique
  onSelect(data: ChartData): void {

  }

  onActivate(data: ChartData): void {

  }

  onDeactivate(data: ChartData): void {

  }

}
