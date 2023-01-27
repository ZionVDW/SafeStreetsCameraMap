import { apiInstance } from "./baseURL";

export default class CameraAPI {
  static createCamera(camera) {
    return apiInstance.post("/camera", camera);
  }

  static createCameraWithLocation(camera) {
    return apiInstance.post("/camera/with-location", camera)
  }

  static updateCamera(id, camera) {
    return apiInstance.patch(`/camera/${id}`, camera);
  }

  static deleteCamera(id) {
    return apiInstance.delete(`/camera/${id}`);
  }
}
