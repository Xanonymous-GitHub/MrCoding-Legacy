import {getHistory} from "@/api/api";
import appStore from "@/store/app";
import {Message, ResponseError} from "@/api/types/apiTypes";
import scrollPositionMaintainer, {ScrollPositionMaintainer} from "@/utils/scrollPositionMaintainer";

export default async function (queryAmount: number, scrollWrapperSelector?: string): Promise<boolean> {
  const currentChatRoomId = appStore.getCurrentChatRoomId
  const lastQueriedMessageCreatedTime = appStore.getLastQueriedMessageCreatedTime
  if (!appStore.isLoggedIn) {
    throw ''
  }
  let messages = await getHistory(currentChatRoomId, lastQueriedMessageCreatedTime, queryAmount, appStore.getJwtKey as string) as unknown as (Array<Message> | ResponseError)
  if ('statusCode' in messages) {
    throw 'fail to load history!'
  }
  messages = messages as Array<Message>
  const amountOfMessages = messages.length
  let newLastQueriedMessageCreatedTime = lastQueriedMessageCreatedTime
  let result = false
  if (amountOfMessages) {
    newLastQueriedMessageCreatedTime = ((messages[amountOfMessages - 1].createdAt as number) - 1)
    let maintainer!: ScrollPositionMaintainer
    if (scrollWrapperSelector != null) {
      maintainer = new scrollPositionMaintainer(document.querySelector(scrollWrapperSelector) as HTMLDivElement)
      maintainer.prepare()
    }
    for (const newMsg of messages.slice(0, amountOfMessages - 1)) {
      await appStore.createMsg({newMsg, insertAtTop: true})
    }
    const newMsg = messages[amountOfMessages - 1]
    newMsg.observer = true
    await appStore.createMsg({newMsg, insertAtTop: true})
    await maintainer.restore()
    result = true
  }
  appStore.SET_LAST_QUERIED_MESSAGE_CREATED_TIME(newLastQueriedMessageCreatedTime)
  return result
}
