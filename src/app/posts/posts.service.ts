import { Subject } from 'rxjs';
import { Post } from './posts.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private postUpdates = new Subject<Post[]>();
  private posts: Post[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    // this requests will not be send if we donot subscribe to it
    // we donot need to unsubscribe using ondestroy as it will be handled by angular automatically
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map((postData) => {
          return postData.posts.map((post) => {
            return {
              title: post.title,
              content: post.content,
              Id: post._id,
            };
          });
        })
      )
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postUpdates.next([...this.posts]);
      });
    // return this.posts;
  }

  getPostById(id: string) {
    return this.http.get<{ _id: string; title: string; content: string }>(
      'http://localhost:3000/api/posts/' + id
    );
  }

  getPostUpdateListener() {
    // Event Listener Created
    return this.postUpdates.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    // const post: Post = { Id: null, title: title, content: content };
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{ message: string; postId: string }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe((responseData) => {
        const post: Post = {
          Id: responseData.postId,
          title: title,
          content: content,
        };
        // post.Id = responseData.postId;
        this.posts.push(post);
        this.postUpdates.next([...this.posts]); // Emiting the event
        this.router.navigate(['/']);
      });
  }

  updatePost(postId: string, postTitle: string, postContent: string) {
    const post: Post = { Id: postId, title: postTitle, content: postContent };
    this.http
      .put('http://localhost:3000/api/posts/' + postId, post)
      .subscribe((response) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex((p) => p.Id === post.Id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postUpdates.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId) {
    this.http
      .delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter((post) => post.Id !== postId);
        this.posts = updatedPosts;
        this.postUpdates.next([...this.posts]);
      });
  }
}
