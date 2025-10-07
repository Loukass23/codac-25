# Dashboard with Parallel Routes Implementation

## Overview

Migrated from `/home` to `/dashboard` using Next.js 15 **Parallel Routes** pattern for improved performance, UX, and error handling.

## What Are Parallel Routes?

Parallel Routes allow you to simultaneously or conditionally render multiple pages in the same layout. Each route can have:

- **Independent loading states** - Different sections load independently
- **Isolated error handling** - One section failing doesn't break the whole page
- **Streaming** - Progressive rendering as data becomes available
- **Better UX** - Users see content incrementally

Reference: [Next.js Parallel Routes Documentation](https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes)

## Architecture

### Directory Structure

```
app/(dashboard)/dashboard/
├── layout.tsx                    # Main layout composing all slots
├── page.tsx                      # Header with "New Project" button
├── @stats/
│   ├── page.tsx                 # Stats cards section
│   ├── loading.tsx              # Stats loading skeleton
│   └── default.tsx              # Fallback when not matched
├── @projectTrends/
│   ├── page.tsx                 # Project growth area chart
│   ├── loading.tsx              # Chart loading skeleton
│   └── default.tsx              # Fallback when not matched
├── @activityChart/
│   ├── page.tsx                 # Community activity bar chart
│   ├── loading.tsx              # Chart loading skeleton
│   └── default.tsx              # Fallback when not matched
├── @myProjects/
│   ├── page.tsx                 # My Projects section
│   ├── loading.tsx              # Projects loading skeleton
│   └── default.tsx              # Fallback when not matched
├── @featured/
│   ├── page.tsx                 # Featured Projects section
│   ├── loading.tsx              # Featured loading skeleton
│   └── default.tsx              # Fallback when not matched
├── @techStack/
│   ├── page.tsx                 # Popular technologies chart
│   ├── loading.tsx              # Chart loading skeleton
│   └── default.tsx              # Fallback when not matched
└── @actions/
    ├── page.tsx                 # Quick Actions section
    ├── loading.tsx              # Actions loading skeleton
    └── default.tsx              # Fallback when not matched
```

### Slot Naming Convention

Slots are prefixed with `@` in the directory structure:

- `@stats` - Statistics cards (My Projects, Community Projects, Active Students, This Month)
- `@projectTrends` - Project growth area chart over 6 months
- `@activityChart` - Community activity bar chart (projects, comments, likes)
- `@myProjects` - User's projects section
- `@featured` - Featured community projects section
- `@techStack` - Popular technologies horizontal bar chart
- `@actions` - Quick action buttons

## Benefits

### 1. **Independent Loading States**

Each section loads independently with its own skeleton loader:

- Stats cards can load while projects are still fetching
- Users see partial content immediately
- No "all or nothing" loading experience

### 2. **Error Isolation**

If one data fetch fails (e.g., featured projects):

- Other sections continue to work normally
- Each section has its own error boundary
- Better fault tolerance and UX

### 3. **Streaming & Performance**

- React Server Components stream as they resolve
- Faster Time to First Byte (TTFB)
- Progressive enhancement
- Better perceived performance

### 4. **Better Code Organization**

- Each section is a separate component
- Easier to maintain and test
- Clear separation of concerns
- Reusable loading and error states

## Implementation Details

### Layout Composition

```typescript
// app/(dashboard)/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  stats,
  projectTrends,
  activityChart,
  myProjects,
  featured,
  techStack,
  actions,
}: DashboardLayoutProps) {
  return (
    <PageContainer>
      {children}      {/* Main page content */}
      {stats}         {/* @stats slot - 4 stat cards */}

      {/* Analytics & Trends Section - 2 column grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {projectTrends}   {/* @projectTrends slot - Area chart */}
        {activityChart}   {/* @activityChart slot - Bar chart */}
      </div>

      {/* Projects Section */}
      {myProjects}    {/* @myProjects slot */}
      {featured}      {/* @featured slot */}

      {/* Tech Stack & Actions - 2 column grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {techStack}     {/* @techStack slot - Horizontal bar chart */}
        {actions}       {/* @actions slot - Quick actions */}
      </div>
    </PageContainer>
  );
}
```

### Loading States

Each slot has a `loading.tsx` file with skeleton loaders:

- Cards with shimmer effects
- Consistent with the design system
- Maintains layout shift prevention

### Default Files

Each slot has a `default.tsx` returning `null`:

- Required for Next.js parallel routes
- Handles unmatched routes gracefully
- Prevents 404 errors during navigation

## Migration Changes

### Updated Routes

1. **Landing Page** (`app/page.tsx`)
   - Changed redirect: `/home` → `/dashboard`

2. **Sidebar Navigation** (`components/app-sidebar.tsx`)
   - Updated Dashboard link: `/home` → `/dashboard`

