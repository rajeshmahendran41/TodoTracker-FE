import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http'; 
import { Observable } from 'rxjs/Rx';

import { Todo, TodoStatus } from './app';

@Injectable()
export class TodoService {
    private API_URL: string = "https://todotracker-be.herokuapp.com/api";
    constructor( private _httpService: Http ){}

    public createTodo(title: string, description: string): Observable<any> {
        let requestObj = { 
            "todoDetails": {
                "title": title,
                "description": description
            } 
        };
        return this._httpService.post(`${this.API_URL}/todo`, JSON.stringify(requestObj), this.generateHeaderOptions())
        .map((response: Response) => {
            let data = response.json() || {};
            return data;
        })
        .catch(this.failure);
    }
    public getTodos(filterCriteria?:string): Observable<any> {
        return this._httpService.get(`${this.API_URL}/todo/list${filterCriteria ? '?status='+filterCriteria : ''}`, this.generateHeaderOptions())
        .map((response: Response) => {
            let data = response.json() || {};
            return data;
        })
        .catch(this.failure);
    }
    public updateTodo(param: Todo): Observable<any> {
        let requestObj = { 
            "todoDetails": {
                id: param.id,
                title: param.title,
                description: param.description,
                statusId: param.status ? TodoStatus['COMPLETED'].id : TodoStatus['PENDING'].id 
            }
        };
        return this._httpService.put(`${this.API_URL}/todo`, JSON.stringify(requestObj), this.generateHeaderOptions())
        .map((response: Response) => {
            let data = response.json() || {};
            return data;
        })
        .catch(this.failure);
    }
    public deleteTodo(param: Todo): Observable<any> {
        return this._httpService.delete(`${this.API_URL}/todo/${param.id}`, this.generateHeaderOptions())
        .map((response: Response) => {
            let data = response.json() || {};
            return data;
        })
        .catch(this.failure);
    }
    
    private generateHeaderOptions(): RequestOptions {
        let headers = new Headers();
        let requestOptions = new RequestOptions();
        headers.append('Accept', '*/*');
        headers.append('Content-Type', 'application/json');
        requestOptions.headers = headers;
        requestOptions.withCredentials = true;
        return requestOptions;
    }

    private failure(error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
    }
}


