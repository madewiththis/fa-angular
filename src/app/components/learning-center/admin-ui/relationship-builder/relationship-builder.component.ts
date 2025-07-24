import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-relationship-builder',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="relationship-builder">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Relationship Builder</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="placeholder-content">
            <mat-icon class="placeholder-icon">hub</mat-icon>
            <h3>Visual Relationship Builder (Coming Soon)</h3>
            <p>Drag and drop interface to assign workflows to goals and tasks to workflows.</p>
            <button mat-raised-button color="primary" disabled>
              <mat-icon>account_tree</mat-icon>
              Build Relationships
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .relationship-builder {
      height: 100%;
    }
    
    .placeholder-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 400px;
      text-align: center;
      
      .placeholder-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: #ccc;
        margin-bottom: 16px;
      }
      
      h3 {
        margin: 0 0 8px 0;
        color: #666;
      }
      
      p {
        margin: 0 0 24px 0;
        color: #999;
      }
    }
  `]
})
export class RelationshipBuilderComponent {}