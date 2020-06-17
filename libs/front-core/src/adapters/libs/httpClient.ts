import {
  AddFlightDTO,
  AddWingDTO,
  currentPilotRoute,
  CurrentUserWithAuthToken,
  FlightDTO,
  flightsRoute,
  getMeRoute,
  LoginParams,
  loginRoute,
  SignUpParams,
  signUpRoute,
  UpdateUserDTO,
  UpdateWingDTO,
  UserDTO,
  pilotsRoute,
  WingDTO,
  wingsRoute,
} from "@paralogs/shared";
import { PilotDTO } from "@paralogs/shared";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Observable } from "rxjs/internal/Observable";
import { from } from "rxjs/internal/observable/from";
import { map } from "rxjs/internal/operators/map";

import { config } from "../../config";
import { LocalClientStorage } from "../LocalClientStorage";

const responseToObservable = <Output>(
  axiosResponsePromise: Promise<AxiosResponse<Output>>,
) => from(axiosResponsePromise).pipe(map(({ data }) => data));

const POST = <Input, Output>(
  route: string,
  axiosConfig?: AxiosRequestConfig,
) => (input: Input): Observable<Output> =>
  responseToObservable(axios.post<Output>(route, input, axiosConfig));

const PUT = <Input, Output>(
  route: string,
  axiosConfig?: AxiosRequestConfig,
) => (input: Input): Observable<Output> =>
  responseToObservable(axios.put<Output>(route, input, axiosConfig));

const GET = <Output>(
  route: string,
  axiosConfig?: AxiosRequestConfig,
) => (): Observable<Output> =>
  responseToObservable(axios.get(route, axiosConfig));

const localClientStorage = new LocalClientStorage();

const GETwithToken = <Output>(route: string) => () => {
  const token = localClientStorage.get("token");
  return GET<Output>(route, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

const POSTwithToken = <Input, Output>(route: string) => () => {
  const token = localClientStorage.get("token");
  return POST<Input, Output>(route, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

const PUTwithToken = <Input, Output>(route: string) => () => {
  const token = localClientStorage.get("token");
  return PUT<Input, Output>(route, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

const logbook = (route: string) => `${config.logbookUrl}${route}`;
const auth = (route: string) => `${config.authUrl}${route}`;

export const httpClient = {
  getMe: GETwithToken<CurrentUserWithAuthToken>(auth(getMeRoute)),
  signUp: POST<SignUpParams, CurrentUserWithAuthToken>(auth(signUpRoute)),
  login: POST<LoginParams, CurrentUserWithAuthToken>(auth(loginRoute)),

  updateUser: PUTwithToken<UpdateUserDTO, UserDTO>(auth(pilotsRoute)),
  retrieveUsers: GETwithToken<UserDTO[]>(auth(pilotsRoute)),

  retrieveCurrentPilot: GETwithToken<PilotDTO>(logbook(currentPilotRoute)),

  retrieveWings: GETwithToken<WingDTO[]>(logbook(wingsRoute)),
  addWing: POSTwithToken<AddWingDTO, WingDTO>(logbook(wingsRoute)),
  updateWing: PUTwithToken<UpdateWingDTO, WingDTO>(logbook(wingsRoute)),

  addFlight: POSTwithToken<AddFlightDTO, FlightDTO>(logbook(flightsRoute)),
  retrieveFlights: GETwithToken<FlightDTO[]>(logbook(flightsRoute)),
};
