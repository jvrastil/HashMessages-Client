import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as CryptoJS from 'crypto-js';

import { Message } from '../../models/message';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private readonly newMessageUrl = 'add-new-message';
  private readonly getMessagesUrl = 'messages';

  constructor(private http: HttpClient) {}

  getMessages(): Promise<Message[]> {
    return this.http.get<Message[]>(this.getMessagesUrl).toPromise();
  }

  postNewMessage(msg: Message): Promise<Message> {
    return this.http.post<Message>(this.newMessageUrl, msg).toPromise();
  }

  encrypt(msg: string, salt: string, pass: string): string {
    const keySize = 256;
    const iterations = 100;

    const key = CryptoJS.PBKDF2(pass, salt, {
      keySize: keySize / 32,
      iterations,
    });

    const iv = CryptoJS.lib.WordArray.random(128 / 8);

    const encrypted = CryptoJS.AES.encrypt(msg, key, {
      iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });

    const transitmessage = encrypted.toString();
    return transitmessage;
  }

  decrypt(transitmessage: string, salt: string, pass: string): string {
    const keySize = 256;
    const iterations = 100;

    const key = CryptoJS.PBKDF2(pass, salt, {
      keySize: keySize / 32,
      iterations,
    });

    const decrypted = CryptoJS.AES.decrypt(transitmessage, key, {
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  getHashedTitle(title: string, encryptionKey: string): string {
    return CryptoJS.HmacSHA384(title, encryptionKey).toString();
  }
}
