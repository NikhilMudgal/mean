import { Component, OnInit } from '@angular/core';
import { Post } from '../posts.model';
import { NgForm } from '@angular/forms';
import { PostService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  title = '';
  content = '';
  constructor(private postService: PostService) { }

  ngOnInit(): void {}

  onAddPost(form: NgForm) {
    if (form.valid) {
      this.postService.addPost(form.value.title, form.value.content);
      form.resetForm();
    }
  }
  getErrorMessage() {
    return 'This Field is required';
  }
}
