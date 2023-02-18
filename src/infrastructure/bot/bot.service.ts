import { Injectable } from '@nestjs/common';
import { Bot } from '@domain/bot/bot.interface';

@Injectable()
export class BotService implements Bot {
  error(): string {
    return 'Lo sentimos, no pudimos procesar tu solicitud';
  }

  help(): string {
    return 'Para descargar tu CV por favor envíame un enlace de Resume.io';
  }

  noFile(): string {
    return 'No se encontró ningún archivo en el enlace, por favor intente luego nuevamente';
  }

  noUrlMessage(): string {
    return 'No se encontró un enlace válido en el mensaje';
  }

  welcome(): string {
    return 'Bienvenido, para descargar tu CV por favor envíame un enlace de Resume.io, si necesitas ayuda puedes escribir /help';
  }
}
