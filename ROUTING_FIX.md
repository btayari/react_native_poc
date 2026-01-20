# Routing Fixes Applied
## Issues Fixed
### 1. **Blank Screen on Production**
   - **Problem**: GitHub Pages was not loading JavaScript files due to incorrect base URL
   - **Solution**: Added `baseUrl: "/react-native-poc"` to `app.json` web config
   - **Solution**: Added `.nojekyll` file to prevent GitHub Pages from ignoring `_expo` folder
### 2. **Navigation Loop Error**
   - **Problem**: "Attempted to navigate before mounting the Root Layout component"
   - **Solution**: Used `setTimeout` with `router.replace()` instead of direct navigation in useEffect
   - **Solution**: Added loading indicator while redirecting from index page
### 3. **Routing Structure**
   - **Problem**: Confusing routing with tabs that weren't being used
   - **Solution**: Simplified root layout to use Stack navigation only
   - **Solution**: Removed unnecessary tab navigation since app uses side menu
## Changes Made
### Files Modified:
1. **app.json**
   - Added `baseUrl: "/react-native-poc"` to web configuration
2. **package.json**
   - Added `homepage` field for GitHub Pages
   - Updated build script to copy `.nojekyll` file
3. **app/_layout.tsx**
   - Simplified to use Stack navigation only
   - Removed tabs reference
   - Added `animation: 'none'` for instant navigation
   - Set `initialRouteName: "index"`
4. **app/index.tsx**
   - Changed from direct Redirect to useEffect with setTimeout
   - Added loading indicator
   - Uses `router.replace()` to avoid back button issues
5. **.github/workflows/deploy.yml**
   - Added step to create `.nojekyll` file
   - Fixed output directory specification
## How It Works Now
1. **Initial Load**: 
   - User visits `/` or `/react-native-poc/`
   - Shows loading indicator briefly
   - Automatically redirects to `/tactical-lineup`
2. **Side Menu Navigation**:
   - "Prediction" button → `/tactical-lineup`
   - "Squad" button → `/squad-management`
   - Uses `router.push()` for navigation
   - Active state is tracked with `usePathname()`
3. **Web Layout**:
   - Screens detect window width > 900px
   - Automatically show side menu on left
   - Layout adjusts for mobile (drawer menu)
## Testing
To test locally:
```bash
npm run web
```
To build and deploy:
```bash
npm run build
npm run deploy
```
The app will be available at: https://btayari.github.io/react-native-poc/
