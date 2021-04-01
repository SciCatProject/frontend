import { DatePipe } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TreeNode } from '../base-classes/tree-base';

import { FlatNodeEdit, TreeEditComponent } from './tree-edit.component';

fdescribe('TreeEditComponent', () => {
  let component: TreeEditComponent;
  let fixture: ComponentFixture<TreeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TreeEditComponent],
      imports: [
        MatDialogModule,
        MatSnackBarModule,
        MatMenuModule
      ],
      providers: [
        MatDialog,
        MatSnackBar,
        DatePipe
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeEditComponent);
    component = fixture.componentInstance;
    component.metadata = {
      "motors": {
        "sampx": {
          "value": -0.03949844939218141,
          "unit": "mm"
        },
        "sampy": {
          "value": 0.003037629787175808,
          "unit": "mm"
        }
      },
      "take_snapshots": 1,
      "shape": "2DP1",
      "in_interleave": false,
      "wavelength": {
        "value": 0.9789504111255567,
        "unit": "angstrom"
      },
      "cell": [0, 0, 0, 0, 0, 0],
      "creationTime": "2020-10-01 18:01:30",
      "comment": "Bad run"
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe(("#buildDataTree()"), () => {
    it("should build dataTree initial metadata", () => {
      component.dataTree = component.buildDataTree(component.metadata, 0);
      expect(component.dataTree.length).toEqual(8);
      expect(component.dataTree[0]).toBeInstanceOf(TreeNode);
    });
    it("should build dataTree with two child nodes", () => {
      component.dataTree = component.buildDataTree({
        "motors": {
          "sampx": {
            "value": -0.03949844939218141,
            "unit": "mm"
          },
          "sampy": {
            "value": 0.003037629787175808,
            "unit": "mm"
          }
        }
      }, 0);
      expect(component.dataTree.length).toEqual(1);
      expect(component.dataTree[0].key).toEqual("motors");
      expect(component.dataTree[0].value).toEqual(undefined);
      expect(component.dataTree[0].children.length).toEqual(2);
      expect(component.dataTree[0].unit).toEqual(undefined);
    });
    it("should build dataTree with one node without child", () => {
      component.dataTree = component.buildDataTree({
        "in_interleave": false
      }, 0);
      expect(component.dataTree.length).toEqual(1);
      expect(component.dataTree[0].key).toEqual("in_interleave");
      expect(component.dataTree[0].value).toEqual(false);
      expect(component.dataTree[0].children).toEqual(undefined);
      expect(component.dataTree[0].unit).toEqual(undefined);
    });
    it("should build dataTree with one node and value is null", () => {
      component.dataTree = component.buildDataTree({
        "in_interleave": null
      }, 0);
      expect(component.dataTree.length).toEqual(1);
      expect(component.dataTree[0].key).toEqual("in_interleave");
      expect(component.dataTree[0].value).toEqual(null);
      expect(component.dataTree[0].children).toEqual(undefined);
      expect(component.dataTree[0].unit).toEqual(undefined);
    });
    it("should build dataTree with two child nodes and value is array", () => {
      component.dataTree = component.buildDataTree({
        "array": [0, 1]
      }, 0);
      expect(component.dataTree.length).toEqual(1);
      expect(component.dataTree[0].key).toEqual("array");
      expect(component.dataTree[0].value).toBeInstanceOf(Array);
      expect(component.dataTree[0].children.length).toEqual(2);
      expect(component.dataTree[0].unit).toEqual(undefined);
    });
    it("should build dataTree with node that value and unit", () => {
      component.dataTree = component.buildDataTree({
        "angle": {
          "value": 1,
          "unit": "deg"
        }
      }, 0);
      expect(component.dataTree.length).toEqual(1);
      expect(component.dataTree[0].key).toEqual("angle");
      expect(component.dataTree[0].value).toEqual(1);
      expect(component.dataTree[0].children).toEqual(undefined);
      expect(component.dataTree[0].unit).toEqual("deg");
    });
    describe("#transformer()", () => {
      it("should transform TreeNode to FlatNodeEdit", () => {
        const treeNode = new TreeNode();
        treeNode.key = "key";
        treeNode.value = "value";
        treeNode.unit = "unit";
        const flatNode = component.transformer(treeNode, 2);
        expect(flatNode).toBeInstanceOf(FlatNodeEdit);
        expect(flatNode.key).toEqual(treeNode.key);
        expect(flatNode.value).toEqual(treeNode.value);
        expect(flatNode.unit).toEqual(treeNode.unit);
        expect(flatNode.level).toEqual(2);
        expect(flatNode.visible).toEqual(true);
        expect(flatNode.expandable).toEqual(false);
        expect(flatNode.editing).toEqual(false);
        expect(flatNode.editable).toEqual(true);
      })
    });
  })
  describe("#setEditable()", () => {
    it("should set editable of node with value of an array to false ", () => {
      component.metadata = {
        "editable1": "value",
        "array": [1, 2],
        "editable2": "value"
      }
      component.dataTree = component.buildDataTree(component.metadata, 0);
      component.dataSource.data = component.dataTree;
      component.setEditable();
      expect((component.treeControl.dataNodes[0] as FlatNodeEdit).editable).toEqual(true);
      expect((component.treeControl.dataNodes[1] as FlatNodeEdit).editable).toEqual(false);
      expect((component.treeControl.dataNodes[2] as FlatNodeEdit).editable).toEqual(false);
      expect((component.treeControl.dataNodes[3] as FlatNodeEdit).editable).toEqual(false);
      expect((component.treeControl.dataNodes[4] as FlatNodeEdit).editable).toEqual(true);
    });
  });
  describe("#convertDataTreeToObject()", () => {
    it("should convert correctly", () => {
      component.metadata = {
        "":"", //should not be included in result
        "motors": {
          "sampx": {
            "value": -0.03949844939218141,
            "unit": "mm"
          }
        },
        "take_snapshots": 1,
        "shape": "2DP1",
        "in_interleave": false,
        "wavelength": {
          "value": 0.9789504111255567,
          "unit": "angstrom"
        },
        "cell": [0, 0, 0, 0, 0, 0],
        "creationTime": "2020-10-01 18:01:30"
      }
      const expected_result = {
        "motors": {
          "sampx": {
            "value": -0.03949844939218141,
            "unit": "mm"
          }
        },
        "take_snapshots": 1,
        "shape": "2DP1",
        "in_interleave": false,
        "wavelength": {
          "value": 0.9789504111255567,
          "unit": "angstrom"
        },
        "cell": [0, 0, 0, 0, 0, 0],
        "creationTime": "2020-10-01 18:01:30",
      }
      component.dataTree = component.buildDataTree(component.metadata, 0);
      const result = component.convertDataTreeToObject(component.dataTree);
      expect(result).toEqual(expected_result);
    });
  });
});
