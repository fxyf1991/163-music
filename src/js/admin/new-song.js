{
    let view = {
        el: '.newSong',
        template:`
                <span>
                    <svg id='plus' class="icon" aria-hidden="true">
                        <use xlink:href="#icon-plus"></use>
                    </svg>
                    新建歌曲
                </span>
        `,
        render(data){
            $(this.el).html(this.template)
        }
    }
    let model = {}
    let controller = {
        init(view, model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.active()
            window.eventHub.on('new', (data)=>{
                this.active()
            })
            window.eventHub.on('select', (data)=>{
                this.deActive()
            })
            $(this.view.el).on('click', ()=>{
                window.eventHub.emit('new')
                $('.uploadArea').show()
                $('main').removeClass('active')
            })
        },
        active(){
            $(this.view.el).addClass('active')
        },
        deActive(){
            $(this.view.el).removeClass('active')
        }
    }
    controller.init(view, model)
}