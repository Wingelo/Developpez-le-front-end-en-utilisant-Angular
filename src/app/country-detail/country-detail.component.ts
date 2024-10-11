import {AfterViewInit, Component, HostListener, OnDestroy, OnInit} from '@angular/core'; // Import OnDestroy
import {ActivatedRoute, Router} from "@angular/router";
import {OlympicService} from "../core/services/olympic.service";
import {Olympic} from "../core/models/Olympic";
import {ChartData} from '../core/interface/charData'; // Import de l'interface unique
import {Subscription} from 'rxjs'; // Import de Subscription

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrl: './country-detail.component.scss'
})
export class CountryDetailComponent implements OnInit, AfterViewInit, OnDestroy {

  countryName: string | null = null;
  countryData: ChartData[] = []; // Utilisation de ChartData[]
  view!: [number, number];

  numberOfEntries: number = 0;
  totalNumberMedals: number = 0;
  totalNumberOfAthletes: number = 0;

  private subscription: Subscription = new Subscription(); // Stockage de l'abonnement

  // Options du graphique
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Medals';
  timeline: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private olympicService: OlympicService
  ) {
  }

  // Lifecycle hooks
  ngOnInit(): void {
    this.view = [700, 400]; // Taille par défaut
    this.route.params.subscribe(params => {
      this.countryName = params['countryName'];
    });

    if (this.countryName) {
      this.loadCountryData(this.countryName);
    }
  }

  ngAfterViewInit(): void {
    this.calculateView();
  }

  // Méthode pour revenir à la page d'accueil
  goBack(): void {
    this.router.navigate(['/']); // Navigation vers la page d'accueil
  }

  // Méthodes de mise à jour de la vue (responsive)
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.calculateView();
  }

  private calculateView(): void {
    const width = Math.min(window.innerWidth * 0.8, 800); // Max 800px
    const height = width * 0.85; // Hauteur proportionnelle
    this.view = [width, height];
  }

  // Chargement des données du pays
  private loadCountryData(countryName: string): void {
    const sub = this.olympicService.loadInitialData().subscribe(data => {
      const chartData = this.transformDataForChart(data);
      if (chartData.length > 0) {
        this.countryData = chartData; // Assignation des données transformées
      }
    });

    // Ajout de l'abonnement à la subscription
    this.subscription.add(sub);
  }

  // Transformation des données pour le graphique
  private transformDataForChart(olympics: Olympic[]): ChartData[] {
    const country = olympics.find(olympic => olympic.country === this.countryName);
    if (!country) {
      return [];
    }

    // Calcul du nombre d'entrées, total des médailles et des athlètes
    this.numberOfEntries = country.participations.length;
    this.totalNumberMedals = country.participations.reduce((total, participation) => total + participation.medalsCount, 0);
    this.totalNumberOfAthletes = country.participations.reduce((total, participation) => total + participation.athleteCount, 0);

    // Retourne un tableau de ChartData[] typé
    return [{
      name: country.country,
      series: country.participations.map(participation => ({
        name: participation.year.toString(), // Année
        value: participation.medalsCount // Nombre de médailles
      }))
    }];
  }

  // Méthodes pour gérer les événements du graphique
  onSelect(data: any): void {
    // Gestion de la sélection des données du graphique
  }

  onActivate(data: any): void {
    // Gestion de l'activation des données du graphique
  }

  onDeactivate(data: any): void {
    // Gestion de la désactivation des données du graphique
  }

  // Désabonnement lors de la destruction du composant
  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Désabonnement des observables
  }
}
