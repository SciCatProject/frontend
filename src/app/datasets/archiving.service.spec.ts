import { TestBed, waitForAsync } from "@angular/core/testing";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { RetrieveDestinations } from "app-config.service";
import { submitJobAction } from "state-management/actions/jobs.actions";
import {
  selectCurrentUser,
  selectProfile,
  selectTapeCopies,
} from "state-management/selectors/user.selectors";
import { JobsState } from "state-management/state/jobs.store";
import { ArchivingService } from "./archiving.service";
import { createMock, mockDataset } from "shared/MockStubs";
import {
  ReturnedUserDto,
  CreateJobDtoV3,
} from "@scicatproject/scicat-sdk-ts-angular";

describe("ArchivingService", () => {
  let service: ArchivingService;
  let store: MockStore<JobsState>;
  let dispatchSpy: jasmine.Spy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        ArchivingService,
        provideMockStore({
          selectors: [
            {
              selector: selectCurrentUser,
              value: createMock<ReturnedUserDto>({
                email: "test@email.com",
                username: "testName",
                authStrategy: "",
                id: "",
              }),
            },
            { selector: selectTapeCopies, value: "test" },
            { selector: selectProfile, value: { email: "test@email.com" } },
          ],
        }),
      ],
    });

    service = TestBed.inject(ArchivingService);
    store = TestBed.inject(MockStore);
  }));

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("#createJob()", () => {
    it("should create a new object of type Job", () => {
      const user = createMock<ReturnedUserDto>({
        username: "testName",
        email: "test@email.com",
        authStrategy: "",
        id: "",
      });
      const datasets = [mockDataset];
      const datasetList = datasets.map((dataset) => ({
        pid: dataset.pid,
        files: [],
      }));
      const jobType = "archive";
      const additionalJobParams = { destinationPath: "/test/path/" };

      const job = service["createJob"](
        user,
        datasets,
        jobType,
        additionalJobParams,
      );

      expect(job).toBeDefined();
      expect(job["emailJobInitiator"]).toEqual("test@email.com");
      expect(job["jobParams"]["username"]).toEqual("testName");
      expect(job["jobParams"]["destinationPath"]).toEqual("/test/path/");
      expect(job["datasetList"]).toEqual(datasetList);
      expect(job["type"]).toEqual("archive");
    });
  });

  describe("#archiveOrRetrieve()", () => {
    xit("should throw an error if no datasets are selected", () => {
      const datasets = [];
      const jobType = "archive";

      service["archiveOrRetrieve"](datasets, jobType).subscribe((res) => {
        expect(res).toThrowError("No datasets selected");
      });
    });

    xit("should call #createJob() and then dispatch a submitJobAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const user = createMock<ReturnedUserDto>({
        username: "testName",
        email: "test@email.com",
        authStrategy: "",
        id: "",
      });
      const datasets = [mockDataset];
      const datasetList = datasets.map((dataset) => ({
        pid: dataset.pid,
        files: [],
      }));
      const archive = true;

      const job = createMock<CreateJobDtoV3>({
        jobParams: { username: user.username },
        emailJobInitiator: user.email,
        datasetList,
        type: "archive",
        executionTime: "",
        jobResultObject: {},
        jobStatusMessage: "",
      });
      const createJobSpy = spyOn<any, string>(
        service,
        "createJob",
      ).and.returnValue(job);

      service["archiveOrRetrieve"](datasets, "archive").subscribe(() => {
        expect(createJobSpy).toHaveBeenCalledWith(
          user,
          datasets,
          "archive",
          {},
        );
        expect(dispatchSpy).toHaveBeenCalledOnceWith(submitJobAction({ job }));
      });
    });
  });

  describe("#archive()", () => {
    it("should call #archiveOrRetrieve() with the archive job type", () => {
      const archiveOrRetrieveSpy = spyOn<any, string>(
        service,
        "archiveOrRetrieve",
      );
      const datasets = [mockDataset];

      service.archive(datasets);

      expect(archiveOrRetrieveSpy).toHaveBeenCalledOnceWith(
        datasets,
        "archive",
      );
    });
  });

  describe("#retrieve()", () => {
    it("should call #archiveOrRetrieve() with the retrieve job type", () => {
      const archiveOrRetrieveSpy = spyOn<any, string>(
        service,
        "archiveOrRetrieve",
      );
      const datasets = [mockDataset];
      const destinationPath = { location: "/test/path/" };

      service.retrieve(datasets, destinationPath);

      expect(archiveOrRetrieveSpy).toHaveBeenCalledOnceWith(
        datasets,
        "retrieve",
        destinationPath,
      );
    });
  });

  describe("#markForDeletion()", () => {
    it("should call #archiveOrRetrieve() with the markForDeletion job type", () => {
      const archiveOrRetrieveSpy = spyOn<any, string>(
        service,
        "archiveOrRetrieve",
      );
      const datasets = [mockDataset];
      const additionalJobParams = {
        deletionCode: "MARKED_FOR_DELETION",
        explanation: "Requested by data manager",
      };

      service.markForDeletion(datasets, additionalJobParams);

      expect(archiveOrRetrieveSpy).toHaveBeenCalledOnceWith(
        datasets,
        "markForDeletion",
        additionalJobParams,
      );
    });
  });

  describe("#generateOptionLocation()", () => {
    it("should return the generated path", () => {
      const result = { option: "option", location: "relative" };
      const destinations = [
        { option: "option", location: "/root/" },
        { option: "option2" },
      ];
      expect(service.generateOptionLocation(result, destinations)).toEqual({
        option: "option",
        location: "/root/relative",
      });
    });
  });

  describe("#retriveDialogOptions()", () => {
    it("should return the dialog options when retrieving", () => {
      const destinations: RetrieveDestinations[] = [
        { option: "option1" },
        { option: "option2" },
      ];
      expect(service.retriveDialogOptions(destinations)).toEqual({
        width: "auto",
        data: {
          title: "Retrieve to",
          question: "",
          choice: {
            options: destinations,
          },
          option: destinations[0].option,
        },
      });
    });
  });

  describe("#markForDeletionDialogOptions()", () => {
    it("should return required fields for the mark-for-deletion dialog", () => {
      const deletionCodes = [
        { option: "RETRIEVAL_FAILURE" },
        { option: "MARKED_FOR_DELETION" },
      ];

      expect(service.markForDeletionDialogOptions(deletionCodes)).toEqual({
        width: "auto",
        data: {
          title: "Mark for deletion reason",
          additionalFields: {
            deletionCode: {
              label: "Deletion code",
              type: "select",
              required: true,
              options: [
                {
                  option: "RETRIEVAL_FAILURE",
                },
                {
                  option: "MARKED_FOR_DELETION",
                },
              ],
            },
            explanation: {
              label: "Explanation for deletion",
              type: "textarea",
              required: true,
            },
          },
        },
      });
    });
  });
});
