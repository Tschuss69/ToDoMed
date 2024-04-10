import { Suspense } from 'react'
import IframeVideo from "@/components/general/video/IframeVideo";
import VideoSkeleton from "@/components/general/video/VideoSkeleton";

export default function VideoComponent(url) {
    return (
            <Suspense fallback={<VideoSkeleton />}>
                <IframeVideo url={url}/>
            </Suspense>
    )
}
