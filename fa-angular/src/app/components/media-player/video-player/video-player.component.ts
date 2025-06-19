import {
  Component, Input, Output, EventEmitter, ViewChild, ElementRef,
  AfterViewInit, OnDestroy, OnInit, OnChanges, SimpleChanges, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';

// To avoid issues with "YT" not being defined
declare var YT: any;

@Component({
  selector: 'app-video-player',
  template: `
    <div #playerHost style="height: 100%; width: 100%;">
      <div [ngSwitch]="videoType" style="height: 100%; width: 100%;">
        <video *ngSwitchCase="'html5'" #videoElement width="100%" height="100%" (canplay)="onLoaded()" (timeupdate)="onTimeUpdate($event)" (durationchange)="onDurationChange($event)"></video>
        <div *ngSwitchCase="'youtube'" #youtubePlayerContainer style="height: 100%; width: 100%;"></div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule],
})
export class VideoPlayerComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() src!: string;
  @Input() isPlaying = false;
  @Input() seekTime: number | null = null;

  @Output() timeUpdate = new EventEmitter<number>();
  @Output() durationChange = new EventEmitter<number>();
  @Output() loaded = new EventEmitter<void>();

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('youtubePlayerContainer') youtubePlayerContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('playerHost') playerHost!: ElementRef<HTMLDivElement>;
  
  videoType: 'html5' | 'youtube' = 'html5';
  private youtubePlayer: any;
  private youtubeVideoId: string | null = null;
  private timeUpdateInterval: any;
  private resizeObserver!: ResizeObserver;

  ngOnInit(): void {
    this.determineVideoType();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['src']) {
      this.determineVideoType();
      this.loadVideo();
    }
    if (changes['isPlaying']) {
      this.togglePlayback();
    }
    if (changes['seekTime'] && this.seekTime !== null) {
      this.seek();
    }
  }

  ngAfterViewInit(): void {
    this.loadVideo();
  }

  ngOnDestroy(): void {
    if (this.timeUpdateInterval) {
      clearInterval(this.timeUpdateInterval);
    }
    if (this.youtubePlayer && typeof this.youtubePlayer.destroy === 'function') {
      this.youtubePlayer.destroy();
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.videoType === 'html5' && this.videoElement?.nativeElement) {
      const video = this.videoElement.nativeElement;
      video.pause();
      video.removeAttribute('src');
      video.load();
    }
  }
  
  private determineVideoType(): void {
    this.youtubeVideoId = this.getYoutubeVideoId(this.src);
    this.videoType = this.youtubeVideoId ? 'youtube' : 'html5';
  }

  private getYoutubeVideoId(url: string): string | null {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }
  
  private loadVideo(): void {
    if (this.videoType === 'html5') {
      if (this.videoElement?.nativeElement) {
        this.videoElement.nativeElement.src = this.src;
        this.videoElement.nativeElement.controls = false;
      }
    } else if (this.videoType === 'youtube') {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
      this.loadYouTubeAPI().then(() => {
        this.createYouTubePlayer();
      });
    }
  }

  private togglePlayback(): void {
    if (this.videoType === 'html5' && this.videoElement?.nativeElement) {
      this.isPlaying ? this.videoElement.nativeElement.play() : this.videoElement.nativeElement.pause();
    } else if (this.videoType === 'youtube' && this.youtubePlayer && typeof this.youtubePlayer.playVideo === 'function') {
      this.isPlaying ? this.youtubePlayer.playVideo() : this.youtubePlayer.pauseVideo();
    }
  }

  private seek(): void {
    if (this.videoType === 'html5' && this.videoElement?.nativeElement && this.seekTime !== null) {
      this.videoElement.nativeElement.currentTime = this.seekTime;
    } else if (this.videoType === 'youtube' && this.youtubePlayer && typeof this.youtubePlayer.seekTo === 'function' && this.seekTime !== null) {
      this.youtubePlayer.seekTo(this.seekTime, true);
    }
  }
  
  onLoaded(): void {
    this.loaded.emit();
    this.onDurationChange();
    this.togglePlayback();
  }

  onTimeUpdate(event: Event): void {
    this.timeUpdate.emit((event.target as HTMLVideoElement).currentTime);
  }

  onDurationChange(event?: Event): void {
    this.durationChange.emit(this.videoElement?.nativeElement.duration);
  }

  private loadYouTubeAPI(): Promise<void> {
    return new Promise(resolve => {
      if ((window as any)['YT'] && (window as any)['YT'].Player) {
        resolve();
        return;
      }
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      (window as any)['onYouTubeIframeAPIReady'] = () => {
        resolve();
      };
    });
  }
  
  private createYouTubePlayer(): void {
    if (!this.youtubePlayerContainer || !this.youtubeVideoId) return;
    
    if (this.youtubePlayer && typeof this.youtubePlayer.destroy === 'function') {
        this.youtubePlayer.destroy();
    }

    this.youtubePlayer = new YT.Player(this.youtubePlayerContainer.nativeElement, {
      videoId: this.youtubeVideoId,
      playerVars: {
        'autoplay': this.isPlaying ? 1 : 0,
        'controls': 0,
        'rel': 0
      },
      events: {
        'onReady': (event: { target: any }) => this.onYouTubePlayerReady(event),
        'onStateChange': (event: { data: any }) => this.onYouTubePlayerStateChange(event)
      }
    });
  }

  private onYouTubePlayerReady(event: { target: any }): void {
    this.loaded.emit();
    this.durationChange.emit(this.youtubePlayer.getDuration());
    if (this.seekTime) {
      this.seek();
    }
    if (this.isPlaying) {
      this.youtubePlayer.playVideo();
    }
    this.setupResizeObserver();
  }

  private onYouTubePlayerStateChange(event: { data: any }): void {
    if (this.timeUpdateInterval) {
      clearInterval(this.timeUpdateInterval);
    }
    if (event.data === YT.PlayerState.PLAYING) {
      this.timeUpdateInterval = setInterval(() => {
        if(this.youtubePlayer && typeof this.youtubePlayer.getCurrentTime === 'function') {
           this.timeUpdate.emit(this.youtubePlayer.getCurrentTime());
        }
      }, 250);
    }
  }

  private setupResizeObserver(): void {
    if (!this.playerHost) return;

    this.resizeObserver = new ResizeObserver(entries => {
      if (entries.length > 0) {
        const { width, height } = entries[0].contentRect;
        if (this.youtubePlayer && typeof this.youtubePlayer.setSize === 'function') {
          this.youtubePlayer.setSize(width, height);
        }
      }
    });
    this.resizeObserver.observe(this.playerHost.nativeElement);
  }
} 