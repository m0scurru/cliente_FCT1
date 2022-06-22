import { tutoriaResponse } from './tutoriaResponse';

export class Tutoria {
  static tutoriaJSON(obj: tutoriaResponse) {
    return new Tutoria(obj['grupo'], obj['dni_tutor']);
  }

  constructor(public grupo: string, public dni_tutor: string) {}
}
