console.log('Arquivo components aframe!');

import { toast } from "react-toastify";
import Cookies from "js-cookie";

// Config JSON:
import config from '../../public/configApp.json';
const EXPIRE_COOKIES = config.expire_cookies;


// Eventos a ser disparados na aplicação:
const eventoPermissoesPermitidas = new CustomEvent('permissaoStatus', {
    detail: 'permissao-total'
});

const eventoPermissoesNegadas = new CustomEvent('permissaoStatus', {
    detail: 'negada'
});
const eventoLocalizacaoNegada = new CustomEvent('permissaoStatus', {
    detail: 'geo negada'
});
const eventoCameraNegada = new CustomEvent('permissaoStatus', {
    detail: 'permissao-minima'
});

const eventoStartGame = new Event('msgStartGame');
// const eventoFindStar = new Event('msgFindStar');


// Componentes A-frame customizados:
AFRAME.registerComponent('init-permissions', {
    schema: {
        // Onde vai os atributos, se necessario
    },

    init: function() {
        console.log('Init aframeComponents.js')
        // Editar modal de solicitação de permissões:
        // device-orientation-permission-ui="denyButtonText: Rejeitar; allowButtonText: Aceitar; deviceMotionMessage: Texto aqui"
        this.el.setAttribute('device-orientation-permission-ui', "allowButtonText: Entendi; deviceMotionMessage: Para seguir com a experiência é necessário permitir o acesso ao sensor de movimento, localização e câmera do dispositivo.");

        // this.el.addEventListener('deviceorientationpermissionrequested', ()=> alert('Para seguir com a experiência é necessario autorizar acesso ao movimento e câmera do celular.'));

        // Mensagem quando o acesso for negado:
        this.el.addEventListener('deviceorientationpermissionrejected', ()=> {
            document.dispatchEvent(eventoPermissoesNegadas);

            console.log('Status: Permissão de movimento foi negada. Para permitir o acesso, vá para as configurações do navegador e ative o acesso aos sensores.');

            alert('Status: Permissão de movimento foi negada. Para permitir o acesso, vá para as configurações do navegador e ative o acesso aos sensores.');
        });
        
        
        if(window.DeviceOrientationEvent && window.DeviceOrientationEvent.requestPermission) {
        // Para iOS 13+:
            Cookies.set('device99', 'iphone', { expires: EXPIRE_COOKIES });
            this.el.addEventListener('deviceorientationpermissiongranted', ()=> {
                // Verifica se as permissões de movimento foi consedido
                DeviceMotionEvent.requestPermission()
                .then(response => {
                    if(response === 'granted') {
                        // Permissão aceita
                        /////this.initCamera();
                        this.getLocation();
                    }
                    else {
                        // Permissão negada
                        // alert('Foi negado o acesso ao movimento/orientação do dispositivo. Para permitir o acesso, vá para as configurações do navegador e ative o acesso aos sensores.');
                        //Não seguir no jogo
                        //// document.dispatchEvent(eventoPermissoesNegadas);
                        console.log('Foi negado o acesso ao movimento/orientação do celular. Para permitir o acesso, vá para as configurações do navegador e ative o acesso aos sensores.');
                        alert('Foi negado o acesso ao movimento/orientação do celular. Para permitir o acesso, vá para as configurações do navegador e ative o acesso aos sensores.');
                    }
                })
                .catch(error => {
                    console.error('Erro ao solicitar a permissão:', error);
                });
            });
        }
        else {
        // Para dispositivos que não solicita permissão de deviceorientation:
            Cookies.set('device99', 'android', { expires: EXPIRE_COOKIES });
            /////this.initCamera();
            this.getLocation();
        }
    },
    
    getLocation: function() {
        console.log('Geolocalização');

        if("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position)=> {
                // const eventoGeolocazicao = new CustomEvent('geolocalizacao', {
                //     detail: {latitude: position.coords.latitude, longitude: position.coords.longitude}
                // });
                let geoLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }
                console.log(geoLocation);

                // Cookies.set('geoLocation99', JSON.stringify(geoLocation), { expires: EXPIRE_COOKIES });
                const eventoLocation = new CustomEvent('msgLocation', {
                    detail: geoLocation
                });
                document.dispatchEvent(eventoLocation);
                this.initCamera();
            }, 
            (error)=> {
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        document.dispatchEvent(eventoLocalizacaoNegada);
                        console.log('Status: Permissão de localização foi negada. Para permitir o acesso, vá para as configurações do navegador e ative o acesso aos sensores.');
                        alert('Status: Permissão de localização foi negada. Para permitir o acesso, vá para as configurações do navegador e ative o acesso aos sensores.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        toast.error("Informação de localização indisponível.");
                        break;
                    case error.TIMEOUT:
                        toast.error("A requisição de localização expirou.");
                        break;
                    case error.UNKNOWN_ERROR:
                        toast.error("Ocorreu um erro desconhecido.");
                        break;
                }
            }, 
            {
                timeout: 10000 // Tempo limite de 10 segundos
            }, this);
        } else {
            document.dispatchEvent(eventoLocalizacaoNegada);
            toast.error("Geolocalização não é suportada pelo navegador.");
        }
    },

    initCamera: function() {
        console.log('Camera');

        const videoRef = document.getElementById('videoRef');
        const videoConstraints = {
            width: { min: 1440, ideal: 1920, max: 1920 },
            height: { min: 960, ideal: 1080, max: 1080 },
            aspectRatio: 16 / 9,
            facingMode: "environment"
        };
        
        // Verifica se o navegador suporta getUserMedia
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: videoConstraints })
                .then(stream => {
                    videoRef.srcObject = stream;
                    videoRef.play();
                    document.dispatchEvent(eventoPermissoesPermitidas);
                })
                .catch(error => {
                    console.error('Erro ao acessar a câmera: ', error);
                    // Exibir uma mensagem amigável para o usuário
                    document.dispatchEvent(eventoCameraNegada);
                    toast.info('Não foi possível acessar a câmera.');
                });
        } 
        else {
            console.error('getUserMedia não é suportado no navegador.');
        }
    }
});

