import { Component, OnInit } from '@angular/core';
import { Post } from './posts.model';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  storedPosts: Post[];
  constructor() { }

  ngOnInit(): void {
  }

  onPostAdded(post) {
    this.storedPosts.push(post);
  }

}
