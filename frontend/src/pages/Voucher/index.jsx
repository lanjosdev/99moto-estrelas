// Hooks / Funcionalidades / Libs:
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GET_VOUCHER } from '../../API/getVoucherApi';
import Cookies from "js-cookie";

// Config JSON:
import config from '../../../public/configApp.json';

// Components:
import { toast } from "react-toastify";

// Utils:
// import { primeiraPalavra } from '../../utils/formatarStrings';

// Assets:
// import circleVoucher from '../../assets/circulo-check.png';
import logoHeader from '../../assets/logo-header.png';

// Estilo:
import './style.css';


export default function Voucher() {
    const [voucher, setVoucher] = useState(null);
    
    const navigate = useNavigate();

    const EXPIRE_COOKIES = config.expire_cookies;
    console.log(EXPIRE_COOKIES);
    const sistema = Cookies.get('device99');
    const idJogou = Cookies.get('idJogou99');
    const hasVoucher = Cookies.get('voucher99');
    // console.log(sistema);  
    const linkApp = sistema == 'android' ? 'https://play.google.com/store/apps/details?id=com.taxis99&hl=pt_BR&pli=1' : 'https://apps.apple.com/br/app/99-v%C3%A1-de-carro-moto-ou-taxi/id553663691'



    const getVoucherAPI = useCallback(async()=> {
        try {
            const response = await GET_VOUCHER(idJogou);
            console.log('Resposta:', response);

            if(response.success) {
                Cookies.set('voucher99', response.message, { expires: EXPIRE_COOKIES });
                setVoucher(response.message);
            }
            else {
                console.log('NAO TEM CUPOM');
                setVoucher('');
            }
        }
        catch(erro) {
            console.error('Erro na Requisição', erro);
        }
    }, [idJogou, EXPIRE_COOKIES]);

    useEffect(()=> {
        function verificacaoInicial() {
            console.log('Effect /Voucher');
            
            if(hasVoucher) {
                setVoucher(hasVoucher);
            }
            else if(idJogou) {
                getVoucherAPI();
            }
            else {
                console.log('vai p/ home');
                navigate('/');
            }
        }
        verificacaoInicial();
    }, [hasVoucher, idJogou, navigate, getVoucherAPI]);



    function handleCopiarVoucher() {
        console.log('copiando voucher...');

        let texto = '00025976';
        navigator.clipboard.writeText(texto);

        toast.success('Voucher copiado!');

        setTimeout(()=> setVoucher('copiou'), 500);
    }


    return (
        <main className='Page Voucher'>

            <div className="grid Welcome">
                <div className="bg-app">
                    {/* <img src={BgApp} alt="" /> */}
                </div>

                <div className="top">
                    <img src={logoHeader} alt="" />
                </div>
            </div>           

        </main>
    )
}