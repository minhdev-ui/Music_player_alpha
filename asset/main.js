/**
 * Render Song --> OK
 * Scroll Top --> OK
 * Play/ pause/ seek --> OK
 * CD rotate --> OK
 * Next/prev --> OK
 * Random --> OK
 * Next / Repeat when ended --> OK
 * Active song --> OK
 * Scroll active song into view --> OK
 * Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $('.cd-img > img');
const cdThumb = $('.cd-img')
const headings = $('.heading h4')
const dashboards = $('.dashboard')
const volume = $('.volume')
const audio = $('#audio')
const toggleBtn = $('.btn-toggle')
const playBtn = $('.btn-play')
const pauseBtn = $('.btn-pause')
const btnIcon = $$('.btn');
const progressPlaying = $('.progress');
const forwardBtn = $('.btn-forward');
const backwardBtn = $('.btn-backward');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.list-music');
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    song: [
        {
            name: 'That Time I Got Reincarnated As A Slime',
            author: 'Reimei',
            image: './asset/img/download (1).jfif',
            path: 'asset/music/that-time-i-got-reincarnated-as-a-slime-reimei-true-li-ming-true.mp3'
        },
        {
            name: 'Glorius Morning',
            author: 'Waterflame',
            image: './asset/img/hqdefault.jpg',
            path: 'asset/music/glorious-morning.mp3'
        },
        {
            name: 'Unstoppable',
            author: 'Sia',
            image: './asset/img/hqdefault (1).jpg',
            path: 'asset/music/unstoppable-lyrics.mp3'
        },
        {
            name: 'Sweet Home OST',
            author: 'YongZoo (용주)',
            image: './asset/img/hqdefault (2).jpg',
            path: 'asset/music/sweet-home-sweet-home-ost-seuwiteuhom-mv.mp3'
        },
        {
            name: 'Warrior (League of Legends)',
            author: 'Imagine Dragons',
            image: './asset/img/warrior-thumb.jpg',
            path: 'asset/music/league-of-legends.mp3'
        },
        {
            name: 'Imitation',
            author: 'Shuriken 255',
            image: './asset/img/hqdefault (3).jpg',
            path: 'asset/music/imitation-rumblestep.mp3'
        },
        {
            name: 'Racing into the night',
            author: 'YOASOBI',
            image: './asset/img/hqdefault (4).jpg',
            path: 'asset/music/racing-into-the-night-lyrics-jpn_rom_eng.mp3'
        },
        {
            name: 'Funny',
            author: 'Zedd & Jasmine Thompson',
            image: './asset/img/hqdefault (5).jpg',
            path: 'asset/music/funny-lyric-video.mp3'
        }
    ],
    render: function() {
        const html = this.song.map((song, index) =>{
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = ${index}>
            <div class="song-detail">
            <div class="thumb cd-img">
            <img src="${song.image}" style="width:50px; height:50px; border-radius:50%;">
            </div>
            <div class="name-song">
            <h4>${song.name}</h4>
            <p>${song.author}</p>
            </div>
                </div>
                <div class="option">
                <i class="option-icon fas fa-ellipsis-h"></i>
                </div>
                </div>
                `
            })
            playlist.innerHTML = html.join('');
        },
        defineProperties: function() {
            Object.defineProperty(this, 'getCurrentSong', {
                get: function() {
                    return this.song[this.currentIndex];
                }
            })
        },
        handleEvents: function() {
            const cdThumb = $('.cd-img')
            const pauseBtn = $('.btn-pause')
            var cd = $('.cd-img > img');
            const cdWidth = cd.offsetWidth;
            // Thu nhỏ đĩa nhạc khi kéo
            document.onscroll = function(){
                const newCdWidth = cdWidth - window.scrollY;
                cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
                cd.style.height = newCdWidth > 0 ? newCdWidth + 'px' : 0;
                cd.style.opacity = newCdWidth / cdWidth; 
            }
            // Xử lý đĩa quay / dừng
            const cdAnimation = cdThumb.animate([
                { transform: 'rotate(360deg)' }
            ], {
                duration: 10000, // set 10 secs
            iterations:Infinity
        })
        cdAnimation.pause();
        // xử lý chạy nhạc
        toggleBtn.onclick = function() {
            if(app.isPlaying){
                audio.pause();
            }else{
                audio.play();
            }
            // xử lý các nút play/pause
            audio.onplay = function () {
                app.isPlaying = true;
                toggleBtn.classList.add('playing');
                cdAnimation.play();
            }
            audio.onpause = function () {
                app.isPlaying = false;
                toggleBtn.classList.remove('playing');
                cdAnimation.pause();
            }
            // xử lý tiến độ của bài hát
            audio.ontimeupdate = function () {
                const time = audio.currentTime / audio.duration * 100;
                const progressPlaying = $('.progress');
                progressPlaying.value = time;
            }
            progressPlaying.onchange = function(e){
                progressPlaying.value = e.target.value;
                audio.currentTime = e.target.value / 100 * audio.duration ;
            }
        }

        // Chuyển qua bài tiếp theo khi kết thúc bài hát
        audio.onended = function(){
            app.nextForward();
            audio.play();
        }

        // Xử lý các nút next / prev
        forwardBtn.onclick = function () {
            if(app.isRandom){
                app.playRandom();
                audio.play();
            }else{
                app.nextForward();
                audio.play();
                toggleBtn.classList.add('playing');
                forwardBtn.classList.add("active");
                setInterval(function(){
                    forwardBtn.classList.remove("active")
                }, 300);
            }
        }

        backwardBtn.onclick = function () {
            app.backWard();
            audio.play();
            toggleBtn.classList.add('playing');
            backwardBtn.classList.add("active");
            setInterval(function(){
                backwardBtn.classList.remove("active")
            }, 300);
        }

        // xử lý bật / tắt random
        randomBtn.onclick = function () {
            app.isRandom = !app.isRandom;
            randomBtn.classList.toggle("active", app.isRandom);
        }

        // Xử lý khi repeat bài hát
        repeatBtn.onclick = function () {
            app.isRepeat = !app.isRepeat;
            repeatBtn.classList.toggle("active");
            if(app.isRepeat){
                audio.loop = true;
            }else{
                audio.loop = false;
            }
        }
        // xử lý click để chuyển bài hát
        playlist.onclick = (e) => {
            const songActive = e.target.closest('.song:not(.active)');
            const songOptions = e.target.closest('.option');
            if(songActive || songOptions){
                if(songActive){
                    app.currentIndex = Number(songActive.dataset.index);
                    app.loadCurrentSong();
                    app.render();
                    audio.play();
                    audio.onplay = function () {
                        app.isPlaying = true;
                        toggleBtn.classList.add('playing');
                        cdAnimation.play();
                    }
                    audio.ontimeupdate = function () {
                        const time = audio.currentTime / audio.duration * 100;
                        const progressPlaying = $('.progress');
                        progressPlaying.value = time;
                    }
                    progressPlaying.onchange = function(e){
                        progressPlaying.value = e.target.value;
                        audio.currentTime = e.target.value / 100 * audio.duration ;
                    }
                }
                if(songOptions){

                }
            }
        }
    },
    loadCurrentSong: function(song) {
        const cd = $('.cd-img > img');
        headings.textContent = this.getCurrentSong.name;
        cd.src = this.getCurrentSong.image;
        audio.src = this.getCurrentSong.path;
    },
    scrollIntoView: () => {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            }, 300);
        })
    },
    nextForward: function() {
        this.currentIndex++
        if(this.currentIndex >= this.song.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
        this.render();
        this.scrollIntoView();
    },
    backWard: function() {
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.song.length - 1;
        }
        this.loadCurrentSong();
        this.render();
    },
    playRandom: function() {
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.song.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
        this.render();
    },
    start: function(){
        this.defineProperties();
        this.loadCurrentSong();
        this.render();
        this.handleEvents();
    }
}

app.start();