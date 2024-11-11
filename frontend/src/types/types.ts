// types.ts
export type User = {
  username: string
  password: string
}

export type Message = {
  recipient: string
  message: string
}

export type JsonInput = User & Message
