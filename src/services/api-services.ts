import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environments/environment.local";
import { Recipe } from "../models/recipe.model";

@Injectable({
  providedIn: 'root',
})
export class ApiService{
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient){};

    getAPI(): Observable<any>{
        return this.http.get<Recipe[]>(this.apiUrl);
    }
}