import {AfterViewInit, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {Olympic} from "../core/models/Olympic";
import {OlympicService} from "../core/services/olympic.service";
import {Subscription} from "rxjs";
import {ChartEntry} from "../core/interface/chart-entry.model";
import {Router} from '@angular/router';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss'
})
export class PieChartComponent implements OnInit, OnDestroy, AfterViewInit {

  numberOfCountries: number = 0;
  numberOfJo: number = 0;

  single: ChartEntry[] = [];
  view: [number, number] = [0, 0];

  activeEntries: ChartEntry[] = [];

  showLabels: boolean = true;
  isDoughnut: boolean = false;

  private subscription: Subscription = new Subscription();

  constructor(
    private olympicService: OlympicService,
    private router: Router
  ) {
  }

  // Lifecycle methods
  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.calculateView();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Handle window resize
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.calculateView();
  }

  // Load data and process it for chart display
  private loadData(): void {
    const sub = this.olympicService.loadInitialData().subscribe(data => {
      if (data) {
        this.single = this.transformDataForChart(data);
        this.numberOfCountries = this.single.length;
      }
    });

    this.subscription.add(sub);
  }

  private transformDataForChart(olympics: Olympic[]): ChartEntry[] {
    return olympics.map(olympic => {
      const totalMedals = olympic.participations.reduce(
        (total, participation) => total + participation.medalsCount,
        0
      );

      this.numberOfJo = olympic.participations.length;

      return {
        name: olympic.country,
        value: totalMedals
      };
    });
  }


  private calculateView(): void {
    const width = Math.min(window.innerWidth * 0.8, 800);
    const height = width * 0.85;
    this.view = [width, height];
  }

  // Chart event handlers
  onSelect(data: { name: string }): void {
    if (data?.name) {
      this.router.navigate(['/country', data.name]);
    }
  }

  onActivate(data: ChartEntry): void {
    // Handle activate event if necessary
  }

  onDeactivate(data: ChartEntry): void {
    // Handle deactivate event if necessary
  }
}
