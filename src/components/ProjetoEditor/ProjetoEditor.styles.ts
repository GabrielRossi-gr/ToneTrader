import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#040404',
  },

  container: {
    flex: 1,
    backgroundColor: '#040404',
  },

  botaoConfiguracoes: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },

  botaoPressionado: {
    opacity: 0.55,
  },

  iconeHeader: {
    width: 25,
    height: 25,
  },

  areaImagem: {
    flex: 1,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000000',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#38383A',
  },

  imagem: {
    width: '100%',
    height: '100%',
  },

    carregamentoImagem: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    },

  textoCarregamento: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 12,
  },

  barraFerramentas: {
    minHeight: 78,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 6,
    backgroundColor: '#111111',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#38383A',
  },

  botaoFerramenta: {
    flex: 1,
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },

  botaoFerramentaPressionado: {
    backgroundColor: '#2C2C2E',
    opacity: 0.75,
  },

  botaoDesabilitado: {
    opacity: 0.35,
  },

  iconeFerramenta: {
    width: 25,
    height: 25,
  },

  textoFerramenta: {
    color: '#FFFFFF',
    fontSize: 11,
    marginTop: 5,
  },

  textoFerramentaDestaque: {
    color: '#FF453A',
    fontWeight: '600',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },

    modalFundo: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    },

  menuConfiguracoes: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 28,
  },

  indicadorMenu: {
    width: 38,
    height: 5,
    alignSelf: 'center',
    backgroundColor: '#636366',
    borderRadius: 3,
    marginBottom: 18,
  },

  tituloConfiguracoes: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '700',
    marginBottom: 18,
  },

  opcaoExcluir: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    backgroundColor: '#2C2C2E',
    borderRadius: 13,
  },

  opcaoPressionada: {
    opacity: 0.55,
  },

  iconeConfiguracao: {
    width: 24,
    height: 24,
    marginRight: 12,
  },

  textoOpcaoExcluir: {
    color: '#FF453A',
    fontSize: 17,
    fontWeight: '500',
  },

  botaoCancelar: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    backgroundColor: '#2C2C2E',
    borderRadius: 13,
  },

  textoCancelar: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },

  projetoNaoEncontrado: {
    flex: 1,
    backgroundColor: '#040404',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  tituloProjetoNaoEncontrado: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '600',
    marginBottom: 18,
  },

  botaoVoltarProjetos: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
  },

  textoBotaoVoltarProjetos: {
    color: '#FF453A',
    fontSize: 16,
    fontWeight: '600',
  },
});