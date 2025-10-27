import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { CommentModel } from '../../models/Coments/comment.model';
import { CreateCommentModel } from '../../models/Coments/CreateComent.model';

@Injectable({
    providedIn: 'root',
})

export class CommentService {

    constructor(private apiService: ApiService) {}

    async createComment(params: CreateCommentModel): Promise<CommentModel> {
        return this.apiService.postData('api/Comment/Created', {postid: params.postId, content: params.content});
    }

    async getComments(postId: number): Promise<CommentModel> {
        return this.apiService.getDataWithParams('api/Comment/GetComent', {postId} );
    }

}
