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
// import { toast } from "react-toastify";

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
    const [areaPromo, setAreaPromo] = useState(null);

    const navigate = useNavigate();

    const BASE_URL = config.base_url;
    const EXPIRE_COOKIES = config.expire_cookies;
    console.log(EXPIRE_COOKIES);
    const hasVoucher = Cookies.get('voucher99');

    

    const acaoFimJogo = useCallback(() => {
        if(idUser) {
            Cookies.set('idJogou99', JSON.stringify(idUser), { expires: EXPIRE_COOKIES });
        }

        if(areaPromo == 'usuário em região promocional') {
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
        }
        
        setTimeout(()=> {
            console.log('navigate /voucher');
            navigate('/voucher')
        }, 1000);
    }, [navigate, idUser, areaPromo, EXPIRE_COOKIES]);

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

    useEffect(()=> {
        function initListenerEvents() {
            console.log('Effect /Game');

            if(hasVoucher) {
                //// Direciona p/ rota de voucher
                navigate('/voucher');
                return;
            }

            // Adiciona o listener no documento
            document.addEventListener("permissaoStatus", verificaPermissoes);
            document.addEventListener("msgLocation", setLocalizacao);
            document.addEventListener("msgStartMovimento", ()=>{console.log('Inicia e callPostAPI'); setStartGame(true)});
            // document.addEventListener("fimJogo", acaoFimJogo); //// achou estrela solitaria


            // Ao finalizar game:
            const handleIframeMessage = (event)=> {
                // Filtra a origem da mensagem por questões de segurança
                // if(event.origin !== BASE_URL) {
                //     return;
                // }
    
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
                document.removeEventListener("msgStartMovimento", ()=>{console.log('Inicia e callPostAPI'); setStartGame(true)});

                window.removeEventListener('message', handleIframeMessage);
            };
        }
        initListenerEvents();
    }, [hasVoucher, navigate, verificaPermissoes, setLocalizacao, acaoFimJogo, BASE_URL]);


    const postGeolocationAPI = useCallback(async ()=> {
        console.log('func postGeolocationAPI()');
        
        try {
            if(locationUser) {
                const today = new Date();
                const month = today.getMonth() + 1;
                const year = today.getFullYear();
                const date = today.getDate();
                const hours = today.getHours();
                const minutes = today.getMinutes();
                const seconds = today.getSeconds();
    
                const currentDate = date + "-" + month + "-" + year + " " + hours + ":" + minutes + ":" + seconds;
                
                let { latitude, longitude } = locationUser;
                console.log(latitude , longitude);
                if(latitude !== "" && longitude !== "" && currentDate !== "") {               
                    const response = await USER_COORDINATES(latitude, longitude, currentDate);
                    console.log(response);
    
                    setIdUser(response.idUser);
                    setAreaPromo(response.message);
                    
                    if(response.success === false) {
                        console.log('Erro: ', response.message);
                        console.log('ID do Usuário: ', response.idUser);
                        return;
                    }
                
                    if(response.success === true) {
                        console.log('Requisição bem-sucedida.');
                        console.log('ID do Usuário: ', response.idUser);
                    }
                }
            }
            else {
                console.log('SEM LOCALIZAÇÃO PARA ENVIAR PARA API');
            }
        }
        catch(erro) {
            console.error('ERRO NA REQUISIÇÃO:', erro);
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