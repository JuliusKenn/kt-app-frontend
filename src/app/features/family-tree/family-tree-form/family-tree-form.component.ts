import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FamilyTreeService, FamilyTree } from '../../../core/services/family-tree.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-family-tree-form',
  templateUrl: './family-tree-form.component.html',
  styleUrls: ['./family-tree-form.component.scss']
})
export class FamilyTreeFormComponent implements OnInit {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private familyTreeService: FamilyTreeService,
    private dialogRef: MatDialogRef<FamilyTreeFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'create' | 'edit', familyTree?: FamilyTree }
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    if (this.data.mode === 'edit' && this.data.familyTree) {
      this.form.patchValue({
        name: this.data.familyTree.name,
        description: this.data.familyTree.description || ''
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;
      const formValue = this.form.value;

      const request = this.data.mode === 'create'
        ? this.familyTreeService.create(formValue)
        : this.familyTreeService.update(this.data.familyTree!.id, formValue);

      request.subscribe({
        next: () => {
          this.snackBar.open(
            `Family tree ${this.data.mode === 'create' ? 'created' : 'updated'} successfully`,
            'Close',
            { duration: 3000 }
          );
          this.dialogRef.close(true);
        },
        error: () => {
          this.snackBar.open('Error saving family tree', 'Close', { duration: 5000 });
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

