import React, { useState, useEffect } from 'react';
import * as api from './api/apiService';
import Spinner from './components/Spinner';
import ReactTooltip from 'react-tooltip';
//import Box from './testBox';
import './styles.css';

export default function App() {
  const [allGrades, setAllGrades] = useState([]);
  const [validaClick, setValidaClick] = useState(true);
  const [suaRifa, setSuaRifa] = useState(true);
  const [disRifa, setDisRifa] = useState(false);
  const [suaRifaNum, setSuaRifaNum] = useState([]);

  const [onlyGradeName, setonlyGradeName] = useState([]);
  const [onlyAtualRifa, setonlyAtualRifa] = useState([]);
  const [onlySituacao, setonlySituacao] = useState([]);

  const [savedName, setSavedName] = useState([]);
  const [savedTelefone, setSavedTelefone] = useState([]);
  const [arrayDados, setArrayDados] = useState([]);

  const [countBoxes, setCountBoxes] = useState(999);
  const [disponiveisBoxes, setDisponiveisBoxes] = useState(0);
  const [disponiveisRifas, setDisponiveisRifas] = useState([]);
  const [pagoBoxes, setPagoBoxes] = useState(0);
  const [reservadoBoxes, setReservadoBoxes] = useState(0);

  const [finishButtonCounter, setFinishButtonCounter] = useState(0);
  const [finishButtonAppear, setFinishButtonAppear] = useState(false);

  useEffect(() => {
    // api.getAllGrades().then((grades) => {
    const getGrades = async () => {
      const grades = await api.getAllGrades();

      setTimeout(() => {
        const pagos = grades.filter((grade) => grade.baixa === true).length;
        const reservados = grades.filter((grade) => grade.baixa === false)
          .length;
        // const disponiveis = grades.map((grade) => parseInt(grade.rifanumber));
        setAllGrades(grades);
        setDisponiveisBoxes(grades.length);
        setPagoBoxes(pagos);
        setReservadoBoxes(reservados);
      }, 1000);
    };
    getGrades();
  }, []);

  useEffect(() => {
    setArrayDados((arrayDados) => [...arrayDados]);
  }, []);

  const array = Array.from({ length: countBoxes }, (v, i) => i);
  const baixaPaga = allGrades.filter((grade) => grade.baixa === true);
  const rifasPagas = baixaPaga.map((grade) => grade.rifanumber);
  // const rifaFilter = allGrades.filter(
  //   (grade) => grade.telefone === savedTelefone
  // );
  // const rifaFilternum = rifaFilter.map((grade) => grade.rifanumber);
  // const baixaReservada = allGrades.filter((grade) => grade.baixa === false);
  // const rifasReservadas = baixaReservada.map((grade) => grade.rifanumber);
  // console.log(baixaPaga);
  // console.log(rifasReservadas);
  rifasPagas.sort((a, b) => a - b);

  //const pagos = allGrades.filter((grade) => grade.baixa === true);
  // async function validar(event) {
  //   const idvalue = event.target.id
  //   const valindando =
  //     allGrades.filter((grade) => grade.rifanumber === idvalue).length === 0
  //       ? 'btn-floating waves-effect btn tooltipped'
  //       : 'btn-floating waves-effect yellow btn tooltipped'
  //       return
  // }

  const InformacaoRifa = (event) => {
    const idvalue = event.target.id;
    //const getId = document.getElementById(idvalue);

    const getRifa = allGrades.filter((grade) => grade.rifanumber === idvalue);
    const callitem = getRifa.map((grade) => grade.client);
    const callsituacao = getRifa.map((grade) => grade.baixa);

    setonlyGradeName(callitem);
    setonlyAtualRifa(idvalue);
    setonlySituacao(callsituacao[0]);
    // console.log(onlySituacao);
    // console.log(onlyGradeName);
    // console.log(callitem);
    // console.log(getId.id);
    // console.log(finishButtonCounter);
  };

  const handleChangeBoxes = (event) => {
    const idvalue = event.target.id;
    const getId = document.getElementById(idvalue);
    const rifanum = getId.id;

    const getRifa = allGrades.filter((grade) => grade.rifanumber === idvalue);
    if (getRifa.length > 0) {
      // console.log(onlyGradeName);
      // console.log('AQUI' + JSON.stringify(getRifa)); stringify para ler o que tem no getRifa
    } else {
      let counterButton = finishButtonCounter;

      arrayDados.sort((a, b) => a - b);
      if (getId.className === 'btn-floating blue waves-effect') {
        getId.className = 'btn-floating waves-effect yellow';
        getId.style = 'margin: 10px';

        arrayDados.push(rifanum);
        // console.log(rifanum);
        setFinishButtonCounter(counterButton + 1);
        if (finishButtonCounter >= 0) {
          setFinishButtonAppear(true);
        }
      } else {
        getId.className = 'btn-floating blue waves-effect';
        getId.style = 'margin: 5px';

        arrayDados.splice(arrayDados.indexOf(rifanum), 1);
        // console.log(arrayDados);
        // console.log(removerRifa);
        setFinishButtonCounter(counterButton - 1);

        if (finishButtonCounter <= 1) {
          setFinishButtonAppear(false);
        }
      }
      //console.log(event.target);
    }
  };

  // const callPayment = () => {
  //   setModalOpen(true);
  // };

  const handleChangeNameValue = (event) => {
    const saveName = event.target.value;
    setSavedName(saveName);
    // console.log(saveName);
  };
  const handleChangeTelefoneValue = (event) => {
    const saveTelefone = event.target.value;
    setSavedTelefone(saveTelefone);
    // console.log(saveTelefone);
  };

  const handleFormSubimit = async (event) => {
    event.preventDefault();
    //console.log(arrayDados);
    const lista = [];

    arrayDados.forEach(async (rifavalue) => {
      const newData = {
        id: ++allGrades.length,
        rifanumber: rifavalue,
        client: savedName,
        telefone: savedTelefone,
        baixa: false,
      };

      lista.push(newData);
      // await api.insertGrade(newData);

      //console.log(lista);
    });
    for (let i = 0; i < lista.length; i++) {
      await api.insertGrade(lista[i]);
    }
  };
  const handleTodosButton = () => {
    if (!validaClick) {
      setFinishButtonAppear(false);
      setFinishButtonCounter(0);
      setArrayDados([]);

      setValidaClick(true);
      setSuaRifa(true);
      setDisRifa(false);
    }
  };
  const handleDisponiveisButton = () => {
    //console.log('disponivel');
    if (!disRifa) {
      setFinishButtonAppear(false);
      setFinishButtonCounter(0);
      setArrayDados([]);

      const disponiveis = allGrades.map((grade) => parseInt(grade.rifanumber));
      let acertos = [];
      for (let i = 1; i < array.length; i++) {
        if (disponiveis.indexOf(array[i]) < 0) {
          acertos.push(array[i]);
        }
      }
      const finalRifa = allGrades.filter(
        (grade) => parseInt(grade.rifanumber) === 999
      );
      if (finalRifa.length === 0) {
        acertos.push(999);
      }
      acertos.sort((a, b) => a - b);
      setDisponiveisRifas(acertos);
      // console.log(disponiveisRifas);
      setValidaClick(false);
      setSuaRifa(false);
      setDisRifa(true);
    }
  };
  const handleReservadosButton = () => {
    //console.log('reservado');
    //setValidaClick(false);
  };
  const handlePagosButton = () => {
    setFinishButtonAppear(false);
    setFinishButtonCounter(0);
    setArrayDados([]);

    setValidaClick(false);
    setSuaRifa(true);
    setDisRifa(false);
    allGrades.sort((a, b) => a - b);
    //  console.log(allGrades);
  };

  const handleSuaRifaButton = () => {
    const rifaFilter = allGrades.filter(
      (grade) => grade.telefone === savedTelefone
    );
    const rifanum = rifaFilter.map((grade) => grade.rifanumber);
    rifanum.sort((a, b) => a - b);
    setSuaRifaNum(rifanum);
    setSuaRifa(false);
    setDisRifa(false);
    setValidaClick(false);
  };

  const handleCloseRifa = () => {
    document.location.reload(true);
  };
  return (
    <div className="App">
      <div className="flex">
        <button
          onClick={handleTodosButton}
          id="download-button"
          className="btn-large waves-effect waves-light blue"
        >
          Todos ({countBoxes})
        </button>
        <button
          onClick={handleDisponiveisButton}
          id="download-button"
          className="btn-large waves-effect waves-light blue"
        >
          Disponíveis ({countBoxes - disponiveisBoxes})
        </button>

        <button
          onClick={handleReservadosButton}
          id="download-button"
          className="btn-large waves-effect waves-light green"
        >
          Reservados ({reservadoBoxes})
        </button>
        <button
          onClick={handlePagosButton}
          id="download-button"
          className="btn-large waves-effect waves-light orange"
        >
          Pagos ({pagoBoxes})
        </button>
        <button
          id="download-button"
          data-target="modalsuarifa"
          className="btn-large waves-effect waves-light blue btn modal-trigger"
        >
          Sua Rifa
        </button>
      </div>
      <br />
      <br />
      {allGrades.length === 0 && <Spinner />}
      {validaClick && suaRifa && (
        <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap' }}>
          {array.map((item) => (
            <button
              key={item}
              className={`${
                allGrades.filter(
                  (grade) =>
                    parseInt(grade.rifanumber) === item + 1 &&
                    grade.baixa === true
                ).length === 1
                  ? 'btn-floating orange btn modal-trigger'
                  : 'Erro'
                  ? allGrades.filter(
                      (grade) =>
                        parseInt(grade.rifanumber) === item + 1 &&
                        grade.baixa === false
                    ).length === 1
                    ? 'btn-floating green btn modal-trigger'
                    : 'btn-floating blue waves-effect'
                  : 'Erro'
              }`}
              onMouseOver={InformacaoRifa}
              data-tip
              data-for="cliente"
              data-target={`${!onlyGradeName ? false : 'modalPago'}`}
              id={item + 1}
              style={{ margin: '5px' }}
              onClick={handleChangeBoxes}
            >
              {item + 1}
            </button>
          ))}

          <ReactTooltip
            id="cliente"
            backgroundColor={`${
              onlyGradeName.length > 0 && onlySituacao === true
                ? 'orange'
                : 'Erro'
                ? onlyGradeName.length > 0 && onlySituacao === false
                  ? 'green'
                  : 'blue'
                : 'Erro'
            }`}
            effect="solid"
          >
            <span>{`${
              onlyGradeName.length > 0 && onlySituacao === true
                ? `Rifa ${onlyAtualRifa} paga por: ${onlyGradeName[0].substr(
                    0,
                    3
                  )}...${onlyGradeName[0].substr(-3)}`
                : 'Erro'
                ? onlyGradeName.length > 0 && onlySituacao === false
                  ? `Rifa ${onlyAtualRifa} reservada por: ${onlyGradeName[0].substr(
                      0,
                      3
                    )}...${onlyGradeName[0].substr(-3)}`
                  : 'Rifa Disponível'
                : 'Erro'
            }`}</span>
          </ReactTooltip>
        </div>
      )}
      {!validaClick && !suaRifa && disRifa && (
        <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap' }}>
          {disponiveisRifas.map((disrifa) => (
            <button
              key={disrifa}
              className="btn-floating blue waves-effect"
              onMouseOver={InformacaoRifa}
              data-tip
              data-for="discliente"
              id={disrifa}
              style={{ margin: '5px' }}
              onClick={handleChangeBoxes}
            >
              {disrifa}
            </button>
          ))}
          <ReactTooltip id="discliente" backgroundColor="blue" effect="solid">
            <span>Rifa Disponível</span>
          </ReactTooltip>
        </div>
      )}

      {!validaClick && suaRifa && (
        <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap' }}>
          {rifasPagas.map((rifa) => (
            <button
              key={rifa}
              className="btn-floating orange btn modal-trigger"
              onMouseOver={InformacaoRifa}
              data-tip
              data-for="cliente"
              data-target={`${!onlyGradeName ? false : 'modalPago'}`}
              id={rifa}
              style={{ margin: '5px' }}
              onClick={handleChangeBoxes}
            >
              {rifa}
            </button>
          ))}
          <ReactTooltip id="cliente" backgroundColor="orange" effect="solid">
            <span>{`${
              onlyGradeName.length > 0
                ? `Rifa ${onlyAtualRifa} paga por: ${onlyGradeName[0].substr(
                    0,
                    3
                  )}...${onlyGradeName[0].substr(-3)}`
                : 'Erro'
            }`}</span>
          </ReactTooltip>
        </div>
      )}

      {!suaRifa && !disRifa && (
        <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap' }}>
          {suaRifaNum.map((rifafil) => (
            <button
              key={rifafil}
              className={`${
                allGrades.filter(
                  (grade) =>
                    grade.rifanumber === rifafil && grade.baixa === true
                ).length === 1
                  ? 'btn-floating orange btn modal-trigger'
                  : 'Erro'
                  ? allGrades.filter(
                      (grade) =>
                        grade.rifanumber === rifafil && grade.baixa === false
                    ).length === 1
                    ? 'btn-floating green btn modal-trigger'
                    : 'btn-floating red waves-effect'
                  : 'Erro'
              }`}
              onMouseOver={InformacaoRifa}
              data-tip
              data-for="cliente"
              data-target={`${!onlyGradeName ? false : 'modalPago'}`}
              id={rifafil}
              style={{ margin: '5px' }}
              onClick={handleChangeBoxes}
            >
              {rifafil}
            </button>
          ))}
          <ReactTooltip
            id="cliente"
            backgroundColor={`${
              onlyGradeName.length > 0 && onlySituacao === true
                ? 'orange'
                : 'Erro'
                ? onlyGradeName.length > 0 && onlySituacao === false
                  ? 'green'
                  : 'blue'
                : 'Erro'
            }`}
            effect="solid"
          >
            <span>{`${
              onlyGradeName.length > 0 && onlySituacao === true
                ? `Rifa ${onlyAtualRifa} paga por: ${onlyGradeName[0].substr(
                    0,
                    3
                  )}...${onlyGradeName[0].substr(-3)}`
                : 'Erro'
                ? onlyGradeName.length > 0 && onlySituacao === false
                  ? `Rifa ${onlyAtualRifa} reservada por: ${onlyGradeName[0].substr(
                      0,
                      3
                    )}...${onlyGradeName[0].substr(-3)}`
                  : 'Rifa Disponível'
                : 'Erro'
            }`}</span>
          </ReactTooltip>
        </div>
      )}

      {finishButtonAppear && (
        <div className="fixed-action-btn">
          <button
            data-target="modal1"
            className="btn-floating waves-effect btn-large cyan btn modal-trigger pulse"
            // onClick={callPayment}
          >
            <i className="large material-icons">done</i>
          </button>
        </div>
      )}
      <div id="modal1" className="modal">
        <div className="modal-content">
          <h4>Pagar Rifa</h4>
          <p>{`Rifa número: ${arrayDados.sort((a, b) => a - b)}`}</p>
          <div className="input-field">
            <input
              id="inputName"
              type="text"
              onChange={handleChangeNameValue}
            />
            <label className="active" htmlFor="inputName">
              Nome e Sobrenome:
            </label>
          </div>
          <div className="input-field">
            <input
              id="inputTel"
              type="text"
              onChange={handleChangeTelefoneValue}
              placeholder="(00)00000-0000"
            />
            <label className="active" htmlFor="inputTel">
              Número para Contato:
            </label>
          </div>
        </div>
        <div className="modal-footer">
          <button
            disabled={savedTelefone.length === 0}
            onClick={handleFormSubimit}
            className="modal-close waves-effect waves-green btn-flat modal-trigger"
            data-target="finalmodal"
          >
            Salvar
          </button>
          <button className="modal-close waves-effect waves-red btn-flat">
            Cancelar
          </button>
        </div>
      </div>

      <div id="modalsuarifa" className="modal">
        <div className="modal-content">
          <h4>Buscar sua Rifa</h4>
          <div className="input-field">
            <input
              id="inputTelRifa"
              type="text"
              placeholder="(00)00000-0000"
              onChange={handleChangeTelefoneValue}
            />
            <label className="active" htmlFor="inputTelRifa">
              Digite o número de telefone utilizado para reservar a rifa:
            </label>
          </div>
        </div>
        <div className="modal-footer">
          <button
            onClick={handleSuaRifaButton}
            className="modal-close waves-effect waves-green btn-flat"
          >
            Buscar
          </button>
          <button className="modal-close waves-effect waves-red btn-flat">
            Cancelar
          </button>
        </div>
      </div>

      <div id="modalPago" className="modal">
        <div style={{ color: 'red' }} className="modal-content">
          <h4>Aviso</h4>
          <p>Essa Rifa não está disponível.</p>
        </div>
        <div className="modal-footer">
          <button className="modal-close waves-effect waves-green btn-flat">
            Ok
          </button>
        </div>
      </div>

      <div id="finalmodal" className="modal">
        <div className="modal-content">
          <h4>
            <i className="medium material-icons">done</i>Parabéns!
          </h4>
          <hr style={{ color: 'black' }} />
          <div>
            <p>A reserva foi realizada com sucesso!</p>
            <p>
              Lembre-se de enviar o comprovante de pagamento{' '}
              <span style={{ color: 'red' }}>via WhatsApp em até 24h!</span>
            </p>
            <p>
              Caso não envie o comprovante no prazo, perderá a reserva
              selecionada.
            </p>
            <p>Agradecemos seu apoio!</p>
          </div>
        </div>
        <div className="modal-footer">
          <button
            onClick={handleCloseRifa}
            className="modal-close waves-effect waves-green btn-flat btn"
          >
            OK
          </button>
        </div>
      </div>

      <div id="openwindowmodal" className="modal">
        <div className="modal-content">
          <h4>Bem-vindo!</h4>
          <hr style={{ color: 'black' }} />
          <div>
            <p>Nós vamos nos casar, Anna Bia e Felipe Junio!</p>
            <p>Rifas no valor de R$ 40,00 cada.</p>
            <p>Agradecemos seu apoio!</p>
          </div>
        </div>
        <button className="modal-close waves-effect waves-green btn-flat btn center">
          OK
        </button>
        <div className="modal-footer">
          <button
            id="infowindowbutton"
            className="left modal-close waves-effect waves-green btn-flat btn"
          >
            Não mostrar mais essa mensagem
          </button>
        </div>
      </div>
    </div>
  );
}
