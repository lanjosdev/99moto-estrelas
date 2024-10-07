// Hooks / Funcionalidades / Libs:
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_COORDINATES } from '../../API/userApi';
import Cookies from "js-cookie";

import 'aframe';
import 'aframe-look-at-component';

// Script A-frame customizados:
import '../../aframe/aframeComponents';

// Config JSON:
import config from '../../../public/configApp.json';

// Components:
import { AframeGame } from '../../components/AframeGame/AframeGame';
import confetti from 'canvas-confetti';
import { toast } from "react-toastify";

// Utils:
// import { primeiraPalavra } from '../../utils/formatarStrings';

// Assets:
import LogoHeader from '../../assets/logo-header.png';
import MaoInstrucao from '../../assets/mao-instrucao.png';
import ConstelacaoInstrucao from '../../assets/constelacao-instrucao.png';
import MotoStart from '../../assets/moto-start.png';

// Estilo:
import './style.css';


export default function Game() {
    const [statusPermissoes, setStatusPermissoes] = useState('');
    const [ativaAframe, setAtivaAframe] = useState(false);
    const [startGame, setStartGame] = useState(false);

    const [locationUser, setLocationUser] = useState(null);
    const [idUser, setIdUser] = useState(null);

    const navigate = useNavigate();

    const BASE_URL = config.base_url;
    // const EXPIRE_COOKIES = config.expire_cookies;
    const hasVoucher = Cookies.get('voucher99');

    

    const acaoFimJogo = useCallback(() => {
        //confetti
        var defaults = {
            spread: 360,
            ticks: 50,
            gravity: 0,
            decay: 0.94,
            startVelocity: 30,
            colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
        };
        
        function shoot() {
            confetti({
                ...defaults,
                particleCount: 40,
                scalar: 1.2,
                shapes: ['star']
            });
            
            confetti({
                ...defaults,
                particleCount: 10,
                scalar: 0.75,
                shapes: ['circle']
            });
        }
        
        setTimeout(shoot, 0);
        setTimeout(shoot, 100);
        setTimeout(shoot, 200);
        //confetti
        
        setTimeout(()=> navigate('/voucher'), 1000);
    }, [navigate]);

    const setLocalizacao = useCallback((e) => {
        console.log('EVENTOOO', e?.detail);
        
        setLocationUser(e?.detail);
    }, []);

    const verificaPermissoes = useCallback((e) => {
        console.log('EVENTOOO', e.detail);
        
        if(e.detail == 'permissao-minima' || e.detail == 'permissao-total') {
            console.log(e.detail == 'permissao-total' ? 'PERMISSAO TOTAL' : 'PERMISSAO MINIMA');
            setStatusPermissoes(e.detail);
        } 
        else {
            console.log('PERMISSOES INSUFICIENTES');
            
            setStatusPermissoes(e.detail);
        }
        // else {
        //     //logica caso não siga quando orientacao e camera for negadas
        // }
    }, []);
    
    // useEffect(()=> {
    //     function componentsCustomAframe() {
    //         console.log('Effect /Game Aframe');

    //         // Componentes A-frame customizados:
    //         if(!AFRAME.components['init-permissions']) 
    //         {
    //         AFRAME.registerComponent('init-permissions', {
    //             schema: {
    //                 // Onde vai os atributos, se necessario
    //             },

    //             init: function() {
    //                 console.log('Init component Aframe Effect')
    //                 // Editar modal de solicitação de permissões:
    //                 // device-orientation-permission-ui="denyButtonText: Rejeitar; allowButtonText: Aceitar; deviceMotionMessage: Texto aqui"
    //                 this.el.setAttribute('device-orientation-permission-ui', "allowButtonText: Entendi; deviceMotionMessage: Para seguir com a experiência é necessário permitir o acesso ao sensor de movimento, localização e câmera do dispositivo.");

    //                 // this.el.addEventListener('deviceorientationpermissionrequested', ()=> alert('Para seguir com a experiência é necessario autorizar acesso ao movimento e câmera do celular.'));

    //                 // Mensagem quando o acesso for negado:
    //                 this.el.addEventListener('deviceorientationpermissionrejected', ()=> {
    //                     console.log('PERMISSOES INSUFICIENTES');
    //                     setStatusPermissoes('negada');
    //                     ////document.dispatchEvent(eventoPermissoesNegadas);

    //                     console.log('Status: Permissão de movimento foi negada. Para permitir o acesso, vá para as configurações do navegador e ative o acesso aos sensores.');
    //                     alert('Status: Permissão de movimento foi negada. Para permitir o acesso, vá para as configurações do navegador e ative o acesso aos sensores.');
    //                 });
                    
                    
    //                 if(window.DeviceOrientationEvent && window.DeviceOrientationEvent.requestPermission) {
    //                 // Para iOS 13+:
    //                     Cookies.set('device99', 'iphone', { expires: EXPIRE_COOKIES });
    //                     this.el.addEventListener('deviceorientationpermissiongranted', ()=> {
    //                         // Verifica se as permissões de movimento foi consedido
    //                         DeviceMotionEvent.requestPermission()
    //                         .then(response => {
    //                             if(response === 'granted') {
    //                                 // Permissão aceita
    //                                 /////this.initCamera();
    //                                 this.getLocation();
    //                             }
    //                             else {
    //                                 // Permissão negada
    //                                 // alert('Foi negado o acesso ao movimento/orientação do dispositivo. Para permitir o acesso, vá para as configurações do navegador e ative o acesso aos sensores.');
    //                                 //Não seguir no jogo
    //                                 //// document.dispatchEvent(eventoPermissoesNegadas);
    //                                 console.log('Foi negado o acesso ao movimento/orientação do celular. Para permitir o acesso, vá para as configurações do navegador e ative o acesso aos sensores.');
    //                                 alert('Foi negado o acesso ao movimento/orientação do celular. Para permitir o acesso, vá para as configurações do navegador e ative o acesso aos sensores.');
    //                             }
    //                         })
    //                         .catch(error => {
    //                             console.error('Erro ao solicitar a permissão:', error);
    //                         });
    //                     });
    //                 }
    //                 else {
    //                 // Para dispositivos que não solicita permissão de deviceorientation:
    //                     Cookies.set('device99', 'android', { expires: EXPIRE_COOKIES });
    //                     /////this.initCamera();
    //                     this.getLocation();
    //                 }
    //             },
                
    //             getLocation: function() {
    //                 console.log('Geolocalização');

    //                 if("geolocation" in navigator) {
    //                     navigator.geolocation.getCurrentPosition((position)=> {
    //                         // const eventoGeolocazicao = new CustomEvent('geolocalizacao', {
    //                         //     detail: {latitude: position.coords.latitude, longitude: position.coords.longitude}
    //                         // });
    //                         let geoLocation = {
    //                             latitude: position.coords.latitude,
    //                             longitude: position.coords.longitude
    //                         }
    //                         console.log(geoLocation);

    //                         setLocationUser(geoLocation);
    //                         this.initCamera();
    //                     }, 
    //                     (error)=> {
    //                         switch(error.code) {
    //                             case error.PERMISSION_DENIED:
    //                                 console.log('PERMISSOES INSUFICIENTES');
    //                                 setStatusPermissoes('geo negada');
    //                                 ////document.dispatchEvent(eventoLocalizacaoNegada);

    //                                 console.log('Status: Permissão de localização foi negada. Para permitir o acesso, vá para as configurações do navegador e ative o acesso aos sensores.');
    //                                 alert('Status: Permissão de localização foi negada. Para permitir o acesso, vá para as configurações do navegador e ative o acesso aos sensores.');
    //                                 break;
    //                             case error.POSITION_UNAVAILABLE:
    //                                 toast.error("Informação de localização indisponível.");
    //                                 break;
    //                             case error.TIMEOUT:
    //                                 toast.error("A requisição de localização expirou.");
    //                                 break;
    //                             case error.UNKNOWN_ERROR:
    //                                 toast.error("Ocorreu um erro desconhecido.");
    //                                 break;
    //                         }
    //                     }, 
    //                     {
    //                         timeout: 10000 // Tempo limite de 10 segundos
    //                     }, this);
    //                 } 
    //                 else {
    //                     console.log('PERMISSOES INSUFICIENTES');
    //                     setStatusPermissoes('geo negada');
    //                     ////document.dispatchEvent(eventoLocalizacaoNegada);

    //                     toast.error("Geolocalização não é suportada pelo navegador.");
    //                 }
    //             },

    //             initCamera: function() {
    //                 console.log('Camera');

    //                 const videoRef = document.getElementById('videoRef');
    //                 const videoConstraints = {
    //                     width: { min: 1440, ideal: 1920, max: 1920 },
    //                     height: { min: 960, ideal: 1080, max: 1080 },
    //                     aspectRatio: 16 / 9,
    //                     facingMode: "environment"
    //                 };
                    
    //                 // Verifica se o navegador suporta getUserMedia
    //                 if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    //                     navigator.mediaDevices.getUserMedia({ video: videoConstraints })
    //                         .then(stream => {
    //                             videoRef.srcObject = stream;
    //                             videoRef.play();

    //                             console.log('PERMISSAO TOTAL');
    //                             setStatusPermissoes('permissao-total');
    //                             ////document.dispatchEvent(eventoPermissoesPermitidas);
    //                         })
    //                         .catch(error => {
    //                             console.error('Erro ao acessar a câmera: ', error);
                                
    //                             console.log('PERMISSAO MINIMA');
    //                             setStatusPermissoes('permissao-minima');
    //                             ////document.dispatchEvent(eventoCameraNegada);

    //                             toast.info('Não foi possível acessar a câmera.');
    //                         });
    //                 } 
    //                 else {
    //                     console.error('getUserMedia não é suportado no navegador.');
    //                 }
    //             }
    //         });
    //         }

    //         if(!AFRAME.components['set-stars']) {
    //         AFRAME.registerComponent('set-stars', {
    //             schema: {
    //                 // Onde vai os atributos, se necessario
    //             },

    //             init: function() {
    //                 this.miraMoto = document.getElementById('mira-moto');
    //                 this.setaMoto = document.getElementById('seta-moto');
    //                 this.camera = document.getElementById('camera-target');
    //                 var coordenadas = [
    //                     {
    //                         estrela1: { x: 31.34, y: 25.02, z: -11.58 },
    //                         estrela2: { x: 24.070, y: 34.85, z: 11.36 },
    //                         estrela3: { x: 10.48, y: 40.51, z: -8.327 },
    //                         estrela4: { x: -12.27, y: 42.94, z: -15.55 },
    //                         estrela5: { x: -24.17, y: 42.70, z: 7.30 }
    //                     }
    //                 ];
    //                 // Escolher uma coordenada ativa aleatória
    //                 var coordenadaAtiva = coordenadas[Math.floor(Math.random() * coordenadas.length)];

    //                 // Seta as posições da Constelação e estrelas
    //                 // this.el.object3D.position.set(coordenadaAtiva.constelacao.x, coordenadaAtiva.constelacao.y, coordenadaAtiva.constelacao.z);
                    
    //                 // Loop pela array this.estrelas
    //                 this.estrelas = this.el.children;
    //                 for (let i = 0; i < this.estrelas.length; i++) {
    //                     this.estrelas[i].object3D.position.set(coordenadaAtiva['estrela' + (i + 1)].x, coordenadaAtiva['estrela' + (i + 1)].y, coordenadaAtiva['estrela' + (i + 1)].z);

    //                     this.estrelas[i].setAttribute('look-at', '#camera-target');
    //                     this.estrelas[i].addEventListener('mouseenter', (e) => this.collisionStar(e));
    //                 }

    //                 // Seta a estrela alvo do momento
    //                 this.targetStar = 0;
    //                 this.activeStar(this.targetStar);
    //             },

    //             tick: function (time, timeDelta) {
    //                 // Controla seta guia estrelar
    //                 // let local = this.estrelas[this.targetStar].object3D.getWorldPosition();
    //                 let local = this.estrelas[this.targetStar].object3D.position.clone();
    //                 // console.log(local);
    //                 this.camera.object3D.worldToLocal(local);

    //                 let angleDeg = Math.atan2(-local.y - 0, local.x - 0) * 180 / Math.PI + 180;
    //                 angleDeg -= 90;
                    
    //                 this.setaMoto.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg)`;
    //             },

    //             activeStar: function (numStar) {
    //                 this.targetStar = numStar;
    //                 this.estrelas[numStar].setAttribute('opacity', 1);
    //                 this.estrelas[numStar].setAttribute('animation', 'property: scale; to: 2 2 1; dir: alternate; dur: 1000; easing: easeInOutQuad; loop: true');
    //             },

    //             collisionStar: function (e) {
    //                 console.log(e.target.id);
    //                 console.log(this.estrelas[this.targetStar].id);

    //                 if(e.target.id == this.estrelas[this.targetStar].id && this.targetStar < 4) {
    //                     this.miraMoto.classList.add("animate-brilho");
    //                     this.estrelas[this.targetStar].removeAttribute('animation');
    //                     this.targetStar++;
    //                     this.activeStar(this.targetStar);
    //                     setTimeout(()=> this.miraMoto.classList.remove("animate-brilho"), 800);
    //                 }
    //                 if(e.target.id == 'star5' && this.estrelas[this.targetStar].id == 'star5') {
    //                     // alert('fim de jogo');
    //                     // document.dispatchEvent(eventoFimJogo);
    //                 }
    //             }
    //         });
    //         }
    //     }
    //     componentsCustomAframe();
    // }, []);

    useEffect(()=> {
        function initListenerEvents() {
            console.log('Effect /Game');

            if(hasVoucher) {
                //// Direciona p/ rota de voucher
                navigate('/voucher');
                return;
            }

            // Adiciona o listener no documento
            // document.addEventListener("fimJogo", acaoFimJogo); //// achou estrela solitaria
            document.addEventListener("permissaoStatus", verificaPermissoes);

            //// faz callback
            // const getLocation = (event)=> {
            //     console.log(event?.detail);
            //     setLocationUser(event?.detail);
            // };
            document.addEventListener("msgLocation", setLocalizacao);
            document.addEventListener("msgStartGame", ()=>{console.log('oiiiiii'); setStartGame(true)});


            const handleIframeMessage = (event)=> {
                // Filtra a origem da mensagem por questões de segurança
                if(event.origin !== BASE_URL) {
                    return;
                }
    
                if(event.data == 'ACABOU') {
                    console.log('Mensagem recebida do iframe:', event.data);
                    acaoFimJogo();
                }
            };
            // Escuta as mensagens enviadas do iframe
            window.addEventListener('message', handleIframeMessage);
            
            // Ativa componente aframe
            setAtivaAframe(true);

            //Limpa o listener quando o componente desmontar
            return () => {
                document.removeEventListener("permissaoStatus", verificaPermissoes);
                document.removeEventListener("msgLocation", setLocalizacao);
                window.removeEventListener('message', handleIframeMessage);
            };
        }
        initListenerEvents();
    }, [hasVoucher, navigate, verificaPermissoes, setLocalizacao, acaoFimJogo, BASE_URL]);


    const postGeolocationAPI = useCallback(async ()=> {
        console.log('POSTTTT')
        console.log(locationUser)
        // console.log(statusPermissoes);
        if(locationUser) {
            const today = new Date();
            const month = today.getMonth() + 1;
            const year = today.getFullYear();
            const date = today.getDate();
            const hours = today.getHours();
            const minutes = today.getMinutes();
            const seconds = today.getSeconds();

            const currentDate = date + "-" + month + "-" + year + " " + hours + ":" + minutes + ":" + seconds;
            const hoursFormated = currentDate.split(' ');
            const hoursFinal = hoursFormated[1];
            
            let { latitude, longitude } = locationUser;
            console.log(latitude , longitude);
            

            if(latitude !== "" && longitude !== "" && currentDate !== "") {               
                const response = await USER_COORDINATES(latitude, longitude, currentDate);
                console.log(response);
            
                if(hoursFinal < '17:45:00') {
                    console.log('fora do horário de participação');
                }
                
                if(response.success === false) {
                    console.log('Erro: ', response.message);
                    console.log('ID do Usuário: ', response.idUser);
                    return; // Aqui estava faltando
                }
            
                if(response.success === true) {
                    console.log('Requisição bem-sucedida.');
                    console.log('ID do Usuário: ', response.idUser);
            
                    // Usando o idUser corretamente no navigate
                    console.log(response.idUser);
                    // navigate(`/get-vouchers/${idUser}`);
                }
            }
        }
        else {
            console.log('SEM LOCALIZAÇÃO PARA ENVIAR PARA API');
        }
    }, [locationUser]);

    useEffect(()=> {
        // É executada quando state 'startGame' é atualizada:
        function callPostAPI() {
            console.log('Effect2 /Game');

            if(startGame) {
                postGeolocationAPI();
            }
        }
        callPostAPI();
    }, [startGame, postGeolocationAPI]);

    
    // async function postGeolocationAPI() {
    //     console.log(locationUser)
    //     console.log(statusPermissoes);
    //     if(locationUser) {
    //         const today = new Date();
    //         const month = today.getMonth() + 1;
    //         const year = today.getFullYear();
    //         const date = today.getDate();
    //         const hours = today.getHours();
    //         const minutes = today.getMinutes();
    //         const seconds = today.getSeconds();

    //         const currentDate = date + "-" + month + "-" + year + " " + hours + ":" + minutes + ":" + seconds;
    //         const hoursFormated = currentDate.split(' ');
    //         const hoursFinal = hoursFormated[1];
            
    //         let { latitude, longitude } = locationUser;
    //         console.log(latitude , longitude);
            

    //         if(latitude !== "" && longitude !== "" && currentDate !== "") {               
    //             const response = await USER_COORDINATES(latitude, longitude, currentDate);
    //             console.log(response);
            
    //             if(hoursFinal < '17:45:00') {
    //                 console.log('fora do horário de participação');
    //             }
                
    //             if(response.success === false) {
    //                 console.log('Erro: ', response.message);
    //                 console.log('ID do Usuário: ', response.idUser);
    //                 return; // Aqui estava faltando
    //             }
            
    //             if(response.success === true) {
    //                 console.log('Requisição bem-sucedida.');
    //                 console.log('ID do Usuário: ', response.idUser);
            
    //                 // Usando o idUser corretamente no navigate
    //                 console.log(response.idUser);
    //                 // navigate(`/get-vouchers/${idUser}`);
    //             }
    //         }
    //     }
    //     else {
    //         console.log('SEM LOCALIZAÇÃO PARA ENVIAR PARA API');
    //     }
    // }
    function handleStartGame() 
    {
        console.log('Func start');
        // postGeolocationAPI();

        if(statusPermissoes == 'permissao-minima' || statusPermissoes == 'permissao-total') {
            console.log('Começa o jogo!');
            setStartGame(true);
        }

        if(statusPermissoes == 'negada') {
            console.log('Permissão de movimento/orientação do celular foi negada. Para seguir com a experiência é necessário ir nas configurações do navegador e ativar o acesso.');

            alert('Permissão de movimento e/ou localização do celular foi negada. Para seguir com a experiência é necessário ir nas configurações do navegador e ativar o acesso.');
        }
        if(statusPermissoes == 'geo negada') {
            console.log('Permissão de localização foi negada. Para seguir com a experiência é necessário ir nas configurações do navegador e ativar o acesso.');

            alert('Permissão de localização foi negada. Para seguir com a experiência é necessário ir nas configurações do navegador e ativar o acesso.');
        }
    }



    return (
        <main className='Page Game'>

            {!startGame && 
            <div className={`Instrucao grid ${statusPermissoes} Welcome`}>
                <div className="bg-app">
                    {/* <img src={BgApp} alt="" /> */}
                </div>
                
                <div className="top">
                    <img src={LogoHeader} alt="Logo da campanha" />
                </div>

                <div className='mid'>
                    <p>Aponte o <br /> dispositivo pra cima.</p>

                    <img src={MaoInstrucao} alt="" />

                    <div className="text-constelacao">
                        <p>
                            Quando achar  a constelação
                            <span> guie a moto  pelos pontos.</span>
                        </p>

                        <img src={ConstelacaoInstrucao} alt="" />
                    </div>
                </div>

                <div className='bottom' onClick={handleStartGame}>
                    <img src={MotoStart} alt="" />
                    <p>Começar</p>
                </div>                
            </div> 
            }

            
            {ativaAframe &&
            <AframeGame startGame={startGame} setStartGame={setStartGame} />
            }
            
        </main>
    )
}