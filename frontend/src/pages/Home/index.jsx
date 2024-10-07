// Hooks / Funcionalidades / Libs:
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

// Config JSON:
import config from '../../../public/configApp.json';

// Components:
// import { toast } from "react-toastify";

// Utils:
// import { primeiraPalavra } from '../../utils/formatarStrings';

// Assets:
import LogoBig from '../../assets/logoBig.png';
// import LogoHeader from '../../assets/logo-header.png';

// Estilo:
import './style.css';


export default function Home() {
    const [jogoLiberado, setJogoLiberado] = useState(true);

    const navigate = useNavigate();

    const hasVoucher = Cookies.get('voucher99');
    const horaInicial = config.hora_inicio;
    const horaTermino = config.hora_termino;



    useEffect(()=> {
        function verificacaoInicial() {
            console.log('Effect /Home');

            if(!hasVoucher) {
                const atual = new Date(); //cria uma nova instância do objeto Date 
                const horaAtual = atual.getHours();
                const minutoAtual = atual.getMinutes();
                console.log(horaAtual, minutoAtual);
                
                if((horaAtual < horaInicial) || (horaAtual == horaTermino && minutoAtual > 0)) {
                    // if {
                    //     console.log('BLOQUEIA');
                    //     setJogoLiberado(false);
                    // }
                    console.log('BLOQUEIA');
                    setJogoLiberado(false);
                }
            }
            else {
                //// Direciona p/ rota de voucher
                navigate('/voucher');
            }
        }
        verificacaoInicial();
    }, [hasVoucher, horaInicial, horaTermino, navigate]);



    // function handleEntrarGame() 
    // {
    //     if(jogoLiberado) {
    //         //aqui é navigate(/game)
    //     }
    // }  


    return (
        <main className='Page Home'>

            <div className='Welcome grid'>
                <div className="bg-app">
                    {/* <img src={BgApp} alt="" /> */}
                </div>

                <div className="top">
                    <img src={LogoBig} alt="Logo da campanha" />
                </div>

                <div className='mid'>
                    <h2>
                        Para celebrar 
                        <span className='text-yellow'>1 Bilhão de corridas,</span>  
                        <span>espalhamos cupons <br /> nas estrelas</span>
                    </h2>

                    <button className='btn-primary' onClick={()=> navigate('/game')}>Entrar</button>
                    {/* <a className={jogoLiberado ? 'btn-primary' : ''} href="/game">Entrar</a> */}
                </div>

                <div className='bottom'>
                    <p>
                        Explore o céu <br />
                        entre {horaInicial}h e {horaTermino}h <br />
                        para capturar o seu.</p>
                </div>                        
            </div>
                  
        </main>
    )
}