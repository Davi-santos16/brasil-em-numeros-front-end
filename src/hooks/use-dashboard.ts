import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { ServicoPainel } from '@/services/dashboard.service';
import type { RespostaPainel } from '@/services/dashboard.service';
import { IndicadoresService } from '@/services/indicadores.service';
import type { IndicadoresResponse } from '@/services/indicadores.service';
import type { Estado } from '@/services/estados.service';

function normalizarNome(nome: string, separador: '-' | '_') {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, separador);
}

export function useDashboard() {
  const [dados, setDados] = useState<RespostaPainel | null>(null);
  const [dadosEstado, setDadosEstado] = useState<IndicadoresResponse | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [carregandoEstado, setCarregandoEstado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [indicador, setIndicador] = useState('populacao');
  const [regiao, setRegiao] = useState('sudeste');
  const [estado, setEstado] = useState('');
  const [todosEstados, setTodosEstados] = useState<Estado[]>([]);

  const estadosFiltrados = useMemo(
    () =>
      todosEstados
        .filter(item => item.regiao && normalizarNome(item.regiao.nome, '-') === regiao)
        .sort((primeiro, segundo) => primeiro.nome.localeCompare(segundo.nome)),
    [todosEstados, regiao],
  );

  useEffect(() => {
    api.get('/estados')
      .then(resposta => {
        setTodosEstados(resposta.data.estados || resposta.data);
      })
      .catch(erroRequisicao => {
        console.error('Erro ao buscar estados:', erroRequisicao);
      });
  }, []);

  useEffect(() => {
    setCarregando(true);
    setErro(null);

    ServicoPainel.obterDadosPainel({ indicador, regiao })
      .then(setDados)
      .catch(erroRequisicao => {
        console.error(erroRequisicao);
        setErro(erroRequisicao.message);
      })
      .finally(() => setCarregando(false));
  }, [indicador, regiao]);

  useEffect(() => {
    if (!estado) {
      setDadosEstado(null);
      return;
    }

    const estadoEncontrado = todosEstados.find(
      item => item.sigla.toLowerCase() === estado.toLowerCase(),
    );

    if (!estadoEncontrado) return;

    setCarregandoEstado(true);
    IndicadoresService.getIndicadores({
      estado: normalizarNome(estadoEncontrado.nome, '_'),
    })
      .then(setDadosEstado)
      .catch(erroRequisicao => {
        console.error('Erro ao buscar indicadores do estado:', erroRequisicao);
      })
      .finally(() => setCarregandoEstado(false));
  }, [estado, todosEstados]);

  function selecionarIndicador(novoIndicador: string) {
    setEstado('');
    setIndicador(novoIndicador);
  }

  function selecionarRegiao(novaRegiao: string) {
    setEstado('');
    setRegiao(novaRegiao);
  }

  function selecionarEstado(novoEstado: string) {
    setEstado(novoEstado);

    const estadoEncontrado = todosEstados.find(
      item => item.sigla.toLowerCase() === novoEstado.toLowerCase(),
    );

    if (estadoEncontrado) {
      setRegiao(normalizarNome(estadoEncontrado.regiao.nome, '-'));
    }
  }

  return {
    dados,
    dadosEstado,
    carregando,
    carregandoEstado,
    erro,
    indicador,
    regiao,
    estado,
    todosEstados,
    estadosFiltrados,
    selecionarIndicador,
    selecionarRegiao,
    selecionarEstado,
  };
}
