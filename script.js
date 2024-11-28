let currentSong = new Audio();
let songs;
let currFolder;

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
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
async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${currFolder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${currFolder}/`)[1]);
        }
    }

    // Update the playlist display
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML += `<li>
                        <img class="invert" src="svg/music.svg" alt="">
                        <div class="info">
                            <div>${song.replaceAll("%20", " ").replace(".mp3", "")}</div>
                            <div>Song Artist</div>
                        </div>
                        <div class="playNow">
                        <span>Play Now</span>
                        <img class="invert" src="svg/play.svg" alt="">
                        </div> </li>`;
    }

    // Attach event listeners for each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e, index) => {
        e.addEventListener("click", () => {
            playMusic(songs[index]);
        });
    });

    return songs; // Explicitly return the array
}


const playMusic = (track) => {
    // let audio=new Audio("/songs/"+track)
    currentSong.src = `${currFolder}/${track}`;
    currentSong.play()
    play.src = "svg/pause.svg";
    document.querySelector(".songInfo").innerHTML = track.replaceAll("%20", " ").replace(".mp3", "");
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00"

}

async function displayAlbums() {
    let a = await fetch(`/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer");
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        

        if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").filter(Boolean).slice(-1)[0];


            //get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`);
            let response = await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML + `
            <div data-folder="${folder}" class="card">
                <div class="check">
                    <div class="playCircle">
                        <svg width="24" height="24" viewBox="0 0 28 28" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <!-- Play icon (black) scaled up -->
                            <path d="M7 22V6L22 14L6 22Z" fill="black" />
                        </svg>
                    </div>
                </div>

                <img src="songs/${folder}/cover.jpeg" alt="Happy">
                <h2>${response.title}</h2>
                <p>${response.description}</p>
            </div>`
        }
    }

    //load playlist when card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
        })
    })
}

async function main() {

    //get list of all songs
    await getSongs("songs/KaranAujla");

    //display all the albums
    displayAlbums()




    //attach an event listener to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "svg/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "svg/play2.svg"
        }
    })

    //listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songTime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(
            currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })


    //seekbar seek
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100

        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })

    //hamburger event
    document.querySelector('.hamburger').addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
        document.querySelector(".hamburger").style.display = "none";
    })

    //close event 
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
        document.querySelector(".hamburger").style.display = "inline";
    })

    //prev and next
    document.querySelector("#previous").addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    document.querySelector("#next").addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    //to set volume
    document.querySelector('.range').addEventListener('change', (e) => {
        currentSong.volume = parseInt(e.target.value) / 100
    })

    //mute button 
    document.querySelector(".volumeimg").addEventListener('click',e=> {
        if(e.target.src.endsWith("volume.svg")){
            e.target.src=e.target.src.replace("volume.svg","mute.svg");
            currentSong.volume=0;
            document.querySelector('.range').getElementsByTagName("input")[0].value=0;
        }
        else{
            e.target.src=e.target.src.replace("mute.svg","volume.svg");
            currentSong.volume=0.1;
            document.querySelector('.range').getElementsByTagName("input")[0].value=10;
        }
    })
}

main()    