import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DivisionService } from '../services/division.service';
import { Division } from '../models/division.model';

import { NzTableModule, NzTableSortOrder, NzTableSortFn, NzTableFilterFn } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { en_US, NZ_DATE_LOCALE } from 'ng-zorro-antd/i18n';
import { MenuComponent } from '../menu/menu.component';
import { CreateDivisionDialogComponent } from '../create-division/create-division.component';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';

interface ColumnItem {
  name: string;
  value: string;
  label: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<Division> | null;
  listOfFilter: { text: string; value: any; byDefault?: boolean }[];
  filterFn: NzTableFilterFn<Division> | null;
}

@Component({
  selector: 'app-divisions-table',
  templateUrl: './divisions-table.component.html',
  styleUrls: ['./divisions-table.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NzTableModule,
    NzInputModule,
    NzSelectModule,
    NzPaginationModule,
    NzIconModule,
    NzSpinModule,
    MenuComponent,
    NzModalModule
  ],
  providers: [DivisionService, NzModalModule, { provide: NZ_DATE_LOCALE, useValue: en_US }]
})
export class DivisionsTableComponent implements OnInit {

  divisions: Division[] = [];
  filteredDivisions: Division[] = [];
  pagedData: Division[] = [];
  isLoading = true;
  
  pageIndex = 1;
  pageSize = 10;
  
  searchText = '';
  selectedColumn = 'name';

  private safeLocaleCompare(a: string | null, b: string | null): number {
    if (a === null && b === null) return 0;
    if (a === null) return 1;
    if (b === null) return -1;
    return a.localeCompare(b);
  }

  columns: ColumnItem[] = [
    {
      name: 'Division',
      value: 'name',
      label: 'Division',
      sortOrder: null,
      sortFn: (a: Division, b: Division) => this.safeLocaleCompare(a.name, b.name),
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'División Superior',
      value: 'upper_division',
      label: 'División Superior',
      sortOrder: null,
      sortFn: (a: Division, b: Division) => {
        const aName = a.upper_division?.name || null;
        const bName = b.upper_division?.name || null;
        return this.safeLocaleCompare(aName, bName);
      },
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Colaboradores',
      value: 'number_collaborators',
      label: 'Colaboradores',
      sortOrder: null,
      sortFn: (a: Division, b: Division) => a.number_collaborators - b.number_collaborators,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Nivel',
      value: 'level',
      label: 'Nivel',
      sortOrder: null,
      sortFn: (a: Division, b: Division) => a.level - b.level,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Subdivisiones',
      value: 'subdivisions',
      label: 'Subdivisiones',
      sortOrder: null,
      sortFn: (a: Division, b: Division) => a.subdivisionCount - b.subdivisionCount,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Embajador',
      value: 'ambassador',
      label: 'Embajador',
      sortOrder: null,
      sortFn: (a: Division, b: Division) => this.safeLocaleCompare(a.ambassador, b.ambassador),
      listOfFilter: [],
      filterFn: null
    }
  ];

  constructor(private divisionService: DivisionService,
    private modalService: NzModalService ) {}

  ngOnInit(): void {
    this.loadDivisions();
  }

  loadDivisions(): void {
    this.isLoading = true;
    this.divisionService.getDivisions().subscribe({
      next: (data) => {
        this.divisions = data;
        this.setupFilters();
        this.onSearch();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching divisions:', error);
        this.isLoading = false;
      }
    });
  }

