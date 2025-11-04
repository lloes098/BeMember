# BeMember Splash Screens

The app includes **3 different splash screen variants** that users see when they first open the app. Each has a unique style and animation.

## How to Switch Between Variants

In `/App.tsx`, uncomment the variant you want to use:

```typescript
// Option 1: Gradient with Floating Elements (Default)
import SplashScreen from './components/SplashScreen';

// Option 2: Clean Minimal Design
// import SplashScreen from './components/SplashScreenMinimal';

// Option 3: 3D Card Reveal
// import SplashScreen from './components/SplashScreenCard';
```

---

## Variant 1: Gradient with Floating Elements
**File:** `/components/SplashScreen.tsx`  
**Duration:** ~4 seconds

### Features
- 🌈 Gradient blue background (from #3366FF to #1a3d99)
- 💫 Floating animated orbs
- ✨ Grid pattern overlay
- 🎯 Rotating logo with glow effect
- 🎭 Feature pills (Verified, Shareable, Permanent)
- 📊 Loading progress bar
- 🎨 20+ floating particles
- 🏷️ "Powered by Base" badge

### Animation Timeline
- **0-0.5s**: Logo scale + rotate animation
- **0.5-1.5s**: Brand name fade in + line animation
- **1.5s**: Tagline appears
- **2.5s**: Feature pills pop in
- **3.5s**: Loading bar starts
- **4s**: Transition to main app

### Best For
- First-time user experience
- Demo/presentation mode
- Maximum visual impact

---

## Variant 2: Clean Minimal Design
**File:** `/components/SplashScreenMinimal.tsx`  
**Duration:** ~3 seconds

### Features
- 🤍 Pure white background
- 🎯 Simple logo with subtle glow
- 📝 Letter-by-letter brand name reveal
- ⚡ Loading dots animation
- 🏷️ "Powered by Base" text

### Animation Timeline
- **0-0.3s**: Logo scale spring animation
- **0.5-1.5s**: Letters appear one by one
- **1.5s**: Loading dots start
- **3s**: Transition to main app

### Best For
- Fast app loading
- Professional/corporate feel
- Minimal distraction
- Production environment

---

## Variant 3: 3D Card Reveal
**File:** `/components/SplashScreenCard.tsx`  
**Duration:** ~3.5 seconds

### Features
- 🎴 3D card flip animation
- 🌟 Animated grid background
- 💎 Shadow and glow effects
- 🎨 Gradient card header
- 🏅 "ONCHAIN VERIFIED" badge
- 🔮 Feature icons (Fast, Secure, Global)
- ⚙️ Loading indicator dots

### Animation Timeline
- **0-1s**: 3D card flip reveal
- **0.3s**: Logo rotation animation
- **0.6s**: Brand name fades in
- **0.9s**: Subtitle appears
- **1.2s**: Feature icons pop in
- **1.5s**: Separator line draws
- **2s**: Badge slides in
- **3.5s**: Transition to main app

### Best For
- Showcasing the card product
- Modern, premium feel
- Marketing/promotional use
- Demo videos

---

## Technical Details

### Common Props
All splash screens accept:
```typescript
interface SplashScreenProps {
  onComplete: () => void; // Callback when animation completes
}
```

### Dependencies
- `motion/react` - For smooth animations
- `lucide-react` - For icons

### Color Palette
- Primary Blue: `#3366FF`
- Dark Blue: `#2952CC`
- Darker Blue: `#1a3d99`
- White: `#FFFFFF`
- Light Gray: `#E6E8EB`
- Dark Text: `#111111`

### Animation Techniques Used
- Spring animations for natural movement
- Staggered animations for sequential reveals
- Opacity transitions for smooth fades
- Scale transforms for zoom effects
- Rotate transforms for spin effects
- Infinite loops for continuous movement

---

## Customization Tips

### Adjust Duration
Change the timeout in `useEffect`:
```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    onComplete();
  }, 3000); // Change this value (in milliseconds)
  
  return () => clearTimeout(timer);
}, [onComplete]);
```

### Change Colors
Update the gradient/background colors:
```typescript
// Gradient variant
className="bg-gradient-to-br from-[#3366FF] to-[#1a3d99]"

// Minimal variant
className="bg-white"

// Card variant
className="bg-gradient-to-br from-white via-[#F7F9FC] to-white"
```

### Skip Splash Screen
Set initial state to `false` in App.tsx:
```typescript
const [showSplash, setShowSplash] = useState(false); // Skip splash
```

### Add Sound Effect
Import an audio file and play it:
```typescript
useEffect(() => {
  const audio = new Audio('/sounds/whoosh.mp3');
  audio.play().catch(() => {}); // Ignore autoplay restrictions
}, []);
```

---

## Performance Considerations

- All animations use GPU-accelerated properties (transform, opacity)
- No layout thrashing
- Automatic cleanup of timers
- Optimized for 60fps
- Small bundle size (~5KB per variant)

---

## Accessibility

- No flashing animations (safe for photosensitive users)
- Respects `prefers-reduced-motion` (can be added)
- Auto-dismisses (no user action required)
- Semantic HTML structure

---

## Recommendations

**For Production:**
→ Use **SplashScreenMinimal** (fastest, cleanest)

**For Marketing/Demo:**
→ Use **SplashScreen** (most impressive)

**For Product Showcase:**
→ Use **SplashScreenCard** (highlights the card concept)
