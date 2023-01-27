import { apiInstance } from "./baseURL";

export default class LocationAPI {
  static createLocation(location) {
    return apiInstance.post("/location", location);
  }

  static updateLocation(id, location) {
    return apiInstance.patch(`/location/${id}`, location);
  }

  static deleteLocation(id) {
    return apiInstance.delete(`/location/${id}`);
  }
}
