import {AfterViewInit, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {Olympic} from "../core/models/Olympic";
import {OlympicService} from "../core/services/olympic.service";
import {ChartData} from "chart.js";
import {Subscription} from "rxjs";
import {ChartEntry} from "../core/interface/chart-entry.model";

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [
    NgxChartsModule
  ],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss'
})
export class PieChartComponent implements OnInit, OnDestroy, AfterViewInit {
  //variable
  numberOfCountries: number = 0;
  numberOfJo: number = 0;
  // Variable pour ngx-charts
  single: ChartEntry[] = [];
  view!: [number, number];
  // Liste des segments actifs
  activeEntries: ChartEntry[] = [];
  //Option pour ngx-charts
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  //Subscription
  subscription!: Subscription;


  constructor(private olympicService: OlympicService) {
  }

  ngOnInit(): void {

    this.subscription = this.olympicService.loadInitialData().subscribe(data => {
      if (data) {
        this.single = this.transformDataForChart(data)
        this.numberOfCountries = this.single.length;

      }
    })
  }

  ngAfterViewInit(): void {
    this.calculateView();
  }

  transformDataForChart(olympics: Olympic[]): ChartEntry[] {
    return olympics.map(olympic => {
      this.numberOfJo = olympic.participations.length;
      const totalMedals = olympic.participations.reduce((total, participation) => total + participation.medalsCount, 0);
      return {
        name: olympic.country,
        value: totalMedals
      }
    })
  }

  calculateView() {
    const width = Math.min(window.innerWidth * 0.8, 800); // Prend 80% de la largeur, max 600px
    const height = width * 0.85;             // Proportionnel à la largeur (60%)
    this.view = [width, height];
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent): void {
    this.calculateView();
  }


  // Méthodes pour gérer les événements du graphique
  onSelect(data: ChartData): void {

  }

  onActivate(data: ChartData): void {

  }

  onDeactivate(data: ChartData): void {

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
