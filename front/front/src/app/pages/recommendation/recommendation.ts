import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecommendationService, Recommendation } from '../../features/recommendation/services/RecommendationService';

@Component({
  selector: 'app-recommendation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recommendation.html',
  styleUrls: ['./recommendation.css']
})
export class RecommendationComponent implements OnInit {
  recommendations: Recommendation[] = [];
  loading = true;
  error: string | null = null;

  constructor(private recoService: RecommendationService) { }

  ngOnInit(): void {
    this.loadRecommendations();
  }

  loadRecommendations() {
    this.loading = true;
    this.recoService.getAll().subscribe({
      next: (data: Recommendation[]) => {
        this.recommendations = data || [];
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Erreur de chargement des recommandations';
        this.loading = false;
        console.error(err);
      }
    });
  }

  approve(id: number) {
    if (!confirm('Approuver cette recommandation ?')) return;

    this.recoService.approve(id).subscribe({
      next: (updated: Recommendation) => {
        const index = this.recommendations.findIndex(r => r.id === id);
        if (index !== -1) this.recommendations[index] = updated;
      },
      error: () => alert('Erreur approbation')
    });
  }

  edit(id: number) {
    // À compléter plus tard (modal ou route)
    alert('Modifier recommandation ID ' + id);
  }

  openCreate() {
    alert('Ouvrir création de recommandation');
  }

  deleteReco(id: number) {
    if (!confirm('Supprimer cette recommandation ?')) return;

    this.recoService.delete(id).subscribe({
      next: () => {
        this.recommendations = this.recommendations.filter(r => r.id !== id);
      },
      error: () => alert('Erreur suppression')
    });
  }
}