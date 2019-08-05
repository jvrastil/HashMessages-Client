import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tag } from '../../models/tag';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private readonly newTagUrl = 'add-new-tag';
  private readonly getTagsUrl = 'messages';

  constructor(private http: HttpClient) { }

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.getTagsUrl);
  }

  addNewTag(tag: Tag): Promise<Tag> {
    return this.http.post<Tag>(this.newTagUrl, JSON.stringify(tag)).toPromise();
  }
}
