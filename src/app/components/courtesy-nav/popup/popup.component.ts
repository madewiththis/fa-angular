import { Component, ElementRef, EventEmitter, HostListener, Input, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { Portal, TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'app-popup',
  template: `
    <ng-template #popupContent>
      <div class="popup-panel" (click)="$event.stopPropagation()">
        <ng-content></ng-content>
      </div>
    </ng-template>
    <ng-content select="[popupTrigger]"></ng-content>
  `,
  styles: [`
    .popup-panel {
      min-width: 200px;
      background: rgba(255,255,255,0.80);
      backdrop-filter: blur(50px);
      border-radius: 20px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      padding: 12px 0;
      margin-top: 8px;
      margin-right: 16px;
      z-index: 1001;
    }
  `]
})
export class PopupComponent {
  @ViewChild('popupContent') popupContent!: TemplateRef<any>;
  @Input() trigger!: ElementRef;
  @Output() closed = new EventEmitter<void>();

  private overlayRef?: OverlayRef;
  
  get isOpen(): boolean {
    return !!this.overlayRef;
  }

  constructor(private overlay: Overlay, private vcr: ViewContainerRef) {}

  open() {
    if (this.overlayRef) {
      return;
    }
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(this.trigger)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 4
        }
      ]);
    const overlayConfig = new OverlayConfig({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });
    this.overlayRef = this.overlay.create(overlayConfig);
    this.overlayRef.attach(new TemplatePortal(this.popupContent, this.vcr));
    this.overlayRef.backdropClick().subscribe(() => this.close());
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  close() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = undefined;
      this.closed.emit();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.close();
  }
} 