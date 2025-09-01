import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import articlesData from '../data/articles.json'
import bedrijvenData from '../data/bedrijven.json'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')
  
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const adminUser = await prisma.user.upsert({
    where: { username: 'editor' },
    update: {},
    create: {
      username: 'editor',
      email: 'editor@barneveldsdagblad.nl',
      password: adminPassword,
      role: 'ADMIN'
    }
  })
  console.log('✅ Admin user created')
  
  // Create editor user
  const editorPassword = await bcrypt.hash('editor123', 12)
  const editorUser = await prisma.user.upsert({
    where: { username: 'redacteur' },
    update: {},
    create: {
      username: 'redacteur',
      email: 'redacteur@barneveldsdagblad.nl',
      password: editorPassword,
      role: 'EDITOR'
    }
  })
  console.log('✅ Editor user created')
  
  // Seed articles
  console.log('📰 Seeding articles...')
  for (const article of articlesData) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        summary: article.summary,
        content: article.content || '',
        image: article.image,
        category: article.category,
        tags: article.tags || [],
        premium: article.premium || false,
        featured: Math.random() > 0.7, // Randomly feature 30% of articles
        published: true,
        publishedAt: new Date(article.publishedAt || article.timestamp || Date.now()),
        authorId: Math.random() > 0.5 ? adminUser.id : editorUser.id,
        views: Math.floor(Math.random() * 1000)
      }
    })
  }
  console.log(`✅ ${articlesData.length} articles seeded`)
  
  // Seed bedrijven
  console.log('🏢 Seeding bedrijven...')
  for (const bedrijf of bedrijvenData) {
    await prisma.bedrijf.upsert({
      where: { slug: bedrijf.slug },
      update: {},
      create: {
        slug: bedrijf.slug,
        name: bedrijf.name,
        description: bedrijf.description,
        category: bedrijf.category,
        logo: bedrijf.logo || null,
        website: bedrijf.website || null,
        phone: bedrijf.phone || null,
        email: bedrijf.email || null,
        address: bedrijf.address || null,
        city: bedrijf.city || 'Barneveld',
        featured: bedrijf.featured || false,
        active: true
      }
    })
  }
  console.log(`✅ ${bedrijvenData.length} bedrijven seeded`)
  
  // Seed some sample comments
  console.log('💬 Seeding sample comments...')
  const articles = await prisma.article.findMany({ take: 5 })
  for (const article of articles) {
    // Create 2-5 comments per article
    const commentCount = Math.floor(Math.random() * 4) + 2
    for (let i = 0; i < commentCount; i++) {
      await prisma.comment.create({
        data: {
          content: `Dit is een interessant artikel! Comment ${i + 1}`,
          approved: Math.random() > 0.3, // Approve 70% of comments
          articleId: article.id,
          authorId: Math.random() > 0.5 ? adminUser.id : editorUser.id
        }
      })
    }
  }
  console.log('✅ Sample comments seeded')
  
  // Seed newsletter subscriptions
  console.log('📧 Seeding newsletter subscriptions...')
  const sampleEmails = [
    'subscriber1@example.com',
    'subscriber2@example.com',
    'nieuws@barneveld.nl',
    'info@lokaalnieuws.nl'
  ]
  
  for (const email of sampleEmails) {
    await prisma.newsletter.upsert({
      where: { email },
      update: {},
      create: {
        email,
        active: true
      }
    })
  }
  console.log('✅ Newsletter subscriptions seeded')
  
  // Seed advertisements
  console.log('📢 Seeding advertisements...')
  const adSlots = [
    { slot: 'homepage-top', title: 'Homepage Top Banner' },
    { slot: 'homepage-sidebar', title: 'Homepage Sidebar' },
    { slot: 'article-sidebar', title: 'Article Sidebar' },
    { slot: 'footer-banner', title: 'Footer Banner' }
  ]
  
  for (const ad of adSlots) {
    await prisma.advertisement.upsert({
      where: { slot: ad.slot },
      update: {},
      create: {
        slot: ad.slot,
        title: ad.title,
        imageUrl: `https://via.placeholder.com/728x90?text=${encodeURIComponent(ad.title)}`,
        linkUrl: 'mailto:info@barneveldsdagblad.nl',
        active: true,
        views: Math.floor(Math.random() * 10000),
        clicks: Math.floor(Math.random() * 500)
      }
    })
  }
  console.log('✅ Advertisements seeded')
  
  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })