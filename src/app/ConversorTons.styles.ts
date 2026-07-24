import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const TAMANHO_ROLETA = width * 0.8;
export const RAIO = TAMANHO_ROLETA / 2;

const DISTANCIA_CENTRO = 28;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#040404',
    alignItems: 'center',
    paddingTop: 35,
  },

  header: {
    width: '100%',
    paddingLeft: 20,
    marginBottom: 30,
    alignItems: 'flex-start',
  },

  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  trianguloIndicador: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 15,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FF0000',
    marginBottom: 10,
    zIndex: 10,
  },

  areaRoleta: {
    width: TAMANHO_ROLETA,
    height: TAMANHO_ROLETA,
    justifyContent: 'center',
    alignItems: 'center',
  },

  roleta: {
    width: TAMANHO_ROLETA,
    height: TAMANHO_ROLETA,
    borderRadius: RAIO,
    backgroundColor: '#B2B2B2',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    position: 'absolute',
    overflow: 'hidden',
  },

  fatiaNota: {
    position: 'absolute',
    width: TAMANHO_ROLETA,
    height: TAMANHO_ROLETA,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  textoNota: {
    marginTop: 15,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },

  textoNotaMenor: {
    marginTop: 45,
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },

  linhaFatia: {
    position: 'absolute',
    width: 1,
    height: RAIO,
    backgroundColor: '#636366',
    top: 0,
    left: RAIO - 0.5,
    transform: [{ rotate: '15deg' }],
    transformOrigin: 'bottom',
  },

  containerBraco: {
    position: 'absolute',
    width: 0,
    height: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  containerArcoCentro: {
    position: 'absolute',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },

  indicadorCentro: {
    position: 'absolute',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },

  pontoCentroLaranja: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  mascaraCentro: {
    position: 'absolute',
    width: 20,
    height: 40,
    backgroundColor: '#FF0000',
    top: -2,
    left: 7.5,
    borderRadius: 20,
  },

  bracoLaranja: {
    position: 'absolute',
    width: 4,
    height: RAIO * 0.15,
    backgroundColor: '#FF0000',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    bottom: DISTANCIA_CENTRO,
  },

  painelInfo: {
    marginTop: 16,
    alignItems: 'center',
  },

  textoInfo: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 0,
  },

  destaque: {
    fontWeight: 'bold',
  },

  destaqueDestino: {
    fontWeight: 'bold',
    color: '#FF0000',
    fontSize: 20,
  },

  textoSub: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 0,
  },

  containerSlider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginTop: 16,
  },

  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 15,
  },

  textoLimiteSlider: {
    color: '#8E8E93',
  },
});