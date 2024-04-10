export default async function IframeVideo(url) {
    const src = 'https://www.youtube.com/watch?v=YnA9NwB4IDE'

    return <div><iframe src={url ? url : src} frameborder="0" allowfullscreen /></div>
}
