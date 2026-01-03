import { Component, OnInit } from '@angular/core';
import { FamilyTreeService, FamilyTree } from '../../../core/services/family-tree.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FamilyTreeFormComponent } from '../family-tree-form/family-tree-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-family-tree-list',
  templateUrl: './family-tree-list.component.html',
  styleUrls: ['./family-tree-list.component.scss']
})
export class FamilyTreeListComponent implements OnInit {
  familyTrees: FamilyTree[] = [];
  loading = false;

  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];

  constructor(
    private familyTreeService: FamilyTreeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFamilyTrees();
  }

  loadFamilyTrees(): void {
    this.loading = true;
    this.familyTreeService.getAll().subscribe({
      next: (response) => {
        this.familyTrees = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading family trees', 'Close', { duration: 5000 });
        this.loading = false;
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(FamilyTreeFormComponent, {
      width: '500px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadFamilyTrees();
      }
    });
  }

  openEditDialog(familyTree: FamilyTree): void {
    const dialogRef = this.dialog.open(FamilyTreeFormComponent, {
      width: '500px',
      data: { mode: 'edit', familyTree }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadFamilyTrees();
      }
    });
  }

  deleteFamilyTree(id: number): void {
    if (confirm('Are you sure you want to delete this family tree?')) {
      this.familyTreeService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Family tree deleted successfully', 'Close', { duration: 3000 });
          this.loadFamilyTrees();
        },
        error: () => {
          this.snackBar.open('Error deleting family tree', 'Close', { duration: 5000 });
        }
      });
    }
  }

  viewFamilyTree(id: number): void {
    this.router.navigate(['/family-trees', id]);
  }
}

