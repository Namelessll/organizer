import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

export interface Task {
  id?: string;
  title: string;
  date?: string;
}

interface CreateResponse {
  name: string;
}

@Injectable({
  providedIn: 'root'
})

export class TasksService {
  public static url = 'https://organizer-396c4-default-rtdb.firebaseio.com/tasks';
  constructor(private http: HttpClient) {
  }


  public load(date: moment.Moment): Observable<any> {
    return this.http
      .get<Task[]>(`${TasksService.url}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(map(tasks => {
        if (!tasks) {
          return [];
        } else {
          return Object.keys(tasks).map(key => ({...tasks[key], id: key}));
        }
      }));
  }

  public create(task: Task): Observable<Task> {
    return this.http.post<CreateResponse>(`${TasksService.url}/${task.date}.json`, task)
      .pipe(map(res => {
        return {...task, id: res.name};
      }));
  }
}
