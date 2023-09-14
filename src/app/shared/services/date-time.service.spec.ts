import { TestBed } from "@angular/core/testing";
import { DateTimeService } from "./date-time.service";
import { DateTime } from "luxon";

describe("DateTimeService", () => {
  let service: DateTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateTimeService);
  });

  it("Should be created", () => {
    expect(service).toBeTruthy();
  });
  it("Should return true for valid time format", () => {
    const input1 = "2020-05-17";
    const input2 = "2020-05-17 12:00";
    const input3 = "2020-05-17 12:01:01";
    const input4 = DateTime.now().toISO();
    expect(service.isValidDateTime(input1)).toBeTrue();
    expect(service.isValidDateTime(input2)).toBeTrue();
    expect(service.isValidDateTime(input3)).toBeTrue();
    expect(service.isValidDateTime(input4)).toBeTrue();
  });
  it("Should return false for invalid time format", () => {
    const input1 = "2020";
    const input2 = "2020-05";
    const input3 = "2020/05/17 12:01:01";
    const input4 = "20200517";
    const input5 = "2020.05.17";
    const input6 = "2020-02-30"; // correct format but invalid date
    const input7 = "2020.05.17 : 25:00"; // correct format but invalid time

    expect(service.isValidDateTime(input1)).toBeFalse();
    expect(service.isValidDateTime(input2)).toBeFalse();
    expect(service.isValidDateTime(input3)).toBeFalse();
    expect(service.isValidDateTime(input4)).toBeFalse();
    expect(service.isValidDateTime(input5)).toBeFalse();
    expect(service.isValidDateTime(input6)).toBeFalse();
    expect(service.isValidDateTime(input7)).toBeFalse();
  });
  it("Should return true for valid ISO format", () => {
    const input1 = "2021-05-10T13:14:45.432Z";
    const input2 = "2021-05-17T10:15:29.977+02:00";
    expect(service.isValidDateTime(input1)).toBeTrue();
    expect(service.isValidDateTime(input2)).toBeTrue();
  });
  it("Should return false for invalid ISO format", () => {
    const input1 = "2021-05-10T13:14:45Z";
    const input2 = "2021-05-10D13:14:45.00Z";
    const input3 = "2021-05-10T13:14:45.00";
    const input4 = "2021/05/10T13:14:45.00";
    expect(service.isValidDateTime(input1)).toBeFalse();
    expect(service.isValidDateTime(input2)).toBeFalse();
    expect(service.isValidDateTime(input3)).toBeFalse();
    expect(service.isValidDateTime(input4)).toBeFalse();
  });

  it("should return false when input is null", () => {
    expect(service.isISODateTime(null)).toBeFalse();
    expect(service.isValidDateTime(null)).toBeFalse();
  });
});