3. **Breadcrumbs** (`components/app-breadcrumb.tsx`)
   - Updated route config: `/home` → `/dashboard`

4. **Tests** (`tests/e2e/auth-registration.spec.ts`)
   - Updated test comments to reference `/dashboard`

### Removed Files

- `app/(dashboard)/home/page.tsx` - Replaced by parallel routes structure

## Data Fetching

Each slot fetches its own data independently:

```typescript
// @stats/page.tsx
const [userProjects, stats] = await Promise.all([
  getUserProjects(),
  getProjectStats(),
]);

// @myProjects/page.tsx
const userProjects = await getUserProjects();

// @featured/page.tsx
const featuredProjects = await getFeaturedProjects(3);
```

This parallel fetching is more efficient than sequential fetching.

## Testing Recommendations

### Manual Testing

1. **Visit `/dashboard`** - Verify all sections load
2. **Slow 3G simulation** - Check progressive loading
3. **Error scenarios** - Disable API endpoints to test error isolation
4. **Navigation** - Verify breadcrumbs and sidebar links work

### Automated Testing

Update E2E tests to:

- Test individual section loading
- Verify error boundaries work
- Check loading states appear/disappear
- Validate data integrity in each section

## Data Visualization

### Chart Components

The dashboard uses **Recharts** library for data visualization with three types of charts:

1. **Area Chart** (`@projectTrends`)
   - Shows project creation trends over 6 months
   - Dual series: Total Projects & Featured Projects
   - Gradient fills using theme colors (`--primary`, `--chart-2`)

2. **Bar Chart** (`@activityChart`)
   - Displays weekly community activity
   - Multiple series: New Projects, Comments, Likes
   - Last 4 weeks of data
   - Uses theme colors (`--primary`, `--chart-2`, `--chart-3`)

3. **Horizontal Bar Chart** (`@techStack`)
   - Top 10 most used technologies
   - Color-coded bars using theme chart colors
   - Shows usage count and percentage
   - Uses full theme color palette (`--primary`, `--chart-1` through `--chart-5`)

### Data Sources

Data fetching functions in `data/projects/get-project-trends.ts`:

- `getProjectTrends()` - Project creation over 6 months
- `getActivityTrends()` - Community engagement over 4 weeks
- `getTechStackDistribution()` - Top 10 technologies

All charts have:

- Loading states with skeletons
- Error boundaries for fault tolerance
- Responsive design (mobile-first)
- **Theme-aware colors** - Uses CSS variables (`--primary`, `--chart-1` through `--chart-5`)
- Automatic color adaptation when theme changes
- Consistent color scheme across all visualizations

## Future Enhancements

1. **Add More Slots**
   - `@notifications` - Recent notifications
   - `@recentActivity` - Recent activity feed
   - `@events` - Upcoming events
   - `@leaderboard` - Top contributors

2. **Enhanced Charts**
   - Date range filters
   - Export chart data
   - Interactive tooltips with drill-down
   - Real-time updates

3. **Conditional Rendering**
   - Show/hide sections based on user role
   - Feature flags for experimental features
   - A/B testing different layouts

4. **Modal Integration**
   - Use parallel routes with intercepting routes
   - Create project modal overlay
   - Quick view modals for projects

## References

- [Next.js Parallel Routes](https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes)
- [Loading UI and Streaming](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)

## Theme Integration

All dashboard elements use theme-aware colors from CSS variables:

### Color Mapping

- **Primary highlights**: `--primary` (adapts to selected theme)
- **Chart series**: `--chart-1` through `--chart-5` (theme-specific colors)
- **Icons**: `text-primary`, `text-chart-2`, `text-chart-3`
- **Text**: `text-muted-foreground` for secondary text

### Benefits of Theme Colors

1. **Automatic adaptation** - Colors change with theme selection (zinc, blue, green, violet, orange, red, rose)
2. **Consistent design** - All elements follow the same color scheme
3. **Accessibility** - Theme colors are designed for proper contrast
4. **Maintainability** - No hardcoded colors to update
5. **User preference** - Respects user's theme choice

### Supported Themes

The dashboard automatically adapts to all available themes:

- Zinc (default)
- Blue
- Green
- Violet
- Orange
- Red
- Rose

Each theme has its own `--primary` and `--chart-*` color palette that maintains visual hierarchy and accessibility.

## Conclusion

The parallel routes implementation provides:

- ✅ Better performance through streaming
- ✅ Improved UX with progressive loading
- ✅ Better error handling and fault tolerance
- ✅ More maintainable code structure
- ✅ Future-ready architecture
- ✅ **Theme-aware visualizations** that adapt to user preferences

This pattern is particularly valuable for dashboard pages with multiple independent data sources and dynamic theming requirements.
