import { tutorResponse } from './tutorResponse';

export class Tutor {
  static tutorJSON(obj: tutorResponse) {
    return new Tutor(obj['dni'], obj['nombre']);
  }

  constructor(public dni: string, public nombre: string) {}
}
