console.log('Iframe Drag');
const msgPost = 'ACABOU';

AFRAME.registerComponent('teste', {
    schema: {},

    init: function () {
        // VARIVAIES
        this.moto = document.querySelector('[click-drag]');
        this.seta = document.querySelector('#seta');
        this.mao = document.querySelector('#mao');
        this.elText = document.querySelector('.text');

        this.estrelas = document.querySelectorAll('.stars');
        this.lines2 = document.querySelectorAll('.line2');
        this.lines3 = document.querySelectorAll('.line3');
        // console.log(this.lines2.length);

        this.limites = [
            { minX: -4, maxX: -3.2, minY: 6.4, maxY: 7.2 },
            { minX: 0.9, maxX: 1.73, minY: 5.6, maxY: 6.4 },
            { minX: -0.16, maxX: 0.64, minY: 3.06, maxY: 3.86 },
            { minX: 3.5, maxX: 4.32, minY: 1.69, maxY: 2.49 },
            { minX: -1.72, maxX: -0.92, minY: -1.44, maxY: 0.64 },
        ];
        
        this.estrelaAlvo = 0;
        this.endGame = false;

        
        // const a = new THREE.Vector3( -1.29, -1.24, -8.1 );
        // Posiciona a sete na mesma posição da moto
        this.seta.object3D.position.set(-1.29, -1.24, -8.1);

        //Oculta texto ao arrastar moto
        this.moto.addEventListener('dragmove', ()=> {
            this.elText.classList.add('ocultar');
            this.mao.setAttribute('animation', 'property: material.opacity; to: 0; dur: 700; easing: linear; loop: false');
        });        

        // START
        this.ativaAlvo(this.estrelaAlvo);
    },
    ativaAlvo: function (alvo) {
        this.lines2[alvo].setAttribute("visible", "true");
        this.estrelas[alvo].setAttribute("animation", "property: scale; to: 1.5 1.5 1; dir: alternate; dur: 800; easing: easeInOutQuad; loop: true");
    },
    update: function () {},
    tick: function () {
        let motoX = this.moto.object3D.getWorldPosition().x;    
        let motoY = this.moto.object3D.getWorldPosition().y;   

        // this.seta.object3D.rotation.z = Math.PI / 2;
        // Move a seta junto com a moto
        this.seta.object3D.position.set(motoX, motoY, -8.1);
         
        if(!this.endGame) {
            if((motoX > this.limites[this.estrelaAlvo].minX && motoX < this.limites[this.estrelaAlvo].maxX) && (motoY > this.limites[this.estrelaAlvo].minY && motoY < this.limites[this.estrelaAlvo].maxY)) {
                console.log('colidiu estrela', this.estrelaAlvo);
                this.colidiuAlvo(this.estrelaAlvo);
            }
        }        
    },
    colidiuAlvo: function (alvo) {
        this.lines3[alvo].setAttribute("visible", "true");
        this.estrelas[alvo].setAttribute("opacity", "1");
        this.estrelas[alvo].removeAttribute("animation");
        this.estrelas[alvo].setAttribute("scale", "1 1 1");

        if(this.estrelaAlvo == 4) {
            this.endGame = true;

            // dispara msg para o window que o jogo acabou:
            window.parent.postMessage(msgPost, '*');
            console.log('FIM DE JOGO');
        }

        if(this.estrelaAlvo < 4) {
            this.estrelaAlvo++;
            this.ativaAlvo(this.estrelaAlvo)
        }
    },
    remove: function () {},
    pause: function () {},
    play: function () {}
});