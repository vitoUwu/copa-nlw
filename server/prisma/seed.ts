import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      avatarUrl: 'https://github.com/vitouwu.png'
    }
  });

  const poll = await prisma.poll.create({
    data: {
      title: 'Example poll',
      code: '123456',
      ownerId: user.id,
      participants: {
        create: {
          userId: user.id
        }
      }
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-02T12:00:00.201Z',
      firstTeamCountryCode: 'BR',
      secondTeamCountryCode: 'DE'
    }
  })
  
  await prisma.game.create({
    data: {
      date: '2022-11-04T12:00:00.201Z',
      firstTeamCountryCode: 'BR',
      secondTeamCountryCode: 'AR',
      guesses: {
        create: {
          firstTeamPoints: 2,
          secondTeamPoints: 1,
          participant: {
            connect: {
              userId_pollId: {
                userId: user.id,
                pollId: poll.id
              }
            }
          }
        }
      }
    }
  })

  
}

main()