import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { CommentModel } from '../../models/comment.model';

@Injectable({
    providedIn: 'root',
})

export class CommentService {

    constructor(private apiService: ApiService) {}

    async createComment(postId: number, content: string): Promise<CommentModel> {
        return this.apiService.postData('api/Comment/Created', {postId, content});
    }

    async getComments(postId: number): Promise<CommentModel> {
        return this.apiService.getDataWithParams('api/Comment/GetComent', {postId} );
    }

}
