import { Subject } from 'rxjs';
import { Post } from './posts.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class PostService {
  private postUpdates = new Subject<Post[]>();
  private posts: Post[] = [];

  constructor(private http: HttpClient) {  }

  getPosts() {
    // this requests will not be send if we donot subscribe to it
    // we donot need to unsubscribe using ondestroy as it will be handled by angular automatically
    this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
    .subscribe((postData) => {
      this.posts = postData.posts;
      this.postUpdates.next([...this.posts]);
    });
    // return this.posts;
  }

  getPostUpdateListener() {  // Event Listener Created
    return this.postUpdates.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { Id: null, title: title, content: content};
    this.posts.push(post);
    this.postUpdates.next([...this.posts]);  // Emiting the event
  }
}
