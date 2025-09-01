# 📰 Dynamic Article System - Usage Guide

## Overview

The Dynamic Article System provides a complete, scalable framework for managing and displaying articles on the Barnevelds Dagblad website. Built with Next.js 15, it features professional layouts, SEO optimization, and modular components.

## ✅ What's Implemented

### 1. Core Components
- **ArticleLayout** - Master layout with responsive grid (8/4 columns)
- **Dynamic routing** - `/artikel/[slug]` with static generation
- **Sidebar widgets** - Net Binnen, Meest Gelezen, Advertisements, Related Articles
- **SEO system** - Comprehensive metadata, JSON-LD, OpenGraph
- **Theme configuration** - Centralized styling system

### 2. Data Structure
```typescript
interface Article {
  id: string
  title: string
  summary: string
  excerpt: string
  content?: string          // HTML content
  image: string
  category: string
  premium: boolean
  author: string
  timestamp: string
  publishedAt: string
  updatedAt?: string
  comments: number
  tags: string[]
  slug: string
  readTime?: number         // Minutes
}
```

### 3. File Structure
```
src/
├── components/
│   ├── ArticleLayout.tsx           # Master article layout
│   └── widgets/
│       ├── NetBinnenWidget.tsx     # Latest news sidebar
│       ├── MostReadWidget.tsx      # Popular articles
│       ├── Advertisement.tsx       # Ad placements
│       └── RelatedArticles.tsx     # Related content
├── app/artikel/[slug]/
│   ├── page.tsx                    # Dynamic article page
│   └── not-found.tsx              # 404 page
├── lib/
│   ├── articles.ts                 # CRUD operations
│   └── articleSEO.ts              # SEO utilities
├── config/
│   └── articleTheme.ts            # Theme configuration
└── types/
    └── article.ts                 # TypeScript definitions
```

## 🚀 How to Use

### Adding New Articles

1. **Programmatically** (recommended for CMS integration):
```typescript
import { addArticle } from '@/lib/articles'

const newArticle = await addArticle({
  title: "New Article Title",
  summary: "Brief summary",
  excerpt: "Longer excerpt...",
  content: "<p>Full HTML content...</p>",
  image: "/path/to/image.jpg",
  category: "Lokaal Nieuws",
  premium: false,
  author: "Author Name",
  publishedAt: "2025-09-01",
  comments: 0,
  tags: ["tag1", "tag2"],
  slug: "new-article-title"
})
```

2. **Manually** (via JSON file):
Add to `/data/articles.json`:
```json
{
  "id": "unique-id",
  "title": "Article Title",
  "content": "<p>Full article content...</p>",
  // ... other fields
}
```

### Accessing Articles

Articles are automatically available at:
- **URL**: `https://site.com/artikel/[slug]`
- **Example**: `https://site.com/artikel/burgemeester-kondigt-grote-renovatie-aan-centrum-barneveld`

### Customizing the Layout

1. **Sidebar Widgets Order** - Edit `ArticleLayout.tsx`:
```tsx
<aside className="lg:col-span-4 space-y-6">
  <NetBinnenWidget />           // Move widgets around
  <MostReadWidget />            // Add/remove widgets
  <Advertisement slot="..." />   // Customize ads
  <RelatedArticles />           // Configure related articles
</aside>
```

2. **Theme Colors** - Edit `src/config/articleTheme.ts`:
```typescript
colors: {
  primary: '#0F47AF',    // Change brand blue
  secondary: '#FCDD0C',  // Change yellow
  // ... other colors
}
```

3. **Typography** - Update theme configuration:
```typescript
fonts: {
  heading: 'Poppins, system-ui',  // Article headings
  body: 'Inter, system-ui'        // Article content
}
```

### SEO Optimization

SEO is handled automatically, but you can customize:

1. **Default Settings** - Edit `src/lib/articleSEO.ts`:
```typescript
export const defaultSEO = {
  siteName: 'Barnevelds Dagblad',
  domain: 'barnevelds-dagblad.nl',
  // ... other defaults
}
```

