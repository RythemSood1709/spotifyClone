console.log("JS");


// returns songs
async function getSongs(){
    let a=await fetch("http://127.0.0.1:5500/songs/")
    let response= await a.text();
    let div =document.createElement("div");
    div.innerHTML=response;
    let as=div.getElementsByTagName("a")
    let songs=[]

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
    }

    return songs;
}

async function main(){
    //get list of all songs
    let songs=await getSongs();
    console.log(songs);

    let songUL=document.querySelector(".songList").getElementsByTagName("ul")[0]
    for(const song of songs){
        songUL.innerHTML=songUL.innerHTML+`<li>
                        <img class="invert" src="svg/music.svg" alt="">
                        <div class="info">
                            <div>${song.replaceAll("%20"," ").replace(".mp3","")}</div>
                            <div>Song Artist</div>
                        </div>
                        <div class="playNow">
                        <span>Play Now</span>
                        <img class="invert" src="svg/play.svg" alt="">
                        </div>
                        </li>`
    }

    //play first song
    var audio=new Audio(songs[1]);
    audio.play();  

    audio.addEventListener("loadeddata",()=> {
        console.log(audio.duration,audio.currentSrc,audio.currentTime);
    })   
}        
 
main()    