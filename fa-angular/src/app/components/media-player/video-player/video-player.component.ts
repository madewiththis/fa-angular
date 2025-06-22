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
        <video *ngSwitchCase="'html5'" #videoElement width="100%" height="100%" (canplay)="onLoaded()" (timeupdate)="onTimeUpdate($event)" (durationchange)="onDurationChange($event)" (seeked)="onSeeked()"></video>
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
  @Input() volume = 1;

  @Output() timeUpdate = new EventEmitter<number>();
  @Output() durationChange = new EventEmitter<number>();
  @Output() loaded = new EventEmitter<void>();
  @Output() seeked = new EventEmitter<void>();

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('youtubePlayerContainer') youtubePlayerContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('playerHost') playerHost!: ElementRef<HTMLDivElement>;
  
  videoType: 'html5' | 'youtube' = 'html5';
  private youtubePlayer: any;
  private youtubeVideoId: string | null = null;
  private timeUpdateInterval: any;
  private resizeObserver!: ResizeObserver;
  private playAfterSeek = false;

  ngOnInit(): void {
    this.determineVideoType();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['src']) {
      this.determineVideoType();
      this.loadVideo();
      return;
    }
    
    // Handle volume changes
    if (changes['volume']) {
      this.setVolume();
    }
    
    // If a seek is requested, store the intent to play and then seek.
    // The actual playing will be triggered by the 'onSeeked' event for HTML5.
    if (changes['seekTime'] && this.seekTime !== null) {
      this.playAfterSeek = this.isPlaying;
      this.seek();
    } 
    // If ONLY the playing state changes (no seek), toggle playback directly.
    else if (changes['isPlaying']) {
      this.togglePlayback();
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
      // For YouTube, we don't have a reliable seeked event, so we handle it here.
      if (this.playAfterSeek) {
        this.youtubePlayer.playVideo();
      }
      this.onSeeked(); // Still notify the parent that the seek command was sent
    }
  }

  private setVolume(): void {
    if (this.videoType === 'html5' && this.videoElement?.nativeElement) {
      this.videoElement.nativeElement.volume = this.volume;
    } else if (this.videoType === 'youtube' && this.youtubePlayer && typeof this.youtubePlayer.setVolume === 'function') {
      this.youtubePlayer.setVolume(this.volume * 100); // YouTube volume is 0-100
    }
  }
  
  onLoaded(): void {
    this.loaded.emit();
    this.onDurationChange();
    
    // Set initial volume
    this.setVolume();
    
    // Handle initial seek time if provided (important for restored minimized videos)
    if (this.seekTime !== null) {
      this.playAfterSeek = this.isPlaying;
      this.seek();
    } else {
      this.togglePlayback();
    }
  }

  onTimeUpdate(event: Event): void {
    this.timeUpdate.emit((event.target as HTMLVideoElement).currentTime);
  }

  onDurationChange(event?: Event): void {
    this.durationChange.emit(this.videoElement?.nativeElement.duration);
  }

  onSeeked(): void {
    // For HTML5, the seek operation has completed. If we intended to play, play now.
    if (this.videoType === 'html5' && this.playAfterSeek) {
      this.videoElement.nativeElement.play();
    }
    // Reset the flag
    this.playAfterSeek = false;
    // Notify the parent component
    this.seeked.emit();
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
    
    // Set initial volume
    this.setVolume();
    
    if (this.seekTime) {
      // Set the flag before seeking
      this.playAfterSeek = this.isPlaying;
      this.seek();
    }
    else if (this.isPlaying) {
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

  public getCurrentTime(): number {
    if (this.videoType === 'html5' && this.videoElement?.nativeElement) {
      return this.videoElement.nativeElement.currentTime;
    } else if (this.videoType === 'youtube' && this.youtubePlayer && typeof this.youtubePlayer.getCurrentTime === 'function') {
      return this.youtubePlayer.getCurrentTime();
    }
    return 0;
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