  setupFilters(): void {
    this.columns = this.columns.map(column => {
      if (column.value === 'level') {
        const uniqueLevels = [...new Set(this.divisions.map(d => d.level))];
        column.listOfFilter = uniqueLevels.map(level => ({
          text: `Nivel ${level}`,
          value: level
        }));
        column.filterFn = (list: number[], item: Division) => 
          list.includes(item.level);
      }

      if (column.value === 'number_collaborators') {
        const uniqueCollaborators = [...new Set(this.divisions.map(d => d.number_collaborators))];
        column.listOfFilter = uniqueCollaborators.map(collaborator => ({
          text: `${collaborator} Colaboradores`,
          value: collaborator
        }));
        column.filterFn = (list: number[], item: Division) => 
          list.includes(item.number_collaborators);
      }

      if (column.value === 'subdivisions') {
        const uniqueSubdivisions = [...new Set(this.divisions.map(d => d.subdivisionCount))];
        column.listOfFilter = uniqueSubdivisions.map(subdivision => ({
          text: `${subdivision} Subdivisiones`,
          value: subdivision
        }));
        column.filterFn = (list: number[], item: Division) =>
          list.includes(item.subdivisionCount);
      }
      
      if (column.value === 'ambassador') {
        const uniqueAmbassadors = [...new Set(this.divisions.map(d => d.ambassador))];
        column.listOfFilter = uniqueAmbassadors
          .filter(ambassador => ambassador)
          .map(ambassador => ({
            text: ambassador,
            value: ambassador
          }));
        column.filterFn = (list: string[], item: Division) => 
          list.includes(item.ambassador);
      }

      if (column.value === 'upper_division') {
        const uniqueUpperDivisions = Array.from(
          new Set(
            this.divisions
              .map(d => d.upper_division?.name)
              .filter((name): name is string => !!name)
          )
        );
      
        column.listOfFilter = uniqueUpperDivisions.map(name => ({
          text: name,
          value: name
        }));
      
        column.filterFn = (selectedNames: string[], item: Division) =>
          !!item.upper_division?.name && selectedNames.includes(item.upper_division.name);
      }
      
      
  
      if (column.value === 'name') {
        const uniqueNames = [...new Set(this.divisions.map(d => d.name))];
        column.listOfFilter = uniqueNames
          .filter(name => name)
          .map(name => ({
            text: name,
            value: name
          }));
        column.filterFn = (list: string[], item: Division) => 
          list.includes(item.name);
      }
  
      return column;
    });
  }

  onFilterChange(filterList: any[], columnName: string): void {
    const column = this.columns.find(c => c.value === columnName);
    if (column && column.filterFn) {
      this.filteredDivisions = this.divisions.filter(item => 
        filterList.length === 0 || column.filterFn!(filterList, item)
      );
      this.pageIndex = 1;
      this.updatePagedData();
    }
  }

  onSearch(): void {
    const searchTerm = this.searchText.toLowerCase().trim();
  
    if (searchTerm === '') {
      this.filteredDivisions = [...this.divisions];
    } else {
      this.filteredDivisions = this.divisions.filter(item => {
        let fieldValue: string = '';
  
        switch (this.selectedColumn) {
          case 'upper_division':
            fieldValue = item.upper_division?.name?.toLowerCase() || '';
            break;
          case 'subdivisions':
            fieldValue = item.subdivisionCount?.toString() || '';
            break;
          case 'number_collaborators':
            fieldValue = item.number_collaborators?.toString() || '';
            break;
          case 'level':
            fieldValue = item.level?.toString() || '';
            break;
          default:
            const raw = item[this.selectedColumn as keyof Division];
            fieldValue = (raw !== null && raw !== undefined) ? String(raw).toLowerCase() : '';
        }
  
        return fieldValue.includes(searchTerm);
      });
    }
  
    this.pageIndex = 1;
    this.updatePagedData();
  }
  

  onSort(sortColumn: string, sortOrder: NzTableSortOrder): void {
    const column = this.columns.find(c => c.value === sortColumn);
    if (!column || !sortOrder) return;
  
    this.columns.forEach(c => c.sortOrder = null);
    column.sortOrder = sortOrder;
  
    this.filteredDivisions = [...this.filteredDivisions].sort((a, b) => {
      const result = column.sortFn!(a, b);
      return sortOrder === 'ascend' ? result : -result;
    });
  
    this.pageIndex = 1;
    this.updatePagedData();
  }

  updatePagedData(): void {
    const start = (this.pageIndex - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedData = this.filteredDivisions.slice(start, end);
  }

  onPageIndexChange(): void {
    this.updatePagedData();
  }

  onPageSizeChange(): void {
    this.pageIndex = 1;
    this.updatePagedData();
  }

  openCreateDivisionDialog(): void {
    const modal = this.modalService.create({
      nzTitle: 'Crear Nueva División',
      nzContent: CreateDivisionDialogComponent,
      nzFooter: null,
      nzWidth: '600px'
    });

    modal.afterClose.subscribe(result => {
      if (result) {
        this.loadDivisions();
      }
    });
  }

}