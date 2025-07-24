import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BentoItem, BENTO_ITEMS, BENTO_CONFIG } from './hero-bento.data';

@Component({
  selector: 'app-hero-bento',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './hero-bento.component.html',
  styleUrls: ['./hero-bento.component.scss']
})
export class HeroBentoComponent implements OnInit, OnDestroy {
  expandedCard = 1; // Start with "Create" expanded
  isAutoRotating = true;
  private autoRotationInterval: any;
  private resumeAutoRotationTimeout: any;
  private isTransitioningGlobal = false;
  private transitionTimeout: any;

  bentoItems: BentoItem[] = BENTO_ITEMS;

  get topRowCards(): BentoItem[] {
    return this.bentoItems.slice(0, 3);
  }

  get bottomRowCards(): BentoItem[] {
    return this.bentoItems.slice(3, 6);
  }

  ngOnInit(): void {
    this.startAutoRotation();
  }

  ngOnDestroy(): void {
    this.stopAutoRotation();
    if (this.resumeAutoRotationTimeout) {
      clearTimeout(this.resumeAutoRotationTimeout);
    }
    if (this.transitionTimeout) {
      clearTimeout(this.transitionTimeout);
    }
  }

  private startAutoRotation(): void {
    if (!this.isAutoRotating) return;

    this.autoRotationInterval = setInterval(() => {
      const currentIndex = this.bentoItems.findIndex(item => item.id === this.expandedCard);
      const nextIndex = (currentIndex + 1) % this.bentoItems.length;
      this.expandedCard = this.bentoItems[nextIndex].id;
    }, BENTO_CONFIG.AUTO_ROTATION_INTERVAL);
  }

  private stopAutoRotation(): void {
    if (this.autoRotationInterval) {
      clearInterval(this.autoRotationInterval);
      this.autoRotationInterval = null;
    }
  }

  handleCardHover(cardId: number): void {
    if (this.expandedCard === cardId) return; // Don't re-trigger if already expanded
    
    this.isAutoRotating = false;
    this.stopAutoRotation();
    
    // Clear any existing transition timeout
    if (this.transitionTimeout) {
      clearTimeout(this.transitionTimeout);
    }
    
    // Set global transitioning state to hide all thumbnails during transition
    this.isTransitioningGlobal = true;
    
    // Delay the card expansion to allow current content to fade out
    this.transitionTimeout = setTimeout(() => {
      this.expandedCard = cardId;
      this.isTransitioningGlobal = false;
    }, 250); // 250ms to match the faster content fade out timing

    // Clear any existing timeout
    if (this.resumeAutoRotationTimeout) {
      clearTimeout(this.resumeAutoRotationTimeout);
    }
  }

  onCardMouseLeave(): void {
    // Clear any pending resume timeout when leaving a card
    if (this.resumeAutoRotationTimeout) {
      clearTimeout(this.resumeAutoRotationTimeout);
    }
  }

  onMouseLeave(): void {
    // Clear any existing timeout
    if (this.resumeAutoRotationTimeout) {
      clearTimeout(this.resumeAutoRotationTimeout);
    }

    // Resume auto-rotation when mouse leaves the grid
    this.resumeAutoRotationTimeout = setTimeout(() => {
      this.isAutoRotating = true;
      this.startAutoRotation();
    }, BENTO_CONFIG.MOUSE_LEAVE_RESUME_DELAY);
  }

  onCtaClick(item: BentoItem): void {
    console.log(`${item.cta} clicked for ${item.word}`);
    // Add your CTA logic here
  }

  isExpanded(cardId: number): boolean {
    return cardId === this.expandedCard;
  }

  shouldShowThumbnail(cardId: number): boolean {
    // Show thumbnail only if not expanded and not in global transition state
    return !this.isExpanded(cardId) && !this.isTransitioningGlobal;
  }

  getCardClasses(cardId: number): string {
    const baseClasses = 'bento-card';
    const stateClasses = this.isExpanded(cardId) ? 'bento-card-expanded' : 'bento-card-thumbnail';
    
    return `${baseClasses} ${stateClasses}`;
  }
} 