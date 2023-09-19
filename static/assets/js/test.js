

console.log("hello, world")
let chatName = 'asd'

console.log(chatName)



function formatTimeDifference(timeDifference) {
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
}

const now = new Date()
const old = new Date("2023-09-19T18:50:00.123456+10:00")

console.log(now-old)
console.log(formatTimeDifference(now-old))

window.created_at = data.created_at