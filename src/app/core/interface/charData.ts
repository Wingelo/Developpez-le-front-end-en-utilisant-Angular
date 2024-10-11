export interface ChartData {
  name: string; // Nom du pays
  series: { name: string; value: number }[]; // Année et nombre de médailles
}
