import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TocItem {
  label: string;
  target: string;
  isCta?: boolean;
}

@Component({
  selector: 'app-floating-toc',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floating-toc.component.html',
  styleUrl: './floating-toc.component.scss'
})
export class FloatingTocComponent implements OnInit {
  isVisible = true;
  activeSection = '';

  tocItems: TocItem[] = [
    { label: 'Top', target: 'app-top-menu' },
    { label: 'Features', target: 'app-features-section' },
    { label: 'Pricing', target: 'app-pricing-table' },
    { label: 'Support', target: 'app-support-learning' },
    { label: 'Integrations', target: 'app-integrations' },
    { label: 'Success Stories', target: 'app-social-proof' },
    { label: 'Try Now', target: 'app-hero', isCta: true }
  ];

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    // Update active section immediately
    this.updateActiveSection();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.updateActiveSection();
  }

  private updateActiveSection() {
    const scrollPosition = window.pageYOffset + 200; // Offset for better UX
    
    for (let i = this.tocItems.length - 1; i >= 0; i--) {
      const element = document.querySelector(this.tocItems[i].target) as HTMLElement;
      if (element && element.offsetTop <= scrollPosition) {
        this.activeSection = this.tocItems[i].target;
        break;
      }
    }
  }

  scrollToSection(target: string, isCta: boolean = false) {
    const element = document.querySelector(target) as HTMLElement;
    
    if (element) {
      const offsetTop = isCta ? 0 : element.offsetTop - 80; // Extra offset for CTA to go to top
      
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }

  trackByFn(index: number, item: TocItem): string {
    return item.target;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
} 