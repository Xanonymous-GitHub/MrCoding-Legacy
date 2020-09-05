export type Response<T> = Promise<T | ResponseError>

export interface ResponseError {
  readonly statusCode?: number,
  readonly message?: string
}

export interface User {
  readonly _id: string, // line uuid or admin's mongo id.
}

export interface Admin extends User {
  username: string, // admins' self-set name, or the line uuid of general users
  avatar?: string, // user avatar url(at the first time)
  info?: string, // user profile
  readonly cc: boolean // show that if the user is verified by us(dev team)
}

export interface ChatRoom {
  readonly _id: string, // mongoose id, absolutely unique, is the route path at /:chatroom
  readonly owner?: string, // the hashed user's line uuid => hashed[(username])
  readonly identify: string, // generated from 'createChatRoom' in google script
  closed: boolean // show that if this room is closed or not.
  readonly lineAccessToken: string // the line accessToken from [owner]
}

export interface Message {
  readonly _id: string, // mongoose id, absolutely unique
  readonly author: string, // user's [_id]
  read: boolean, // show that if this is read by someone (the other user in same chatroom)
  context?: string, // text content of this msg, will change to contain not only texts but also medias
  chatroomID: string, // the chatroom's [_id](mongoose id, absolutely unique)
  updateAt: string, // the last time of edit or create
  readonly createAt?: string // deprecated unUseful parameter from server
}

export interface ReadMessage {
  readonly _id: string, // mongoose id, absolutely unique
}

export interface SentMessage {
  readonly context: string // the type of a message that will be sent.
}

export interface authResponse {
  readonly token: string
}

export interface MessageContainerType {
  [chatroomID: string]: Array<Message>
}

export enum themeModes {
  AUTO = 'AUTO',
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

// TODO: test if all 'readonly' is true of truth.
