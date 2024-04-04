import { prisma } from '../src/lib/prisma'

async function seed() {
  await prisma.event.create({
    data: {
      id: '877a0891-015d-4dd8-b3bf-9e7cfa22580e',
      title: 'Node Event',
      slug: 'node-event',
      details: 'Event for Node developers!',
      maximumAttendees: 100,
    }
  })
}

seed().then(() => {
  console.log('Database seeded!')
  prisma.$disconnect()
})
