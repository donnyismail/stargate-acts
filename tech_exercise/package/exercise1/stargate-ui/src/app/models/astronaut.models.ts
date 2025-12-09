// Base response wrapper - matches API's BaseResponse
export interface BaseResponse {
  success: boolean;
  message: string;
  responseCode: number;
}

// Person with astronaut details - flattened DTO from API
export interface PersonAstronaut {
  personId: number;
  name: string;
  currentRank: string | null;
  currentDutyTitle: string | null;
  careerStartDate: string | null;
  careerEndDate: string | null;
}

// Astronaut duty record
export interface AstronautDuty {
  id: number;
  personId: number;
  rank: string;
  dutyTitle: string;
  dutyStartDate: string;
  dutyEndDate: string | null;
}

// API Response types
export interface GetPeopleResponse extends BaseResponse {
  people: PersonAstronaut[];
}

export interface GetPersonByNameResponse extends BaseResponse {
  person: PersonAstronaut;
}

export interface GetAstronautDutiesResponse extends BaseResponse {
  person: PersonAstronaut;
  astronautDuties: AstronautDuty[];
}

export interface CreatePersonResponse extends BaseResponse {
  id: number;
}

export interface CreateAstronautDutyResponse extends BaseResponse {
  id: number;
}

// Request types
export interface CreateAstronautDutyRequest {
  name: string;
  rank: string;
  dutyTitle: string;
  dutyStartDate: string;
}
