import {
  Dimensions,
  StyleSheet,
} from 'react-native';

const { width } = Dimensions.get('window');

const PADDING_HORIZONTAL = 18;
const ESPACO_ENTRE_CARDS = 14;

const LARGURA_CARD =
  (
    width -
    PADDING_HORIZONTAL * 2 -
    ESPACO_ENTRE_CARDS
  ) / 2;

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#040404',
  },

  container: {
    flex: 1,
    backgroundColor: '#040404',
  },

  header: {
    width: '100%',
    minHeight: 70,
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingTop: 8,
    paddingBottom: 12,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2C2C2E',
  },

  titulo: {
    color: '#FFFFFF',
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

    botaoPrimeiroProjeto: {
    marginTop: 22,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FF453A',
    borderRadius: 12,
  },

  textoBotaoPrimeiroProjeto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  botaoAdicionar: {
    width: 38,
    height: 38,
    borderRadius: 19,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#1C1C1E',
  },

  botaoAdicionarPressionado: {
    opacity: 0.65,
    transform: [
      {
        scale: 0.94,
      },
    ],
  },

  iconeAdicionar: {
    color: '#FF453A',
    fontSize: 30,
    lineHeight: 32,
    fontWeight: '300',
    textAlign: 'center',
  },

  lista: {
    flexGrow: 1,
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingTop: 18,

    // Espaço para a tab bar transparente.
    paddingBottom: 115,
  },

  linhaProjetos: {
    justifyContent: 'space-between',
  },

  cardProjeto: {
    width: LARGURA_CARD,
    aspectRatio: 0.82,
    marginBottom: 16,

    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    overflow: 'hidden',

    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#38383A',
  },

  cardProjetoPressionado: {
    opacity: 0.75,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  imagemProjeto: {
    width: '100%',
    flex: 1,
    backgroundColor: '#2C2C2E',
  },

  rodapeCard: {
    minHeight: 44,
    paddingHorizontal: 12,
    justifyContent: 'center',
    backgroundColor: '#1C1C1E',
  },

  tituloProjeto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  estadoVazio: {
    flex: 1,
    minHeight: 300,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 35,
    paddingBottom: 50,
  },

  tituloEstadoVazio: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '600',
    marginBottom: 8,
  },

  textoEstadoVazio: {
    color: '#8E8E93',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
});