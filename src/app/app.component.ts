import {
  Component,
  inject,
  Injector,
  linkedSignal,
  resource,
  signal,
  WritableSignal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoDetailsComponent } from './components/todo-details/todo-details.component';
import { Comment, Post, PostService } from './services/post.service';
import { User, USERS } from './constants/users';
import { AlertComponent } from './components/alert/alert.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TodoListComponent,
    TodoDetailsComponent,
    AlertComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  postService = inject(PostService);
  injector = inject(Injector);
  users = signal(USERS);
  selectedUser = signal<User>(USERS[0]);

  selectedPost: WritableSignal<Post | null> = linkedSignal({
    source: this.selectedUser,
    computation: () => null,
  });

  userPosts = rxResource<Post[], User>({
    request: () => this.selectedUser(),
    loader: ({ request: user }) => {
      return this.postService.getPosts(user.id);
    },
  });

  postComments = rxResource<Comment[], Post | null>({
    request: () => this.selectedPost(),
    loader: ({ request: post }) => {
      if (!post) {
        return of([]);
      }
      return this.postService.getPostComments(post.id);
    },
  });

  // userPosts = resource<Post[], User>({
  //   request: () => this.selectedUser(),
  //   loader: ({ request: user }) => {
  //     return fetch(
  //       `https://jsonplaceholder.typicode.com/users/${user.id}/posts`
  //     ).then((res) => res.json());
  //   },
  // });

  // postComments = resource<Comment[], Post | null>({
  //   request: () => this.selectedPost(),
  //   loader: ({ request: post }) => {
  //     if (!post) {
  //       return Promise.resolve([]);
  //     }
  //     return fetch(
  //       `https://jsonplaceholder.typicodeaaaa.com/posts/${post.id}/comments`
  //     ).then((res) => res.json());
  //   },
  // });

  postClick(post: Post) {
    this.selectedPost.set(post);
  }
}
