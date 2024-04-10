import React, {useEffect, useRef, useState} from 'react';



export function LocalVideo(props) {

    const videoRef = useRef(null);
    const [watchedPercentage, setWatchedPercentage] = useState(0);


    useEffect(() => {
        console.log(watchedPercentage)
        const video = videoRef.current;
        console.log(video)
        //const percentage = (video.currentTime / video.duration) * 100;
       // setWatchedPercentage(percentage);
    }, )

    function handleVideoEnd() {
// Your code to be executed when the video ends
        console.log('Video ended!');

    }

    function handleTimeUpdate(e){
        const video = videoRef;
        if(e && e.target && e.target.currentTime && e.target.duration){
            const percentage = (e.target.currentTime / e.target.duration) * 100;
            console.log('percentage')
            console.log(percentage)
        }
    }




    return (
        <div>
        <video  onTimeUpdate={(e) => handleTimeUpdate(e)} onEnded={handleVideoEnd} width={props.width ? props.width : null} height={props.height ? props.height : null} controls preload={props.preload ? props.preload : 'auto'}>
            <source src={props.url} type="video/mp4" />
            Votre navigateur ne supporte pas la video, veuillez utiliser le navigateur chrome.
        </video>
        </div>
    )
}
