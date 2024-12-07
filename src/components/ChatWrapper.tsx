"use client"

import { useChat } from "ai/react";

const ChatWrapper = ({sessionId} : {sessionId: string}) => {

    const { messages, handleInputChange, handleSubmit, input } = useChat({
        api: "/api/chat-stream",
        body: {sessionId}
    })

    return (
        <div className="relative min-h-full bg-zinc-900 divide-zinc-700 flex-col justify-between gap-2">
            <div className="flex-1 text-black bg-zinc-800 justify-between flex flex-col">
                {JSON.stringify(messages)}
            </div>
            
            //vercel ai will take care of the states 
            <form onSubmit={handleSubmit}>
                <input onChange={handleInputChange} type="text" value={input}/>

            </form>
        </div>
    );
};

export default ChatWrapper;