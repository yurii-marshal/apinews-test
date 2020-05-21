import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardService } from '../../core/services/dashboard.service';
import { NewsItem } from '../models/news-item.model';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import { Params } from '../models/params.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit, OnDestroy {
  public filterForm: FormGroup;
  public newsItems: NewsItem[] = [];
  public pagination = {
    rotate: false,
    maxSize: 8,
    totalItems: 0,
    boundaryLinks: true
  };
  public tableColumns = [
    {title: 'Превью картинки', name: 'urlToImage'},
    {title: 'Название', name: 'title'},
    {title: 'Автор', name: 'author'},
    {title: 'Описание', name: 'description'},
    {title: 'Дата создания', name: 'publishedAt'},
  ];
  public isDataLoading = false;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    public dashboardService: DashboardService
  ) {
  }

  ngOnInit(): void {
    this.filterForm = new FormGroup({
      filterName: new FormControl(''),
      filterCountry: new FormControl(),
      filterCategory: new FormControl(),
    });

    this.filterForm.controls.filterName.valueChanges
      .pipe(
        debounceTime(500),
        filter(data => data.length > 2 || !data),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(value => {
        const params: Params = {
          pageSize: 10,
          page: 1,
          q: value,
          country: this.filterForm.controls.filterCountry.value,
          category: this.filterForm.controls.filterCategory.value,
        };

        this.loadNews(params);
      });

    this.filterForm.controls.filterCountry.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.changeSelection();
      });

    this.filterForm.controls.filterCategory.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.changeSelection();
      });

    this.loadNews({pageSize: 10, page: 1});
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public pageChanged(ev: { page: number, totalItems: number }): void {
    const params: Params = {
      pageSize: 10,
      page: ev.page,
      q: this.filterForm.controls.filterName.value,
      country: this.filterForm.controls.filterCountry.value,
      category: this.filterForm.controls.filterCategory.value,
    };
    this.loadNews(params);
  }

  private loadNews(params: Params): void {
    this.isDataLoading = true;
    this.dashboardService.getNews(params)
      .subscribe((data: any) => {
        this.pagination.totalItems = data.totalResults;
        this.newsItems = data.articles;
        this.isDataLoading = false;
      }, () => {
        this.newsItems = [];
        this.isDataLoading = false;
      });
  }

  private changeSelection(): void {
    const params: Params = {
      pageSize: 10,
      page: 1,
      q: this.filterForm.controls.filterName.value,
      country: this.filterForm.controls.filterCountry.value,
      category: this.filterForm.controls.filterCategory.value,
    };

    this.loadNews(params);
  }

}
