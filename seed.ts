import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('Bắt đầu chuyển dữ liệu từ JSON sang SQLite...')

  // Chuyển Users
  const usersPath = path.join(process.cwd(), 'database', 'users.json')
  if (fs.existsSync(usersPath)) {
    const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'))
    for (const u of users) {
      await prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: {
          id: u.id,
          name: u.name,
          email: u.email,
          password: u.password,
          role: u.role,
        }
      })
    }
    console.log(`Đã chuyển ${users.length} Users.`)
  }

  // Chuyển Products
  const productsPath = path.join(process.cwd(), 'database', 'products.json')
  if (fs.existsSync(productsPath)) {
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'))
    for (const p of products) {
      await prisma.product.upsert({
        where: { id: p.id },
        update: {},
        create: {
          id: p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          stock: p.stock,
          image: p.image,
          description: p.description,
          material: p.material,
          shape: p.shape,
          lensType: p.lensType,
          isNew: p.isNew ?? true
        }
      })
    }
    console.log(`Đã chuyển ${products.length} Products.`)
  }

  console.log('Hoàn tất chuyển đổi dữ liệu!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
