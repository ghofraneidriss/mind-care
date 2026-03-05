import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FollowUp, MoodState, IndependenceLevel, SleepQuality } from './followup.model';
import { FollowUpService } from './followup.service';

@Component({
  selector: 'app-followup-page',
  standalone: false,
  templateUrl: './followup-page.html',
  styleUrls: ['./followup-page.css'],
})
export class FollowUpPageComponent implements OnInit {
  followUps: FollowUp[] = [];
  filteredFollowUps: FollowUp[] = [];

  // View modal
  isViewOpen = false;
  viewFollowUp: FollowUp | null = null;

  // Form modal
  isFormOpen = false;
  formMode: 'create' | 'edit' = 'create';
  formStep = 0;
  formSteps = ['Patient', 'Cognitive', 'ADL & Sleep', 'Notes'];
  editingId: number | null = null;
  submitAttempted = false;
  formError = '';
  pageError = '';
  successMsg = '';
  isSaving = false;
  form: FormGroup;

  // ADVANCED
  showStats = false;
  statistics: any = null;
  riskData: any = null;
  riskPatientId: number | null = null;
  showRiskPanel = false;

  filters = {
    query: '',
    mood: '' as '' | MoodState,
    sleepQuality: '' as '' | SleepQuality,
  };

  readonly moodOptions: Array<{ label: string; value: MoodState }> = [
    { label: '😌 Calm', value: 'CALM' },
    { label: '😊 Happy', value: 'HAPPY' },
    { label: '😰 Anxious', value: 'ANXIOUS' },
    { label: '😡 Agitated', value: 'AGITATED' },
    { label: '😞 Depressed', value: 'DEPRESSED' },
    { label: '😵 Confused', value: 'CONFUSED' },
  ];

  readonly sleepQualityOptions: Array<{ label: string; value: SleepQuality }> = [
    { label: 'Excellent', value: 'EXCELLENT' },
    { label: 'Good', value: 'GOOD' },
    { label: 'Fair', value: 'FAIR' },
    { label: 'Poor', value: 'POOR' },
  ];

  readonly independenceLevels: Array<{ label: string; value: IndependenceLevel }> = [
    { label: 'Independent', value: 'INDEPENDENT' },
    { label: 'Needs Assistance', value: 'NEEDS_ASSISTANCE' },
    { label: 'Dependent', value: 'DEPENDENT' },
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly followUpService: FollowUpService,
  ) {
    this.form = this.fb.group({
      patientId: [null, [Validators.required, Validators.min(1)]],
      caregiverId: [null, [Validators.required, Validators.min(1)]],
      followUpDate: ['', Validators.required],
      cognitiveScore: [null],
      mood: [null],
      agitationObserved: [false],
      confusionObserved: [false],
      eating: [null],
      dressing: [null],
      mobility: [null],
      hoursSlept: [null],
      sleepQuality: [null],
      notes: [''],
      vitalSigns: [''],
    });
  }

  ngOnInit(): void {
    this.loadFollowUps();
  }

  // ===== DATA LOADING =====
  private loadFollowUps(selectId?: number): void {
    this.followUpService.getAll().subscribe({
      next: (data) => {
        this.followUps = data;
        this.applyFilters();
      },
      error: (err) => {
        this.pageError =
          'Unable to load follow-ups. Verify followup-alert-service is running on port 8085.';
      },
    });
  }

  // ===== FILTERS =====
  applyFilters(): void {
    const q = this.filters.query.trim().toLowerCase();
    this.filteredFollowUps = this.followUps.filter((fu) => {
      const matchQuery =
        !q ||
        String(fu.patientId ?? '').includes(q) ||
        String(fu.caregiverId ?? '').includes(q) ||
        (fu.mood ?? '').toLowerCase().includes(q) ||
        (fu.notes ?? '').toLowerCase().includes(q) ||
        (fu.followUpDate ?? '').includes(q);
      const matchMood = !this.filters.mood || fu.mood === this.filters.mood;
      const matchSleep = !this.filters.sleepQuality || fu.sleepQuality === this.filters.sleepQuality;
      return matchQuery && matchMood && matchSleep;
    });
  }

  // ===== STATS =====
  getCalmCount(): number {
    return this.followUps.filter((f) => f.mood === 'CALM' || f.mood === 'HAPPY').length;
  }

  getAgitatedCount(): number {
    return this.followUps.filter((f) => f.mood === 'AGITATED' || f.mood === 'ANXIOUS').length;
  }

