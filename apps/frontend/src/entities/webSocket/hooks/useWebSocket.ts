import { useEffect } from "react"
import queueWebSocket from "../instances/queue";

export const useWebSocket = (eventToAdd: (ev: MessageEvent) => void) => {

  useEffect(() => {
    queueWebSocket.addEventListener("message", (event) => {
      eventToAdd(event)
    })
    
    return () => {
      queueWebSocket.close();      
    }
  }, [])
}