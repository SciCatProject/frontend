import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { LoopBackAuth } from "shared/sdk";
import { Column } from "shared/modules/shared-table/shared-table.module";
import { ScicatDataService } from "./scicat-data-service";
var moment = require('moment-timezone');

describe("ScicatDataServiceService", () => {
  let service: ScicatDataService;

  const loopBackAuth = {
    getToken: () => ({ id: "test" }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ScicatDataService,
        { provide: HttpClient, useClass: HttpClientModule },
        {
          provide: LoopBackAuth,
          useValue: loopBackAuth,
        },
      ],
    });
    service = TestBed.inject(ScicatDataService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("#createColumnFilterMongoExpression()", () => {
    it("should return the mongo filter expression", () => {
      let columns: Column[];
      columns = [
        {
          "id": "type",
          "label": "Type",
          "icon": "unarchive",
          "canSort": true,
          "matchMode": "is",
          "hideOrder": 2
        },
        {
          "id": "creationTime",
          "icon": "schedule",
          "label": "Created at local time",
          "format": "date medium ",
          "canSort": true,
          "matchMode": "between",
          "hideOrder": 3,
          "sortDefault": "desc"
        },
      ];

      const filterExpressions = {
        "type": "retrieve",
        "creationTime.start": "2021-02-01",
        "creationTime.end": "2021-02-23"
      }

      const result = service.createColumnFilterMongoExpression(columns, filterExpressions);

      expect(result).toEqual({
        "type": "retrieve",
        "creationTime": {
          "begin": "2021-01-31T23:00:00.000Z",
          "end": "2021-02-23T23:00:00.000Z"
        }
      });

    });
  });

});


