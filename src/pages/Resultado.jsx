import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  obterVotos,
  calcularResultado,
  desfazerUltimoVoto,
  zerarVotos,
} from '../services/votacaoService';

function Resultado() {
  const [votos, setVotos] = useState(() => obterVotos());

  const total = votos.length;
  const resultado = calcularResultado(votos);
  const craque = resultado[0];
  const vice = resultado[1];
  const vantagem = craque.votos - vice.votos;

  function handleDesfazer() {
    setVotos(desfazerUltimoVoto());
  }

  function handleZerar() {
    if (window.confirm('Apagar todos os votos?')) {
      zerarVotos();
      setVotos([]);
    }
  }

  return (
    <main className="pagina">
      <h1>Resultado</h1>
      <p>Total de votos: {total}</p>

      {total === 0 ? (
        <p>
          Nenhum voto computado ainda. <Link to="/votacao">Ir para a votação</Link>
        </p>
      ) : (
        <>
          <p className="disputa">
            {vantagem === 0
              ? `Empate na liderança entre ${craque.nome} e ${vice.nome}!`
              : `${craque.nome} lidera com ${vantagem} ${vantagem === 1 ? 'voto' : 'votos'} de vantagem sobre ${vice.nome}.`}
          </p>

          <ol className="placar">
            {resultado.map((j, indice) => (
              <li
                key={j.id}
                className={`placar-item${indice === 0 ? ' placar-craque' : ''}${indice === 1 ? ' placar-vice' : ''}`}
              >
                <span className="placar-posicao">{indice + 1}º</span>
                <img src={j.foto} alt={j.nome} className="placar-foto" />
                <div className="placar-info">
                  <p>
                    <strong>{j.nome}</strong>
                    {indice === 0 && <span className="selo-placar selo-craque">Craque do jogo</span>}
                    {indice === 1 && <span className="selo-placar selo-vice">Vice</span>}
                  </p>
                  <div className="barra">
                    <div className="barra-preenchida" style={{ width: `${j.percentual}%` }} />
                  </div>
                  <p>
                    {j.percentual.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}% ({j.votos}{' '}
                    {j.votos === 1 ? 'voto' : 'votos'})
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="resultado-acoes">
            <button type="button" className="botao" onClick={handleDesfazer}>
              Desfazer último voto
            </button>
            <button type="button" className="botao" onClick={handleZerar}>
              Zerar votação
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export default Resultado;
