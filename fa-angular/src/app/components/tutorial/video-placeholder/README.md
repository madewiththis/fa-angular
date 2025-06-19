# Video Placeholder Component

A click-to-play video placeholder that opens videos directly in floating mode.

## Features

- 🎬 **Thumbnail Display**: Shows video thumbnail with play button overlay
- ▶️ **Click to Play**: Opens video directly in floating mode (center position)
- 🎯 **Auto-Play**: Video starts playing automatically when opened
- 📱 **Responsive Design**: Adapts to different screen sizes
- 🎨 **Modern UI**: Clean, professional appearance with hover effects

## Usage

```typescript
import { VideoPlaceholderComponent } from '../components/tutorial/video-placeholder/video-placeholder.component';

@Component({
  imports: [VideoPlaceholderComponent],
  template: `
    <app-video-placeholder
      videoId="my-tutorial"
      videoUrl="/assets/videos/tutorial.mp4"
      title="How to Use FlowAccount"
      description="Learn the basics of FlowAccount with this tutorial"
      thumbnailUrl="/assets/images/tutorial-thumb.jpg"
      [startTime]="30">
    </app-video-placeholder>
  `
})
```

## Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `videoId` | `string` | ✅ | Unique identifier for the video |
| `videoUrl` | `string` | ✅ | URL/path to the video file |
| `title` | `string` | ❌ | Video title (displayed below thumbnail) |
| `description` | `string` | ❌ | Video description (displayed below title) |
| `thumbnailUrl` | `string` | ❌ | URL to thumbnail image |
| `startTime` | `number` | ❌ | Start time in seconds (default: 0) |

## Behavior

1. **Click**: User clicks on the placeholder
2. **Initialize**: Video service initializes with provided config
3. **Float**: Video opens in floating mode at center position
4. **Play**: Video starts playing automatically
5. **Control**: User can use all floating video controls (move, resize, minimize, etc.)

## Styling

The component uses responsive design with:
- Hover effects (lift and scale)
- Modern play button with backdrop blur
- Clean typography for title/description
- Mobile-optimized sizing

## Example Implementation

See `src/app/pages/dashboard/get-started/get-started.component.ts` for a complete example. 