2. **Per-Article Metadata** - Automatically generated from article data
3. **Structured Data** - JSON-LD schema included automatically

## 🎨 Customization Examples

### Adding a New Widget

1. Create widget component:
```typescript
// src/components/widgets/CustomWidget.tsx
export default function CustomWidget() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3>Custom Widget</h3>
      {/* Widget content */}
    </div>
  )
}
```

2. Add to ArticleLayout:
```typescript
import CustomWidget from '@/components/widgets/CustomWidget'

// In ArticleLayout sidebar:
<CustomWidget />
```

### Modifying Article Content Display

Update the content area in `ArticleLayout.tsx`:
```tsx
<div className="prose prose-lg prose-gray max-w-none">
  {children}
  {/* Add custom elements here */}
</div>
```

### Changing Advertisement Sizes

```tsx
<Advertisement 
  slot="custom-slot" 
  width={728} 
  height={90} 
  className="my-custom-ad"
/>
```

## 🔧 Advanced Configuration

### CMS Integration

Replace file-based storage with API calls:

1. **Update `src/lib/articles.ts`**:
```typescript
export async function getArticles(): Promise<Article[]> {
  // Replace with CMS API call
  const response = await fetch('https://cms.example.com/api/articles')
  return response.json()
}
```

2. **Update dynamic routes** - No changes needed, they'll automatically use new data source

### Performance Optimization

1. **Static Generation** - Already enabled via `generateStaticParams()`
2. **Image Optimization** - Uses Next.js Image component
3. **Caching** - Add Redis/memory caching to article functions

### Content Management

1. **Rich Text Editor** - Store HTML in `article.content` field
2. **Markdown Support** - Add markdown parser to article display
3. **Media Management** - Integrate with image upload service

## 📊 Monitoring & Analytics

### Built-in Features

- **Reading Time** - Automatically calculated from content
- **Comment Counts** - Tracked per article
- **Category Organization** - Automatic categorization
- **Tag System** - SEO and content organization

### Future Enhancements

1. **View Tracking** - Add analytics to track article views
2. **Social Sharing** - Expand share buttons functionality
3. **User Comments** - Add comment system integration
4. **Newsletter** - Add newsletter signup widgets

## 🚨 Important Notes

### Production Checklist

Before going live:

1. ✅ **Test all article URLs** work correctly
2. ✅ **Verify SEO metadata** appears in page source
3. ✅ **Check mobile responsiveness** 
4. ✅ **Replace placeholder ads** with real ad code
5. ✅ **Configure proper images** (not placeholder)
6. ✅ **Set up analytics** tracking

### Content Guidelines

- **Images**: Use high-quality images (min 1200x630 for social sharing)
- **Content**: Store as clean HTML for best SEO
- **Slugs**: Use URL-friendly slugs (auto-generated available)
- **Categories**: Keep categories consistent for better UX

## 🎯 Benefits

### For Developers
- **Modular**: Easy to maintain and extend
- **Type-safe**: Full TypeScript support
- **SEO-ready**: Comprehensive metadata system
- **Responsive**: Mobile-first design

### For Content Creators
- **Consistent Layout**: Professional appearance across all articles
- **SEO Optimized**: Automatic optimization for search engines
- **Fast Loading**: Optimized images and static generation
- **Social Ready**: Auto-generated social media previews

### For Site Owners
- **Scalable**: Handles thousands of articles efficiently
- **Professional**: Matches AD.nl-style newspaper design
- **Maintainable**: Changes update across all articles
- **Analytics Ready**: Built-in tracking capabilities

## 🔄 Migration from Old System

If migrating existing articles:

1. **Export existing data** to match Article interface
2. **Convert content** to HTML format
3. **Generate slugs** using `generateSlug()` utility
4. **Import via** `addArticle()` function or JSON file
5. **Set up redirects** for old URLs

This system provides a solid foundation that can grow with your news site's needs!