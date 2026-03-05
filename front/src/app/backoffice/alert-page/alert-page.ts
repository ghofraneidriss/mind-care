import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Alert, AlertLevel, AlertStatus } from './alert.model';
import { AlertService } from './alert.service';

@Component({
  selector: 'app-alert-page',
  standalone: false,
  templateUrl: './alert-page.html',
  styleUrls: ['./alert-page.css'],
})
export class AlertPageComponent implements OnInit {
  alerts: Alert[] = [];
  filteredAlerts: Alert[] = [];

  // Form
  isFormOpen = false;
  formMode: 'create' | 'edit' = 'create';
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
  bulkPatientId: number | null = null;

  filters = {
    query: '',
    level: '' as '' | AlertLevel,
    status: '' as '' | AlertStatus,
  };

  readonly levelOptions: Array<{ label: string; value: AlertLevel }> = [
    { label: '🔵 Low', value: 'LOW' },
    { label: '🟡 Medium', value: 'MEDIUM' },
    { label: '🔴 High', value: 'HIGH' },
    { label: '🟣 Critical', value: 'CRITICAL' },
  ];

  readonly statusOptions: Array<{ label: string; value: AlertStatus }> = [
    { label: 'New', value: 'NEW' },
    { label: 'Viewed', value: 'VIEWED' },
    { label: 'Resolved', value: 'RESOLVED' },
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly alertService: AlertService,
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      patientId: [null, [Validators.required, Validators.min(1)]],
      level: ['LOW', Validators.required],
      status: ['NEW', Validators.required],
      description: [''],
    });
  }

  ngOnInit(): void {
    this.loadAlerts();
  }

  // ===== DATA =====
  private loadAlerts(): void {
    this.alertService.getAll().subscribe({
      next: (data) => {
        this.alerts = data;
        this.applyFilters();
      },
      error: () => {
        this.pageError =
          'Unable to load alerts. Verify followup-alert-service is running on port 8085.';
      },
    });
  }

  // ===== FILTERS =====
  applyFilters(): void {
    const q = this.filters.query.trim().toLowerCase();
    this.filteredAlerts = this.alerts.filter((a) => {
      const matchQuery =
        !q ||
        (a.title ?? '').toLowerCase().includes(q) ||
        String(a.patientId ?? '').includes(q) ||
        (a.description ?? '').toLowerCase().includes(q);
      const matchLevel = !this.filters.level || a.level === this.filters.level;
      const matchStatus = !this.filters.status || a.status === this.filters.status;
      return matchQuery && matchLevel && matchStatus;
    });

    this.filteredAlerts.sort((a, b) => {
      const statusOrder: Record<string, number> = { NEW: 0, VIEWED: 1, RESOLVED: 2 };
      const sa = statusOrder[a.status] ?? 1;
      const sb = statusOrder[b.status] ?? 1;
      if (sa !== sb) return sa - sb;
      return (b.createdAt ?? '').localeCompare(a.createdAt ?? '');
    });
  }

  // ===== STATS =====
  getCountByStatus(status: AlertStatus): number {
    return this.alerts.filter((a) => a.status === status).length;
  }

  getCriticalCount(): number {
    return this.alerts.filter((a) => a.level === 'CRITICAL').length;
  }

  // ===== DISPLAY HELPERS =====
  getLevelClass(level: AlertLevel | string): string {
    return 'level-' + (level ?? '').toLowerCase();
  }

  getLevelBorderClass(level: AlertLevel | string): string {
    return 'border-' + (level ?? '').toLowerCase();
  }

  getLevelIcon(level: AlertLevel | string): string {
    const icons: Record<string, string> = {
      LOW: '🔵', MEDIUM: '🟡', HIGH: '🔴', CRITICAL: '🟣',
    };
    return icons[level ?? ''] ?? '';
  }

  getStatusClass(status: AlertStatus | string): string {
    return 'status-' + (status ?? '').toLowerCase();
  }

  formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  }

  // ===== CREATE / EDIT =====
  openCreateModal(): void {
    this.formMode = 'create';
    this.editingId = null;
    this.submitAttempted = false;
    this.formError = '';
    this.form.reset({ title: '', patientId: null, level: 'LOW', status: 'NEW', description: '' });
    this.isFormOpen = true;
  }

  openEditModal(alert: Alert): void {
    this.formMode = 'edit';
    this.editingId = alert.id ?? null;
    this.submitAttempted = false;
    this.formError = '';
    this.form.patchValue({
      title: alert.title, patientId: alert.patientId,
      level: alert.level, status: alert.status, description: alert.description ?? '',
    });
    this.isFormOpen = true;
  }

  closeFormModal(): void {
    this.isFormOpen = false;
    this.formError = '';
    this.isSaving = false;
  }

  validateAndSave(): void {
    this.formError = '';
    this.submitAttempted = true;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const v = this.form.value;
    const payload: Partial<Alert> = {
      title: v.title?.trim(), patientId: Number(v.patientId),
      level: v.level, status: v.status, description: v.description || null,
    };

    this.isSaving = true;

    if (this.formMode === 'create') {
      this.alertService.create(payload).subscribe({
        next: () => { this.closeFormModal(); this.loadAlerts(); },
        error: (err) => {
          if (this.isSuccessButParseFail(err)) { this.closeFormModal(); this.loadAlerts(); return; }
          this.isSaving = false;
          this.formError = err?.error?.message ?? 'Failed to create alert.';
        },
      });
    } else {
      if (!this.editingId) { this.isSaving = false; return; }
      this.alertService.update(this.editingId, payload).subscribe({
        next: () => { this.closeFormModal(); this.loadAlerts(); },
        error: (err) => {
          if (this.isSuccessButParseFail(err)) { this.closeFormModal(); this.loadAlerts(); return; }
          this.isSaving = false;
          this.formError = err?.error?.message ?? 'Failed to update alert.';
        },
      });
    }
  }

  // ===== DELETE =====
  deleteAlert(alert: Alert): void {
    if (!alert.id) return;
    if (!confirm(`Delete alert "${alert.title}"?`)) return;
    this.alertService.delete(alert.id).subscribe({
      next: () => this.loadAlerts(),
      error: (err) => {
        if (this.isSuccessButParseFail(err)) { this.loadAlerts(); return; }
        this.pageError = 'Failed to delete alert.';
      },
    });
  }

  // ==================== FONCTIONNALITES AVANCEES ====================

  // Escalate: LOW -> MEDIUM -> HIGH -> CRITICAL
  escalateAlert(alert: Alert): void {
    if (!alert.id) return;
    this.alertService.escalateAlert(alert.id).subscribe({
      next: (updated) => {
        this.successMsg = `Alert "${alert.title}" escalated from ${alert.level} to ${updated.level}`;
        this.loadAlerts();
        setTimeout(() => this.successMsg = '', 4000);
      },
      error: () => this.pageError = 'Failed to escalate alert.',
    });
  }

  // Mark as viewed
  markAsViewed(alert: Alert): void {
    if (!alert.id) return;
    this.alertService.markAsViewed(alert.id).subscribe({
      next: () => {
        this.successMsg = `Alert "${alert.title}" marked as viewed`;
        this.loadAlerts();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => this.pageError = 'Failed to mark alert as viewed.',
    });
  }

  // Resolve single alert
  resolveAlertAction(alert: Alert): void {
    if (!alert.id) return;
    this.alertService.resolveAlert(alert.id).subscribe({
      next: () => {
        this.successMsg = `Alert "${alert.title}" resolved`;
        this.loadAlerts();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => this.pageError = 'Failed to resolve alert.',
    });
  }

  // Bulk resolve all alerts for a patient
  bulkResolve(): void {
    if (!this.bulkPatientId || this.bulkPatientId < 1) return;
    if (!confirm(`Resolve ALL alerts for Patient #${this.bulkPatientId}?`)) return;
    this.alertService.resolveAllByPatient(this.bulkPatientId).subscribe({
      next: (res) => {
        this.successMsg = `${res.resolved} alerts resolved for Patient #${res.patientId}`;
        this.bulkPatientId = null;
        this.loadAlerts();
        setTimeout(() => this.successMsg = '', 4000);
      },
      error: () => this.pageError = 'Failed to bulk resolve.',
    });
  }

  // Toggle statistics panel
  toggleStats(): void {
    this.showStats = !this.showStats;
    if (this.showStats && !this.statistics) {
      this.alertService.getStatistics().subscribe({
        next: (data) => this.statistics = data,
        error: () => this.pageError = 'Failed to load statistics.',
      });
    }
  }

  // Helpers for statistics display
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

  trackById(_: number, alert: Alert): number {
    return alert.id ?? _;
  }

  private isSuccessButParseFail(error: any): boolean {
    return (
      (error?.status === 200 || error?.status === 201) &&
      typeof error?.message === 'string' &&
      error.message.toLowerCase().includes('parsing')
    );
  }
}
