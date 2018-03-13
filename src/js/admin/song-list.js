{
    let view = {
        el: '#songList-container',
        template: `
            <ul class="songList">
            
            </ul>
        `,
        render(data) {
            $(this.el).html(this.template)
            let {songs, selectSongId} = data
            let liList = songs.map((song)=> {
                let $li = $('<li></li>').attr('data-song-id',song.id)
                let $songWrapper = $('<div class="songWrapper"></div>')
                let $songName = $('<div class="songName"></div>').text(song.name)
                let $singer = $('<span class="singer"></span>').text(song.singer)
                if(song.id === selectSongId){
                    $li.addClass('active')
                }
                let svgMan = `<svg id='svgMan' class="icon svgMan" aria-hidden="true">
    <use xlink:href="#icon-man3"></use>
</svg>`
                let svgMusic = `<svg id='svgMusic' class="icon svgMusic" aria-hidden="true">
    <use xlink:href="#icon-music"></use>
</svg>`
                $li.append(svgMusic,$songWrapper.append($songName,svgMan,$singer))
                console.log($li[0])
                return $li
            })
            let $el = $(this.el)
            $el.find('ul').empty()
            liList.map((domLi)=>{
                $el.find('ul').append(domLi)
            })
        },
        clearActive() {
            $(this.el).find('.active').removeClass('active')
        }
    }
    let model = {
        data: {
            songs: [],
            selectSongId:undefined
        },
        find(){
            var query = new AV.Query('Song')
            return query.find().then((songs)=>{
                this.data.songs = songs.map((song)=>{
                    return {id: song.id, ...song.attributes}
                })
                return songs
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            this.bindEventHub()
            this.getAllSongs()
        },
        getAllSongs(){
            return this.model.find().then(()=>{
                this.view.render(this.model.data)
            })
        },
        bindEvents(){
            $(this.view.el).on('click', 'li', (e)=>{
                $('.uploadArea').hide()
                $('main').addClass('active')
                let songId = e.currentTarget.getAttribute('data-song-id')
                this.model.data.selectSongId = songId
                this.view.render(this.model.data)
                let data
                let songs = this.model.data.songs
                for (let i = 0; i < songs.length; i++){
                    if (songs[i].id === songId){
                        data = songs[i]
                        break
                    }
                }
                window.eventHub.emit('select', JSON.parse(JSON.stringify(data))) //深拷贝
            })
        },
        bindEventHub(){
            window.eventHub.on('create', (songData) => {
                this.model.data.songs.push(songData)
                this.view.render(this.model.data)
            })
            window.eventHub.on('new', ()=>{
                this.view.clearActive()
            })
            window.eventHub.on('update', (song)=>{
                let songs = this.model.data.songs
                for (let i=0; i<songs.length;i++){
                    if (songs[i].id === song.id){
                        Object.assign(songs[i],song)
                    }
                }
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view, model)
}