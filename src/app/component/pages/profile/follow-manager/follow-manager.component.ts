
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../../services';

@Component({
  selector: 'app-follow-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './follow-manager.component.html',
  styleUrls: ['./follow-manager.component.scss']
})
export class FollowManagerComponent implements OnInit, OnChanges {
  @Input() open: boolean = false;
  @Input() type: 'followers' | 'following' = 'followers';
  @Output() close = new EventEmitter<void>();

  users: any[] = [];
  searchTerm: string = '';
  loading = false;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
}

ngOnChanges(changes: SimpleChanges): void {
  if ((changes['open'] || changes['type']) && this.open) {
    this.load();
  }
}

  async load(): Promise<void> {
    this.loading = true;
    try {
      if (this.type === 'followers') {
        this.users = await this.profileService.getFollowers();
      } else {
        this.users = await this.profileService.getFollowings();
      }
    } catch (err) {
      console.error('Error loading follows', err);
      this.users = [];
    } finally {
      this.loading = false;
    }
  }

  get filteredUsers(): any[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.users || [];
    return (this.users || []).filter(u => (u.name || u.username || '').toLowerCase().includes(term));
  }

  onClose(): void {
    this.close.emit();
  }

  backdropClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('fm-overlay')) {
      this.onClose();
    }
  }
}
