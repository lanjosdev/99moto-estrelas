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
import logo from '../../assets/logo.png';
import notVoucher from '../../assets/not-voucher.png';

// Estilo:
import './style.css';


export default function Voucher() {
    const [voucher, setVoucher] = useState(null);
    const [clicou, setClicou] = useState(false);
    
    const navigate = useNavigate();

    const EXPIRE_COOKIES = config.expire_cookies;
    console.log(EXPIRE_COOKIES);
    const sistema = Cookies.get('device99');
    const idJogou = Cookies.get('idJogou99');
    const hasVoucher = Cookies.get('voucher99');
    // const hasVoucher = '000259784';
    
    const linkApp = sistema == 'android' ? 'https://play.google.com/store/apps/details?id=com.taxis99&hl=pt_BR&pli=1' : 'https://apps.apple.com/br/app/99-v%C3%A1-de-carro-moto-ou-taxi/id553663691'



    const getVoucherAPI = useCallback(async()=> {
        try {
            const response = await GET_VOUCHER(idJogou);
            console.log('Resposta:', response);

            if(response.success) {
                setVoucher(response.message);
                Cookies.set('voucher99', response.message, { expires: EXPIRE_COOKIES });
            }
            else {
                console.log('NAO TEM CUPOM');
                setVoucher('');
            }
        }
        catch(erro) {
            console.error('Erro na Requisição', erro);
            setVoucher('');
            toast.error('Houve algum erro.');
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
                console.log('Volta p/ home');
                navigate('/');
            }
        }
        verificacaoInicial();
    }, [hasVoucher, idJogou, navigate, getVoucherAPI]);



    function handleCopiarVoucher() {
        console.log('copiando voucher...');

        // let texto = '00025976';
        navigator.clipboard.writeText(voucher);

        toast.success('Voucher copiado!');

        // setTimeout(()=> setVoucher('copiou'), 500);
    }


    return (
        <main className='Page Voucher'>

            <div className="grid Welcome">

                <div className="bg-app">
                    {/* <img src={BgApp} alt="" /> */}
                </div>

                <div className="top">
                    <img src={logoHeader} alt="Logo da campanha" />
                </div>

                {voucher && (
                <div className="content-voucher">

                    {!clicou ? (
                    <>
                    <p className='title'>Parabéns!</p>

                    <p>
                        Você capturou <br />
                        um <span>cupom</span> de
                    </p>

                    <img className='logo' src={logo} alt="Logo" />

                    <button className='btn-primary' onClick={()=> setClicou(true)}>Continuar</button>
                    </>
                    ) : (
                    <>
                    <p className='text-bi'>
                        Atingimos <span>1 BILHÃO</span><br />
                        de corridas graças a você, <br />
                        obrigado!
                    </p>

                    <p className="result-voucher" onClick={handleCopiarVoucher}>
                        {voucher}
                    </p>

                    <div className="btn-small">
                        <button className='btn-primary' onClick={handleCopiarVoucher} >Copiar código</button>
                        <small>Utilize o código na aba meus <br /> descontos do app 99.</small>
                    </div>

                    <p className='bottom'>
                        Ainda não tem <br />
                        o app 99? <a href={linkApp} target="_blank" rel="noopener noreferrer">Clique aqui.</a>
                    </p>
                    </>
                    )}

                </div>
                )}

                {voucher == '' &&
                <div className="content-not-voucher">

                    <div className="img-title">
                        <img src={notVoucher} alt="" />
                        <p className='title'>Aqui não <br /> tem cupom.</p>
                    </div>

                    <div className="separator"></div>

                    <p className="msg-mid">
                        Continue tentando, <br />
                        tem muitos cupons de <br />
                        <span>99Moto</span> espalahdos <br />
                        pelo céu.
                    </p>

                    <p className="msg-bottom">
                        Acompanhe <br />
                        as dicas de localização <br />
                        no <a href="https://www.instagram.com/voude99" target="_blank" rel="noopener noreferrer">@voude99</a>
                    </p>
                </div>
                }
            </div>           

        </main>
    )
}