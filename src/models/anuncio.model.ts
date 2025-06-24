export interface Anuncio {
  id?: number;
  imagem: string;
  url: string;
  position: AdPosition;
  dataExpiracao: string;
}

export type AdPosition = 'MAIN_TOP' | 'MAIN_MIDDLE' | 'NEWS_RIGHT';
