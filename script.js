console.log("JS");

let currentSong=new Audio();
// returns songs
async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/Assets/songs/")
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }

    return songs;
}

const playMusic= (track)=> {
    // let audio=new Audio("/songs/"+track)
    currentSong.src="Assets/songs/"+track
    currentSong.play()
}

async function main() {

    //get list of all songs
    let songs = await getSongs();

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
}



main()    