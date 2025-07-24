# Features Section Component Versions

This document outlines the versioning structure for the features section component.

## Version Structure

### V1 (Stable/Archive)
- **Location**: `features-section-v1/`
- **Selector**: `app-features-section-v1`
- **Purpose**: Archive version of the original features section component
- **Status**: Stable, preserved for reference

### V2 (Development)
- **Location**: `features-section-v2/`
- **Selector**: `app-features-section-v2`
- **Purpose**: Active development version for new features and improvements
- **Status**: Active development

### Original (Current Production)
- **Location**: `features-section/`
- **Selector**: `app-features-section`
- **Purpose**: Current production version
- **Status**: Production ready

## Usage

To use a specific version in your templates:

```html
<!-- V1 Version -->
<app-features-section-v1></app-features-section-v1>

<!-- V2 Version -->
<app-features-section-v2></app-features-section-v2>

<!-- Original/Current Version -->
<app-features-section></app-features-section>
```

## Import Statements

```typescript
// V1 Version
import { FeaturesSectionV1Component } from './components/landing/features-section-v1/features-section-v1.component';

// V2 Version
import { FeaturesSectionV2Component } from './components/landing/features-section-v2/features-section-v2.component';

// Original Version
import { FeaturesSectionComponent } from './components/landing/features-section/features-section.component';
```

## Development Workflow

1. **V1**: Keep as-is for reference and rollback purposes
2. **V2**: Make all new development and changes here
3. **Original**: Update only when V2 is ready for production

When V2 is ready for production:
1. Test V2 thoroughly
2. Replace original with V2 content
3. Archive current original as V3 if needed
4. Start new development in a new version folder 