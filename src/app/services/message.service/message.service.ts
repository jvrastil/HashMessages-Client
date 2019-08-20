import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '../../models/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private readonly newMessageUrl = 'add-new-message';
  private readonly getMessagesUrl = 'messages';

  constructor(private http: HttpClient) { }

  getMessages(): Promise<Message[]> {
    return this.http.get<Message[]>(this.getMessagesUrl).toPromise();
  }

  postNewMessage(msg: Message): Promise<Message> {
    return this.http.post<Message>(this.newMessageUrl, msg).toPromise();
  }
}
