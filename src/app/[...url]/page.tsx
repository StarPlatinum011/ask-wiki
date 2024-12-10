import ChatWrapper from "@/components/ChatWrapper";
import { ragChat } from "@/lib/rag-chat";
import { redis } from "@/lib/redis";
import { cookies } from "next/headers";

interface PageProps {
    params: {
        url: string | string [] | undefined
    }
}

function reconstructUrl({url}: {url:string[]}) {

    const decodedComponents = url.map((component) => decodeURIComponent(component));

    return decodedComponents.join('/');
}

const Page = async ({params} : PageProps) => {
    
    const sessionCookie = (await cookies()).get("sessionId")?.value;
    //params is an async prop so await
    const {url} = await params;
    if(!url) throw new Error("Param not here")
    const urlArray = Array.isArray(url) ? url : [url]; //make sure the url is an array

    const reconstructedUrl =  reconstructUrl({url: urlArray})


    const sessionId = (reconstructUrl + "--" + sessionCookie).replace(/\//g,"");
    const isAlreadyIndexed =  await redis.sismember("indexed-urls", reconstructedUrl);

    const initialMessage = await ragChat.history.getMessages({amount:10, sessionId});

    
    if(!isAlreadyIndexed) {
        await ragChat.context.add({
            type: 'html',
            source:reconstructedUrl,
            config: { chunkOverlap: 50, chunkSize: 200 }
        });
    }

    await redis.sadd("indexed-urls", reconstructedUrl);

    
    
    return <ChatWrapper sessionId = {sessionId} initialMessages={initialMessage} />
}

export default Page; 