AFRAME.registerComponent('set-stars', {
    schema: {
        // Onde vai os atributos, se necessario
    },

    init: function() {
        this.miraMoto = document.getElementById('mira-moto');
        this.setaMoto = document.getElementById('seta-moto');
        this.camera = document.getElementById('camera-target');
        var coordenadas = [
            {
                estrela1: { x: 31.34, y: 25.02, z: -11.58 },
                estrela2: { x: 24.070, y: 34.85, z: 11.36 },
                estrela3: { x: 10.48, y: 40.51, z: -8.327 },
                estrela4: { x: -12.27, y: 42.94, z: -15.55 },
                estrela5: { x: -24.17, y: 42.70, z: 7.30 }
            }
        ];
        // Escolher uma coordenada ativa aleatória
        var coordenadaAtiva = coordenadas[Math.floor(Math.random() * coordenadas.length)];

        // Seta as posições da Constelação e estrelas
        // this.el.object3D.position.set(coordenadaAtiva.constelacao.x, coordenadaAtiva.constelacao.y, coordenadaAtiva.constelacao.z);
        
        // Loop pela array this.estrelas
        this.estrelas = this.el.children;

        // for (let i = 0; i < this.estrelas.length; i++) {
        //     this.estrelas[i].object3D.position.set(coordenadaAtiva['estrela' + (i + 1)].x, coordenadaAtiva['estrela' + (i + 1)].y, coordenadaAtiva['estrela' + (i + 1)].z);

        //     this.estrelas[i].setAttribute('look-at', '#camera-target');
        //     this.estrelas[i].addEventListener('mouseenter', (e) => this.collisionStar(e));
        // }
        this.estrelas[0].object3D.position.set(coordenadaAtiva['estrela1'].x, coordenadaAtiva['estrela1'].y, coordenadaAtiva['estrela1'].z);

        this.estrelas[0].setAttribute('look-at', '#camera-target');
        this.estrelas[0].addEventListener('mouseenter', (e) => this.collisionStar(e));

        // Seta a estrela alvo do momento
        this.targetStar = 0;
        this.activeStar(this.targetStar);
    },

    tick: function (time, timeDelta) {
        // Controla seta guia estrelar
        // let local = this.estrelas[this.targetStar].object3D.getWorldPosition();
        let local = this.estrelas[this.targetStar].object3D.position.clone();
        // console.log(local);
        this.camera.object3D.worldToLocal(local);

        let angleDeg = Math.atan2(-local.y - 0, local.x - 0) * 180 / Math.PI + 180;
        angleDeg -= 90;
        
        this.setaMoto.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg)`;
    },

    activeStar: function (numStar) {
        this.targetStar = numStar;
        this.estrelas[numStar].setAttribute('opacity', 1);
        this.estrelas[numStar].setAttribute('animation', 'property: scale; to: 2 2 1; dir: alternate; dur: 1000; easing: easeInOutQuad; loop: true');
    },

    collisionStar: function (e) {
        console.log(e.target.id);
        console.log(this.estrelas[this.targetStar].id);

        console.log('ABRE IFRAME');

        // if(e.target.id == this.estrelas[this.targetStar].id && this.targetStar < 4) {
        //     this.miraMoto.classList.add("animate-brilho");
        //     this.estrelas[this.targetStar].removeAttribute('animation');
        //     this.targetStar++;
        //     this.activeStar(this.targetStar);
        //     setTimeout(()=> this.miraMoto.classList.remove("animate-brilho"), 800);
        // }
        // if(e.target.id == 'star5' && this.estrelas[this.targetStar].id == 'star5') {
        //     // alert('fim de jogo');
        //     // document.dispatchEvent(eventoFimJogo);
        // }
    }
});

AFRAME.registerComponent('detect-start-game', {
    schema: { type: 'boolean' },

    init: function() {
        // console.log(this.data)
        this.el.addEventListener("mouseenter", ()=> this.initGame());  
        
        document.addEventListener("permissaoStatus", (e)=> {
            if(e.detail == 'permissao-minima' || e.detail == 'permissao-total') {
                setTimeout(()=> this.el.classList.add('collidable'), 3800);
            }
            //// else {
            //     setTimeout(()=> alert('Permissão de movimento e/ou localização do celular foi negada. Para seguir com a experiência é necessário ir nas configurações do navegador e ative o acesso.'), 8000);
            // }
        });
    },

    initGame: function() {
        if(this.data) {
            console.log('START GAME COM MOVIMENTO');
            document.dispatchEvent(eventoStartGame);

            ////
            this.el.setAttribute('detect-start-game', 'false');
        }
    },
});