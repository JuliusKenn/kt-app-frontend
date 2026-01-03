import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FamilyTreeService, FamilyTree } from '../../../core/services/family-tree.service';
import { PersonService, Person } from '../../../core/services/person.service';
import { RelationshipService, Relationship } from '../../../core/services/relationship.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Node, Edge } from '@swimlane/ngx-graph';

@Component({
  selector: 'app-family-tree-detail',
  templateUrl: './family-tree-detail.component.html',
  styleUrls: ['./family-tree-detail.component.scss']
})
export class FamilyTreeDetailComponent implements OnInit {
  familyTree: FamilyTree | null = null;
  people: Person[] = [];
  relationships: Relationship[] = [];
  loading = false;

  // ngx-graph data
  nodes: Node[] = [];
  links: Edge[] = [];

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private familyTreeService: FamilyTreeService,
    private personService: PersonService,
    private relationshipService: RelationshipService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadFamilyTree(id);
  }

  loadFamilyTree(id: number): void {
    this.loading = true;
    this.familyTreeService.getById(id).subscribe({
      next: (response) => {
        this.familyTree = response.data;
        this.loadPeople(id);
      },
      error: () => {
        this.snackBar.open('Error loading family tree', 'Close', { duration: 5000 });
        this.router.navigate(['/family-trees']);
      }
    });
  }

  loadPeople(familyTreeId: number): void {
    this.personService.getByFamilyTree(familyTreeId).subscribe({
      next: (response) => {
        this.people = response.data;
        this.buildGraph();
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  buildGraph(): void {
    // Build nodes from people
    this.nodes = this.people.map(person => ({
      id: person.id.toString(),
      label: `${person.first_name} ${person.last_name}`,
      data: person
    }));

    // Build links from relationships
    this.links = [];
    this.people.forEach(person => {
      this.relationshipService.getByPerson(person.id).subscribe({
        next: (response) => {
          response.data.forEach(rel => {
            if (rel.person_id === person.id) {
              this.links.push({
                id: `link-${rel.id}`,
                source: rel.person_id.toString(),
                target: rel.related_person_id.toString(),
                label: rel.relationship_type,
                data: rel
              });
            }
          });
        }
      });
    });

    this.loading = false;
  }
}

