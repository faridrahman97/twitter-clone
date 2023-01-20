import { tweetsData } from './data.js'
import { v4 as uuidv4} from 'https://jspm.dev/uuid'

// tweetBtn.addEventListener('click', function(){
//     console.log(tweetInput.value)
// })

document.addEventListener('click', function(e){
    if (e.target.dataset.like){
        handleLikeClick(e.target.dataset.like)
    } else if (e.target.dataset.retweet){
        handleLikeRetweet(e.target.dataset.retweet)
    } else if (e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    } else if (e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
})

function handleLikeClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if (targetTweetObj.isLiked) {
        targetTweetObj.likes -= 1
    } else {
        targetTweetObj.likes += 1
    }


    targetTweetObj.isLiked = !targetTweetObj.isLiked
    renderFeed()
}

function handleLikeRetweet(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if (targetTweetObj.isRetweeted) {
        targetTweetObj.retweets -= 1
    } else {
        targetTweetObj.retweets += 1
    }


    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    renderFeed()
}


function handleReplyClick(replyId){
    document.querySelector(`#replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')
    if (tweetInput.value) {
        let newTweetObj = {
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4(),
        }

        tweetsData.unshift(newTweetObj)
    }

    tweetInput.value = ''
    renderFeed()
}

function getFeedHtml(){
    let feedHtml = ``

    tweetsData.forEach(function(tweet){
        let heartClass = ''
        let retweetClass = ''
        if (tweet.isLiked) { heartClass = "liked"}
        else if (tweet.isRetweeted) { retweetClass = "retweeted" }

        let repliesHtml = ''

        if(tweet.replies.length > 0) {
            tweet.replies.forEach(function(reply){
                repliesHtml += 
                `<div class="tweet-reply">
                    <div class="tweet-inner">
                    <img src=${reply.profilePic} class="profile-pic">
                        <div>
                            <p class="handle">${reply.handle}</p>
                            <p class="tweet-text">${reply.tweetText}</p>
                        </div>
                    </div>
                </div>`
            })
        }

        feedHtml += 
        `<div class="tweet">
            <div class="tweet-inner">
                <img src="${tweet.profilePic}" class="profile-pic">
                <div>
                    <p class="handle">${tweet.handle}</p>
                    <p class="tweet-text">${tweet.tweetText}</p>
                    <div class="tweet-details">
                        <span class="tweet-detail">
                        <i class="fa-solid fa-comment-dots"
                        data-reply=${tweet.uuid}></i>
                            ${tweet.replies.length}
                        </span>
                        <span class="tweet-detail">
                        <i class="fa-solid fa-heart ${heartClass}" 
                        data-like=${tweet.uuid}></i>
                            ${tweet.likes}
                        </span>
                        <span class="tweet-detail">
                        <i class="fa-solid fa-retweet ${retweetClass}" 
                        data-retweet=${tweet.uuid}></i>
                            ${tweet.retweets}
                        </span>
                    </div>   
                </div>            
            </div>
            <div class="hidden" id="replies-${tweet.uuid}">
                ${repliesHtml}
            </div>   
        </div>`
    })

    return feedHtml
}

function renderFeed(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}



renderFeed()

