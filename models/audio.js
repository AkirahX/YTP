const yts = require('yt-search')
const fs = require('fs')
const ytdl = require("discord-ytdl-core");
const keys = require('../apikey.json')
const Delete = require('../lib/deleteFile')

class Audio {
    audio(url, host, protocol, apiKey, res){
        const search = async (s) => {
            const r = await yts(s)
            const videos = r.videos.slice(0, 1)
            let v = videos[0]

            let result = {
                type: v.type,
                videoId: v.videoId,
                url: v.url,
                title: v.title,
                description: v.description,
                image: v.image,
                thumbnail: v.thumbnail,
                seconds: v.seconds,
                timestamp: v.timestamp,
                ago: v.ago,
                views: v.views,
            }
            return result
        }
        const save = async () => {
            try{
                const videoId = url.includes('watch') ? url.substring(url.indexOf('=') + 1) : url.substring(url.indexOf('be') + 2);
                //const data = await search(title)
                const path = './downloads/audios/' + videoId + '.mp3'
                let stream = ytdl(url, {
                    fmt: "mp3",
                    opusEncoded: false
                });
                stream.pipe(fs.createWriteStream(path))
                .on('finish', () => {
                    let response = {
                        git: 'https://github.com/AkirahX/Youtube-Rest-API',
                        download: host + '/download?fileId=' + videoId
                    }
                    res.status(200).json(response)
                    Delete.audio(path, 5)
                })
            } catch (err) {
                res.status(500).json(JSON.stringify(err))
            }
        }
        if(keys.key.includes(apiKey)){
            save()
        } else {
            let response = {
                status: 'error 400',
                error: 'Invalid apiKey'
            }
            res.status(400).json(response)
        }
    }
}

module.exports = new Audio