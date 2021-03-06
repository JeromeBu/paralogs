import {
  CurrentUserWithAuthToken,
  getMeRoute,
  LoginParams,
  loginRoute,
  pilotsRoute,
  SignUpParams,
  signUpRoute,
  UpdateUserDTO,
  UserDTO,
} from "@paralogs/auth/interface";
import {
  AddFlightDTO,
  AddWingDTO,
  currentPilotRoute,
  FlightDTO,
  flightsRoute,
  PilotDTO,
  UpdateWingDTO,
  WingDTO,
  wingsRoute,
} from "@paralogs/logbook/interfaces";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Observable } from "rxjs/internal/Observable";
import { from } from "rxjs/internal/observable/from";
import { map } from "rxjs/internal/operators/map";
import { catchError } from "rxjs/internal/operators";

import { config } from "../../config";
import { LocalClientStorage } from "../LocalClientStorage";

const responseToObservable = <Output>(
  axiosResponsePromise: Promise<AxiosResponse<Output>>,
): Observable<any> =>
  from(axiosResponsePromise).pipe(
    map(({ data }) => data),
    catchError((err) => {
      const responseErr = err?.response?.data?.message;
      if (responseErr) throw responseErr;
      throw err.message ?? err;
    }),
  );

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