  getAvgCognitive(): string {
    const scores = this.followUps.filter((f) => f.cognitiveScore != null).map((f) => f.cognitiveScore!);
    if (scores.length === 0) return '-';
    return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  }

  // ===== DISPLAY HELPERS =====
  getMoodClass(mood: MoodState | null | undefined): string {
    if (!mood) return '';
    return 'mood-' + mood.toLowerCase();
  }

  getMoodIcon(mood: MoodState | null | undefined): string {
    const icons: Record<string, string> = {
      CALM: '😌', HAPPY: '😊', ANXIOUS: '😰', AGITATED: '😡', DEPRESSED: '😞', CONFUSED: '😵',
    };
    return icons[mood ?? ''] ?? '';
  }

  getCognitiveClass(score: number | null): string {
    if (score == null) return '';
    if (score >= 24) return 'cog-high';
    if (score >= 18) return 'cog-medium';
    return 'cog-low';
  }

  getCognitivePercent(score: number | null): number {
    if (score == null) return 0;
    return Math.min(100, (score / 30) * 100);
  }

  getSleepClass(quality: SleepQuality | null | undefined): string {
    if (!quality) return '';
    return 'sleep-' + quality.toLowerCase();
  }

  getAdlClass(level: IndependenceLevel | null | undefined): string {
    if (!level) return '';
    return 'adl-' + level.toLowerCase();
  }

  // ===== VIEW MODAL =====
  openViewModal(fu: FollowUp): void {
    this.viewFollowUp = fu;
    this.isViewOpen = true;
  }

  // ===== CREATE / EDIT =====
  openCreateModal(): void {
    this.formMode = 'create';
    this.editingId = null;
    this.formStep = 0;
    this.submitAttempted = false;
    this.formError = '';
    this.form.reset({
      patientId: null, caregiverId: null, followUpDate: '', cognitiveScore: null,
      mood: null, agitationObserved: false, confusionObserved: false,
      eating: null, dressing: null, mobility: null,
      hoursSlept: null, sleepQuality: null, notes: '', vitalSigns: '',
    });
    this.isFormOpen = true;
  }

  openEditModal(fu: FollowUp): void {
    this.formMode = 'edit';
    this.editingId = fu.id ?? null;
    this.formStep = 0;
    this.submitAttempted = false;
    this.formError = '';
    this.form.patchValue({
      patientId: fu.patientId, caregiverId: fu.caregiverId,
      followUpDate: fu.followUpDate ?? '', cognitiveScore: fu.cognitiveScore,
      mood: fu.mood, agitationObserved: fu.agitationObserved ?? false,
      confusionObserved: fu.confusionObserved ?? false,
      eating: fu.eating, dressing: fu.dressing, mobility: fu.mobility,
      hoursSlept: fu.hoursSlept, sleepQuality: fu.sleepQuality,
      notes: fu.notes ?? '', vitalSigns: fu.vitalSigns ?? '',
    });
    this.isFormOpen = true;
  }

  closeFormModal(): void {
    this.isFormOpen = false;
    this.formError = '';
    this.isSaving = false;
    this.formStep = 0;
  }

  // ===== STEPPER =====
  nextStep(): void {
    if (this.formStep === 0) {
      this.submitAttempted = true;
      const p = this.form.get('patientId');
      const c = this.form.get('caregiverId');
      const d = this.form.get('followUpDate');
      if (p?.invalid || c?.invalid || d?.invalid) return;
    }
    this.submitAttempted = false;
    if (this.formStep < this.formSteps.length - 1) {
      this.formStep++;
    }
  }

  prevStep(): void {
    if (this.formStep > 0) this.formStep--;
  }

  goToStep(step: number): void {
    if (step <= this.formStep) this.formStep = step;
  }

