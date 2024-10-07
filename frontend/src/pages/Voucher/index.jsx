// Hooks / Funcionalidades / Libs:
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

// Components:
import { toast } from "react-toastify";

// Utils:
// import { primeiraPalavra } from '../../utils/formatarStrings';

// Assets:
// import circleVoucher from '../../assets/circulo-check.png';
import logo99 from '../../assets/logoBig.png';

// Estilo:
import './style.css';


export default function Voucher() {
    const [voucher, setVoucher] = useState('');
    
    const navigate = useNavigate();

    const sistema = Cookies.get('device99');
    // console.log(sistema);  
    const linkApp = sistema == 'android' ? 'https://play.google.com/store/apps/details?id=com.taxis99&hl=pt_BR&pli=1' : 'https://apps.apple.com/br/app/99-v%C3%A1-de-carro-moto-ou-taxi/id553663691'


    function handleCopiarVoucher() {
        console.log('copiando voucher...');

        let texto = '00025976';
        navigator.clipboard.writeText(texto);

        toast.success('Voucher copiado!');

        setTimeout(()=> setVoucher('copiou'), 500);
    }


    return (
        <main className='Page Voucher'>

            {voucher == '' ? (

                <div className='CVoucher grid'>
                    <div className='top'>
                        <h3>
                            Parabéns! <br />
                            Você capturou um voucher para andar de 99moto.
                        </h3> 
                    </div>

                    <div className='mid'>
                        <div className="circle-voucher">
                            <img src='' alt="" />
                            <p onClick={handleCopiarVoucher}>00025976</p>
                        </div>
                    </div>

                    <div className='bottom'>
                        <p>Copie o código e utilize <br /> na aba {`"Meus descontos"`} <br /> do  app 99.</p>
                    </div>
                </div>

            ) : (

                <div className="Replay CVoucher grid">
                    <div className='top'>
                        <h2>
                            Atingimos mais de 1 bilhão de corridas graças à você, obrigado!
                        </h2> 
                    </div>

                    <div className='mid'>
                        <img src={logo99} alt="" />    
                        <a href='/'>Jogar de novo</a>                    
                    </div>

                    <div className='bottom'>
                        <p>
                            Ainda não tem o app 99? <br />
                            <a href={linkApp} target="_blank" rel="noopener noreferrer">Clique aqui</a>
                        </p>
                    </div>
                </div>

            )}
            

        </main>
    )
}