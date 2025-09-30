import prisma from '../lib/prisma'
import { ChatMessage } from './sessionService'

export interface CreateUserData {
  email: string
  name?: string
  avatar?: string
}

export interface CreateVideoData {
  youtubeId: string
  title: string
  description?: string
  thumbnail?: string
  duration?: number
  url: string
  userId?: string
}

export interface CreateChatData {
  videoId: string
  userId?: string
  message: string
  response?: string
}

export class DatabaseService {
  /**
   * User Management
   */
  async createUser(data: CreateUserData) {
    try {
      const user = await prisma.user.create({
        data
      })
      console.log(`👤 User created: ${user.email}`)
      return user
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  async getUserByEmail(email: string) {
    try {
      return await prisma.user.findUnique({
        where: { email },
        include: {
          sessions: true,
          videos: true,
          chats: true
        }
      })
    } catch (error) {
      console.error('Error finding user by email:', error)
      throw error
    }
  }

  async getUserById(id: string) {
    try {
      return await prisma.user.findUnique({
        where: { id },
        include: {
          sessions: true,
          videos: true,
          chats: true
        }
      })
    } catch (error) {
      console.error('Error finding user by id:', error)
      throw error
    }
  }

  /**
   * Session Management
   */
  async createSession(userId: string, token: string, expiresAt: Date) {
    try {
      const session = await prisma.session.create({
        data: {
          userId,
          token,
          expiresAt
        },
        include: {
          user: true
        }
      })
      console.log(`🔐 Session created for user: ${userId}`)
      return session
    } catch (error) {
      console.error('Error creating session:', error)
      throw error
    }
  }

  async getSessionByToken(token: string) {
    try {
      return await prisma.session.findUnique({
        where: { token },
        include: {
          user: true
        }
      })
    } catch (error) {
      console.error('Error finding session by token:', error)
      throw error
    }
  }

  async deleteSession(token: string) {
    try {
      await prisma.session.delete({
        where: { token }
      })
      console.log(`🗑️ Session deleted: ${token}`)
    } catch (error) {
      console.error('Error deleting session:', error)
      throw error
    }
  }

  /**
   * Video Management
   */
  async createOrUpdateVideo(data: CreateVideoData) {
    try {
      const video = await prisma.video.upsert({
        where: { youtubeId: data.youtubeId },
        update: {
          title: data.title,
          description: data.description,
          thumbnail: data.thumbnail,
          duration: data.duration,
          url: data.url,
          userId: data.userId
        },
        create: data,
        include: {
          user: true,
          chats: true
        }
      })
      console.log(`🎥 Video created/updated: ${video.title}`)
      return video
    } catch (error) {
      console.error('Error creating/updating video:', error)
      throw error
    }
  }

  async getVideoByYouTubeId(youtubeId: string) {
    try {
      return await prisma.video.findUnique({
        where: { youtubeId },
        include: {
          user: true,
          chats: {
            include: {
              user: true
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      })
    } catch (error) {
      console.error('Error finding video by YouTube ID:', error)
      throw error
    }
  }

  async getVideoById(id: string) {
    try {
      return await prisma.video.findUnique({
        where: { id },
        include: {
          user: true,
          chats: {
            include: {
              user: true
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      })
    } catch (error) {
      console.error('Error finding video by id:', error)
      throw error
    }
  }

  async getUserVideos(userId: string) {
    try {
      return await prisma.video.findMany({
        where: { userId },
        include: {
          chats: {
            include: {
              user: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } catch (error) {
      console.error('Error finding user videos:', error)
      throw error
    }
  }

  /**
   * Chat Management
   */
  async createChat(data: CreateChatData) {
    try {
      const chat = await prisma.chat.create({
        data,
        include: {
          video: true,
          user: true
        }
      })
      console.log(`💬 Chat created for video: ${chat.videoId}`)
      return chat
    } catch (error) {
      console.error('Error creating chat:', error)
      throw error
    }
  }

  async getVideoChats(videoId: string, limit: number = 20) {
    try {
      return await prisma.chat.findMany({
        where: { videoId },
        include: {
          user: true,
          video: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit
      })
    } catch (error) {
      console.error('Error finding video chats:', error)
      throw error
    }
  }

  async getUserChats(userId: string, limit: number = 50) {
    try {
      return await prisma.chat.findMany({
        where: { userId },
        include: {
          video: true,
          user: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit
      })
    } catch (error) {
      console.error('Error finding user chats:', error)
      throw error
    }
  }

  /**
   * Cleanup old data
   */
  async cleanupExpiredSessions() {
    try {
      const result = await prisma.session.deleteMany({
        where: {
          expiresAt: {
            lt: new Date()
          }
        }
      })
      console.log(`🧹 Cleaned up ${result.count} expired sessions`)
      return result.count
    } catch (error) {
      console.error('Error cleaning up expired sessions:', error)
      throw error
    }
  }

  async getStats() {
    try {
      const [userCount, videoCount, chatCount, sessionCount] = await Promise.all([
        prisma.user.count(),
        prisma.video.count(),
        prisma.chat.count(),
        prisma.session.count()
      ])

      return {
        users: userCount,
        videos: videoCount,
        chats: chatCount,
        sessions: sessionCount
      }
    } catch (error) {
      console.error('Error getting stats:', error)
      throw error
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService()

// Cleanup expired sessions every hour
setInterval(() => {
  databaseService.cleanupExpiredSessions()
}, 60 * 60 * 1000)