  // ===== SAVE =====
  validateAndSave(): void {
    this.formError = '';
    this.submitAttempted = true;
    this.form.markAllAsTouched();

    const req = ['patientId', 'caregiverId', 'followUpDate'];
    for (const key of req) {
      if (this.form.get(key)?.invalid) { this.formStep = 0; return; }
    }

    const v = this.form.value;
    const payload: Partial<FollowUp> = {
      patientId: Number(v.patientId), caregiverId: Number(v.caregiverId),
      followUpDate: v.followUpDate || null,
      cognitiveScore: v.cognitiveScore != null ? Number(v.cognitiveScore) : null,
      mood: v.mood || null, agitationObserved: !!v.agitationObserved,
      confusionObserved: !!v.confusionObserved,
      eating: v.eating || null, dressing: v.dressing || null, mobility: v.mobility || null,
      hoursSlept: v.hoursSlept != null ? Number(v.hoursSlept) : null,
      sleepQuality: v.sleepQuality || null,
      notes: v.notes || null, vitalSigns: v.vitalSigns || null,
    };

    this.isSaving = true;

    if (this.formMode === 'create') {
      this.followUpService.create(payload).subscribe({
        next: () => { this.closeFormModal(); this.loadFollowUps(); },
        error: (err) => {
          if (this.isSuccessButParseFail(err)) { this.closeFormModal(); this.loadFollowUps(); return; }
          this.isSaving = false;
          this.formError = err?.error?.message ?? 'Failed to create follow-up.';
        },
      });
    } else {
      if (!this.editingId) { this.isSaving = false; return; }
      this.followUpService.update(this.editingId, payload).subscribe({
        next: () => { this.closeFormModal(); this.loadFollowUps(); },
        error: (err) => {
          if (this.isSuccessButParseFail(err)) { this.closeFormModal(); this.loadFollowUps(); return; }
          this.isSaving = false;
          this.formError = err?.error?.message ?? 'Failed to update follow-up.';
        },
      });
    }
  }

  // ===== DELETE =====
  deleteFollowUp(fu: FollowUp): void {
    if (!fu.id) return;
    if (!confirm(`Delete follow-up #${fu.id} for Patient #${fu.patientId}?`)) return;
    this.followUpService.delete(fu.id).subscribe({
      next: () => this.loadFollowUps(),
      error: (err) => {
        if (this.isSuccessButParseFail(err)) { this.loadFollowUps(); return; }
        this.pageError = 'Failed to delete follow-up.';
      },
    });
  }

  // ==================== FONCTIONNALITES AVANCEES ====================

  // Toggle statistics panel
  toggleStats(): void {
    this.showStats = !this.showStats;
    if (this.showStats && !this.statistics) {
      this.followUpService.getStatistics().subscribe({
        next: (data) => this.statistics = data,
        error: () => this.pageError = 'Failed to load statistics.',
      });
    }
  }

  // Load patient risk score
  loadPatientRisk(): void {
    if (!this.riskPatientId || this.riskPatientId < 1) return;
    this.followUpService.getPatientRisk(this.riskPatientId).subscribe({
      next: (data) => { this.riskData = data; this.showRiskPanel = true; },
      error: () => this.pageError = 'Failed to calculate risk. Make sure the patient has follow-ups.',
    });
  }

  // Check cognitive decline for a patient
  checkCognitiveDecline(): void {
    if (!this.riskPatientId || this.riskPatientId < 1) return;
    this.followUpService.detectCognitiveDecline(this.riskPatientId).subscribe({
      next: (data) => {
        if (data.cognitiveDecline) {
          this.successMsg = `⚠️ Cognitive decline detected for Patient #${this.riskPatientId}! An alert has been auto-generated.`;
        } else {
          this.successMsg = `✅ No cognitive decline trend detected for Patient #${this.riskPatientId}.`;
        }
        setTimeout(() => this.successMsg = '', 5000);
      },
      error: () => this.pageError = 'Failed to check cognitive decline.',
    });
  }

  getRiskColor(): string {
    if (!this.riskData) return '#9ca3b4';
    const level = this.riskData.riskLevel;
    if (level === 'CRITICAL') return '#6f42c1';
    if (level === 'HIGH') return '#e24653';
    if (level === 'MODERATE') return '#cc8a13';
    return '#049f89';
  }

  // Helpers for statistics
  getDistEntries(dist: Record<string, number>): Array<{ key: string; value: number }> {
    if (!dist) return [];
    return Object.entries(dist).map(([key, value]) => ({ key, value }));
  }

  getBarPercent(value: number, total: number): number {
    if (!total) return 0;
    return Math.round((value / total) * 100);
  }

  // ===== UTILS =====
  controlHasError(name: string): boolean {
    const ctrl = this.form.get(name);
    return !!ctrl && this.submitAttempted && ctrl.invalid;
  }

  trackById(_: number, fu: FollowUp): number {
    return fu.id ?? _;
  }

  private isSuccessButParseFail(error: any): boolean {
    return (
      (error?.status === 200 || error?.status === 201) &&
      typeof error?.message === 'string' &&
      error.message.toLowerCase().includes('parsing')
    );
  }
}
