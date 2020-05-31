import { Subject } from 'rxjs';
import { Post } from './posts.model';
export class PostService {
  private postUpdates = new Subject<Post[]>();
  private posts: Post[] = [];

  getPosts() {
    return this.posts;
  }

  getPostUpdateListener() {  // Event Listener Created
    return this.postUpdates.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { title: title, content: content};
    this.posts.push(post);
    this.postUpdates.next([...this.posts]);  // Emiting the event
  }
}
