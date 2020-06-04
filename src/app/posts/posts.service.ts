import { Subject } from 'rxjs';
import { Post } from './posts.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private postUpdates = new Subject<Post[]>();
  private posts: Post[] = [];

  constructor(private http: HttpClient) {}

  getPosts() {
    // this requests will not be send if we donot subscribe to it
    // we donot need to unsubscribe using ondestroy as it will be handled by angular automatically
    this.http
      .get<{ message: string; posts: any }>(
        'http://localhost:3000/api/posts'
      )
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            Id: post._id
          };
        });
      }))
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postUpdates.next([...this.posts]);
      });
    // return this.posts;
  }


  getPostUpdateListener() {
    // Event Listener Created
    return this.postUpdates.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { Id: null, title: title, content: content };
    this.http
      .post<{ message: string }>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        console.log(responseData.message);
        this.posts.push(post);
        this.postUpdates.next([...this.posts]); // Emiting the event
      });
  }

  deletePost(postId) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
    .subscribe(() => {
      const updatedPosts = this.posts.filter(post => post.Id !== postId);
      this.posts = updatedPosts;
      this.postUpdates.next([...this.posts]);
    });
  }

}
