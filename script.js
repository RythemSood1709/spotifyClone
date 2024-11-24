console.log("JS");

let currentSong=new Audio();
let songs;


function formatTime(seconds) {
    if(isNaN(seconds) || seconds<0){
        return "00:00"
    }
    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Format minutes and seconds to be two digits
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Combine and return the result
    return `${formattedMinutes}:${formattedSeconds}`;
}


// returns songs
async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/Assets/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("Assets/songs/")[1])
        }
    }

    return songs;
}

const playMusic= (track)=> {
    // let audio=new Audio("/songs/"+track)
    currentSong.src=`Assets/songs/${track}`;
    currentSong.play()
    play.src="Assets/svg/pause.svg";
    document.querySelector(".songInfo").innerHTML=track.replaceAll("%20"," ").replace(".mp3","");
    document.querySelector(".songTime").innerHTML="00:00 / 00:00"
}

async function main() {

    //get list of all songs
    songs = await getSongs();

    //show all the songs in playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                        <img class="invert" src="Assets/svg/music.svg" alt="">
                        <div class="info">
                            <div>${song.replaceAll("%20", " ").replace(".mp3", "")}</div>
                            <div>Song Artist</div>
                        </div>
                        <div class="playNow">
                        <span>Play Now</span>
                        <img class="invert" src="Assets/svg/play.svg" alt="">
                        </div> </li>`;
    }

    //attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e, index) => {
        e.addEventListener("click", () => {
            // Pass the exact song name from the `songs` array
            playMusic(songs[index]);
        });
    });

    //attach an event listener to play, next and previous
    play.addEventListener("click", ()=> {
        if(currentSong.paused){
            currentSong.play()
            play.src= "Assets/svg/pause.svg"
        }
        else{
            currentSong.pause()
            play.src="Assets/svg/play.svg"
        }
    })

    //listen for timeupdate event
    currentSong.addEventListener("timeupdate",()=> {
        document.querySelector(".songTime").innerHTML=`${
            formatTime(currentSong.currentTime)}/${formatTime(
                currentSong.duration)}`

        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%"
    })


    //seekbar seek
    document.querySelector(".seekbar").addEventListener("click",e=> {
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100

        document.querySelector(".circle").style.left=percent+"%";
        currentSong.currentTime=((currentSong.duration)*percent)/100;
    })

    //hamburger event
    document.querySelector(".hamburger").addEventListener("click",()=> {
        document.querySelector(".left").style.left="0";
        document.querySelector(".hamburger").style.display="none";
    })

    //close event 
    document.querySelector(".close").addEventListener("click",()=> {
        document.querySelector(".left").style.left="-120%";
        document.querySelector(".hamburger").style.display="inline";
    })

    //prev and next
    document.querySelector("#previous").addEventListener("click",()=> {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index-1)>=0){
            playMusic(songs[index-1])
        }
    })

    document.querySelector("#next").addEventListener("click",()=> {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index+1)<songs.length){
            playMusic(songs[index+1])
        }
    })
     
}

main()    