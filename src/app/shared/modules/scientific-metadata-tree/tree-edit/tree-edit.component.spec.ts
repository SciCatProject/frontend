import { DatePipe } from "@angular/common";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DateTime } from "luxon";
import { Type } from "../base-classes/metadata-input-base";
import { TreeNode } from "../base-classes/tree-base";
import { InputData } from "../metadata-input/metadata-input.component";
import { ScientificMetadataTreeModule } from "../scientific-metadata-tree.module";

import { FlatNodeEdit, TreeEditComponent } from "./tree-edit.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe("TreeEditComponent", () => {
  let component: TreeEditComponent;
  let fixture: ComponentFixture<TreeEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TreeEditComponent],
      imports: [ScientificMetadataTreeModule, BrowserAnimationsModule],
      providers: [MatDialog, MatSnackBar, DatePipe],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeEditComponent);
    component = fixture.componentInstance;
    component.metadata = {
      motors: {
        sampx: {
          value: -0.03949844939218141,
          unit: "mm",
        },
        sampy: {
          value: 0.003037629787175808,
          unit: "mm",
        },
      },
      take_snapshots: 1,
      shape: "2DP1",
      in_interleave: false,
      wavelength: {
        value: 0.9789504111255567,
        unit: "angstrom",
      },
      cell: [0, 0, 0, 0, 0, 0],
      creationTime: "2020-10-01 18:01:30",
      comment: "Bad run",
    };
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  describe("#buildDataTree()", () => {
    it("should build dataTree initial metadata", () => {
      component.dataTree = component.buildDataTree(component.metadata, 0);
      expect(component.dataTree.length).toEqual(8);
      expect(component.dataTree[0]).toBeInstanceOf(TreeNode);
    });
    it("should build dataTree with two child nodes", () => {
      component.dataTree = component.buildDataTree(
        {
          motors: {
            sampx: {
              value: -0.03949844939218141,
              unit: "mm",
            },
            sampy: {
              value: 0.003037629787175808,
              unit: "mm",
            },
          },
        },
        0,
      );
      expect(component.dataTree.length).toEqual(1);
      expect(component.dataTree[0].key).toEqual("motors");
      expect(component.dataTree[0].value).toEqual(undefined);
      expect(component.dataTree[0].children.length).toEqual(2);
      expect(component.dataTree[0].unit).toEqual(undefined);
    });
    it("should build dataTree with one node without child", () => {
      component.dataTree = component.buildDataTree(
        {
          in_interleave: false,
        },
        0,
      );
      expect(component.dataTree.length).toEqual(1);
      expect(component.dataTree[0].key).toEqual("in_interleave");
      expect(component.dataTree[0].value).toEqual(false);
      expect(component.dataTree[0].children).toEqual(undefined);
      expect(component.dataTree[0].unit).toEqual(undefined);
    });
    it("should build dataTree with one node and value is null", () => {
      component.dataTree = component.buildDataTree(
        {
          in_interleave: null,
        },
        0,
      );
      expect(component.dataTree.length).toEqual(1);
      expect(component.dataTree[0].key).toEqual("in_interleave");
      expect(component.dataTree[0].value).toEqual(null);
      expect(component.dataTree[0].children).toEqual(undefined);
      expect(component.dataTree[0].unit).toEqual(undefined);
    });
    it("should build dataTree with two child nodes and value is array", () => {
      component.dataTree = component.buildDataTree(
        {
          array: [0, 1],
        },
        0,
      );
      expect(component.dataTree.length).toEqual(1);
      expect(component.dataTree[0].key).toEqual("array");
      expect(component.dataTree[0].value).toBeInstanceOf(Array);
      expect(component.dataTree[0].children.length).toEqual(2);
      expect(component.dataTree[0].unit).toEqual(undefined);
    });
    it("should build dataTree with node that value and unit", () => {
      component.dataTree = component.buildDataTree(
        {
          angle: {
            value: 1,
            unit: "deg",
          },
        },
        0,
      );
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
      });
    });
  });
  describe("#setEditable()", () => {
    it("should set editable of node with value of an array to false ", () => {
      component.metadata = {
        editable1: "value",
        array: [1, 2],
        editable2: "value",
      };
      component.dataTree = component.buildDataTree(component.metadata, 0);
      component.dataSource.data = component.dataTree;
      component.setEditable();
      expect(
        (component.treeControl.dataNodes[0] as FlatNodeEdit).editable,
      ).toEqual(true);
      expect(
        (component.treeControl.dataNodes[1] as FlatNodeEdit).editable,
      ).toEqual(false);
      expect(
        (component.treeControl.dataNodes[2] as FlatNodeEdit).editable,
      ).toEqual(false);
      expect(
        (component.treeControl.dataNodes[3] as FlatNodeEdit).editable,
      ).toEqual(false);
      expect(
        (component.treeControl.dataNodes[4] as FlatNodeEdit).editable,
      ).toEqual(true);
    });
  });
  describe("#convertDataTreeToObject()", () => {
    it("should convert correctly", () => {
      component.metadata = {
        "": "", //should not be included in result
        motors: {
          sampx: {
            value: -0.03949844939218141,
            unit: "mm",
          },
        },
        take_snapshots: 1,
        shape: "2DP1",
        in_interleave: false,
        wavelength: {
          value: 0.9789504111255567,
          unit: "angstrom",
        },
        cell: [0, 0, 0, 0, 0, 0],
        creationTime: "2020-10-01 18:01:30",
      };
      const expected_result = {
        motors: {
          sampx: {
            value: -0.03949844939218141,
            unit: "mm",
          },
        },
        take_snapshots: 1,
        shape: "2DP1",
        in_interleave: false,
        wavelength: {
          value: 0.9789504111255567,
          unit: "angstrom",
        },
        cell: [0, 0, 0, 0, 0, 0],
        creationTime: "2020-10-01 18:01:30",
      };
      component.dataTree = component.buildDataTree(component.metadata, 0);
      const result = component.convertDataTreeToObject(component.dataTree);
      expect(result).toEqual(expected_result);
    });
  });
  describe("#onSave()", () => {
    it("should cache changes correctly", () => {
      component.metadata = {
        energy: {
          value: 1,
          unit: "joule",
        },
      };
      const inputData: InputData = {
        type: Type.string,
        key: "string",
        value: "value",
      };
      component.ngOnInit();
      expect(component.dataTree.length).toEqual(1);
      const flatNode = component.treeControl.dataNodes[0] as FlatNodeEdit;
      const nestedNode = component.dataTree[0];
      component.enableEditing(flatNode);
      component.onSave(inputData);
      expect(component.currentEditingNode).toBeNull();
      expect(nestedNode.key).toEqual("string");
      expect(nestedNode.value).toEqual("value");
      expect(nestedNode.unit).toBeNull();
      expect(component.currentEditingNode).toBeNull();
      expect(flatNode.key).toEqual("string");
      expect(flatNode.value).toEqual("value");
      expect(flatNode.unit).toBeNull();
      expect(flatNode.editing).toBeFalse();
      // Should have original values on undo()
      component.historyManager.undo();
      expect(nestedNode.key).toEqual("energy");
      expect(nestedNode.value).toEqual(1);
      expect(nestedNode.unit).toEqual("joule");
      expect(flatNode.key).toEqual("energy");
      expect(flatNode.value).toEqual(1);
      expect(flatNode.unit).toEqual("joule");
      // should have new values on redo()
      component.historyManager.redo();
      expect(nestedNode.key).toEqual("string");
      expect(nestedNode.value).toEqual("value");
      expect(nestedNode.unit).toBeNull();
      expect(flatNode.key).toEqual("string");
      expect(flatNode.value).toEqual("value");
      expect(flatNode.unit).toBeNull();
    });
  });
  describe("#updateNode()", () => {
    it("should update date correctly", () => {
      component.metadata = {
        date: new Date("2020-04-01 12:00:00").toISOString(),
      };
      const inputData: InputData = {
        type: Type.date,
        key: "new date",
        value: new Date("2020-04-02 12:00:00").toISOString(),
      };
      component.ngOnInit();
      const nestNode = component.dataTree[0];
      const flatNode = component.treeControl.dataNodes[0];
      const expectedDate = DateTime.fromJSDate(new Date(inputData.value))
        .toUTC()
        .toISO();
      component.updateNode(nestNode, inputData);
      expect(nestNode.key).toEqual(inputData.key);
      expect(nestNode.value).toEqual(expectedDate);
      expect(nestNode.unit).toBeNull();
      expect(flatNode.key).toEqual(inputData.key);
      expect(flatNode.value).toEqual(expectedDate);
      expect(flatNode.unit).toBeNull();
    });
    it("should update string correctly", () => {
      component.metadata = {
        comment: "test",
      };
      const inputData: InputData = {
        type: Type.string,
        key: "new comment",
        value: "new test",
      };
      component.ngOnInit();
      const nestNode = component.dataTree[0];
      const flatNode = component.treeControl.dataNodes[0];
      component.updateNode(nestNode, inputData);
      expect(nestNode.key).toEqual(inputData.key);
      expect(nestNode.value).toEqual(inputData.value);
      expect(typeof nestNode.value).toEqual("string");
      expect(nestNode.unit).toBeNull();
      expect(flatNode.key).toEqual(inputData.key);
      expect(flatNode.value).toEqual(inputData.value);
      expect(typeof flatNode.value).toEqual("string");
      expect(flatNode.unit).toBeNull();
    });
    it("should update number correctly", () => {
      component.metadata = {
        comment: "test",
      };
      const inputData: InputData = {
        type: Type.number,
        key: "number",
        value: "1",
      };
      component.ngOnInit();
      const nestNode = component.dataTree[0];
      const flatNode = component.treeControl.dataNodes[0];
      component.updateNode(nestNode, inputData);
      expect(nestNode.key).toEqual(inputData.key);
      expect(nestNode.value).toEqual(1);
      expect(typeof nestNode.value).toEqual("number");
      expect(nestNode.unit).toBeNull();
      expect(flatNode.key).toEqual(inputData.key);
      expect(flatNode.value).toEqual(1);
      expect(typeof flatNode.value).toEqual("number");
      expect(flatNode.unit).toBeNull();
    });
    it("should update boolean correctly", () => {
      component.metadata = {
        boolean: false,
      };
      const inputData: InputData = {
        type: Type.boolean,
        key: "boolean",
        value: "true",
      };
      component.ngOnInit();
      const nestNode = component.dataTree[0];
      const flatNode = component.treeControl.dataNodes[0];
      component.updateNode(nestNode, inputData);
      expect(nestNode.key).toEqual(inputData.key);
      expect(nestNode.value).toBeTrue();
      expect(typeof nestNode.value).toEqual("boolean");
      expect(nestNode.unit).toBeNull();
      expect(flatNode.key).toEqual(inputData.key);
      expect(flatNode.value).toBeTrue();
      expect(typeof flatNode.value).toEqual("boolean");
      expect(flatNode.unit).toBeNull();
      inputData.value = "false";
      component.updateNode(nestNode, inputData);
      expect(nestNode.key).toEqual(inputData.key);
      expect(nestNode.value).toBeFalse();
      expect(typeof nestNode.value).toEqual("boolean");
      expect(nestNode.unit).toBeNull();
      expect(flatNode.key).toEqual(inputData.key);
      expect(flatNode.value).toBeFalse();
      expect(typeof flatNode.value).toEqual("boolean");
      expect(flatNode.unit).toBeNull();
    });
    it("should update physical quantity correctly", () => {
      component.metadata = {
        energy: 1,
      };
      const inputData: InputData = {
        type: Type.quantity,
        key: "energy",
        value: "10",
        unit: "joule",
      };
      component.ngOnInit();
      const nestNode = component.dataTree[0];
      const flatNode = component.treeControl.dataNodes[0];
      component.updateNode(nestNode, inputData);
      expect(nestNode.key).toEqual(inputData.key);
      expect(nestNode.value).toEqual(10);
      expect(typeof nestNode.value).toEqual("number");
      expect(nestNode.unit).toEqual(inputData.unit);
      expect(flatNode.key).toEqual(inputData.key);
      expect(flatNode.value).toEqual(10);
      expect(typeof flatNode.value).toEqual("number");
      expect(flatNode.unit).toEqual(inputData.unit);
    });
  });

  describe("#enableEditing()", () => {
    it("Should enable node editing", () => {
      component.metadata = {
        motors: {
          sampx: {
            value: -0.03949844939218141,
            unit: "mm",
          },
          sampy: {
            value: 0.003037629787175808,
            unit: "mm",
          },
        },
      };
      component.ngOnInit();
      const node = component.treeControl.dataNodes[0] as FlatNodeEdit;
      component.enableEditing(node);
      expect(node.editing).toBeTrue();
    });
    it("Should not enable node editing when there is unsaved changes on another node", () => {
      component.metadata = {
        motors: {
          sampx: {
            value: -0.03949844939218141,
            unit: "mm",
          },
          sampy: {
            value: 0.003037629787175808,
            unit: "mm",
          },
        },
      };
      component.ngOnInit();
      const node0 = component.treeControl.dataNodes[0] as FlatNodeEdit;
      const node1 = component.treeControl.dataNodes[1] as FlatNodeEdit;
      component.enableEditing(node0);
      component.onChange();
      component.enableEditing(node1);
      expect(node1.editing).toBeFalse();
    });
    it("Should not enable node editing when node is a element of an array", () => {
      component.metadata = {
        motors: ["motor1", "motor2", "motor3"],
      };
      component.ngOnInit();
      const motor1 = component.treeControl.dataNodes[1] as FlatNodeEdit;
      component.enableEditing(motor1);
      expect(motor1.editing).toBeFalse();
    });
  });
  describe("#addNewNode()", () => {
    it("Should add a new node", () => {
      component.metadata = {
        motors: {
          sampx: {
            value: -0.03949844939218141,
            unit: "mm",
          },
          sampy: {
            value: 0.003037629787175808,
            unit: "mm",
          },
        },
      };
      component.ngOnInit();
      const node = component.treeControl.dataNodes[0] as FlatNodeEdit;
      const nestedNode = component.flatNodeMap.get(node);
      component.addNewNode(node);
      expect(nestedNode.children.length).toEqual(3);
      expect(component.treeControl.isExpanded(node));
      const newNode = component.treeControl.dataNodes[
        component.treeControl.dataNodes.length - 1
      ] as FlatNodeEdit;
      expect(newNode.editing).toBeTrue();
    });
  });
  describe("#deleteNode()", () => {
    beforeEach(() => {
      component.metadata = {
        motors: {
          sampx: {
            value: -0.03949844939218141,
            unit: "mm",
          },
          sampy: {
            value: 0.003037629787175808,
            unit: "mm",
          },
        },
      };
      component.ngOnInit();
    });
    it("Should delete first child node correctly", () => {
      const flatNode = component.treeControl.dataNodes.filter(
        (node: FlatNodeEdit) => node.key === "sampx",
      )[0] as FlatNodeEdit;
      component.deleteNode(flatNode);
      expect(component.dataTree.length).toEqual(1);
      expect(component.dataTree[0].children.length).toEqual(1);
      expect(component.dataTree[0].children[0].key).toEqual("sampy");
    });
    it("Should delete second child node correctly", () => {
      // Delete second child
      const child1 = component.treeControl.dataNodes[1] as FlatNodeEdit;
      const child2 = component.treeControl.dataNodes[2] as FlatNodeEdit;
      component.deleteNode(child1);
      component.deleteNode(child2);
      expect(component.dataTree.length).toEqual(1);
      expect(component.dataTree[0].children.length).toEqual(0);
      expect(component.dataTree[0].value).toEqual("");
    });
    it("Should add second child node back to the tree after undo()", () => {
      // Second child node added back to the tree after undo()
      const child1 = component.treeControl.dataNodes[1] as FlatNodeEdit;
      const child2 = component.treeControl.dataNodes[2] as FlatNodeEdit;
      const expectedNode = component.flatNodeMap.get(child2);
      component.deleteNode(child1);
      component.deleteNode(child2);
      component.historyManager.undo();
      expect(component.dataTree.length).toEqual(1);
      expect(component.dataTree[0].children.length).toEqual(1);
      expect(component.dataTree[0].children[0]).toEqual(expectedNode);
    });
    it("Should add first child back to the tree after 2 undo()", () => {
      // First child node added back to the tree after undo()
      const child1 = component.treeControl.dataNodes[1] as FlatNodeEdit;
      const child2 = component.treeControl.dataNodes[2] as FlatNodeEdit;
      const expectedIndex = 1;
      component.deleteNode(child1);
      component.deleteNode(child2);
      component.historyManager.undo();
      component.historyManager.undo();
      expect(component.dataTree.length).toEqual(1);
      expect(component.dataTree[0].children.length).toEqual(2);
      expect(component.treeControl.dataNodes[expectedIndex]).toEqual(child1);
    });
    it("Should remove first child node after redo()", () => {
      const child1 = component.treeControl.dataNodes[1] as FlatNodeEdit;
      const child2 = component.treeControl.dataNodes[2] as FlatNodeEdit;
      const expectedNode = component.flatNodeMap.get(child2);
      component.deleteNode(child1);
      component.deleteNode(child2);
      component.historyManager.undo();
      component.historyManager.undo();
      component.historyManager.redo();
      expect(component.dataTree.length).toEqual(1);
      expect(component.dataTree[0].children.length).toEqual(1);
      expect(component.dataTree[0].children[0]).toEqual(expectedNode);
    });
  });
});
