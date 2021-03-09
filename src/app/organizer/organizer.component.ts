import { Component, OnInit } from '@angular/core';
import {DateService} from '../shared/date.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Task, TasksService} from '../shared/tasks.service';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.css']
})
export class OrganizerComponent implements OnInit {

  public form: FormGroup;
  public tasks: Task[] = [];
  constructor(
    public dateService: DateService,
    public taskService: TasksService
  ) { }

  ngOnInit(): void {
    this.dateService.date.pipe(
      switchMap(value => this.taskService.load(value))
    ).subscribe((tasks) => {
      this.tasks = tasks;
    });
    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    });
  }

  public submit(): void {
    const {title} = this.form.value;
    const task: Task = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY')
    };

    this.taskService.create(task).subscribe((task) => {
      this.form.reset();
    }, err => {

    });
  }

}
