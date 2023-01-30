import "./editCamera.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CameraAPI from "../apis/cameraAPI";
import LocationAPI from "../apis/locationAPI";
import CloseIcon from "@mui/icons-material/Close";

const transformNumberValues = (cv, ov) => {
  return ov === "" || ov === null ? undefined : cv;
};

const schema = yup
  .object({
    name: yup.string().required("veld 'Naam' is verplicht"),
    macAddress: yup.string().required("veld 'MAC-adres' is verplicht"),
    street: yup.string(),
    streetNumber: yup
      .number()
      .transform(transformNumberValues)
      .typeError("huisnummer is een getal"),
    city: yup.string(),
    zipcode: yup
      .number()
      .transform(transformNumberValues)
      .typeError("postcode is een getal"),
    speedLimit: yup
      .number()
      .transform(transformNumberValues)
      .typeError("snelheidslimiet is een getal"),
  })
  .required();

const locationFields = [
  "street",
  "streetNumber",
  "city",
  "zipcode",
  "speedLimit",
];

export default function EditCamera({ edit, camera, onClose, afterSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ...camera,
      ...camera?.location,
    },
  });

  async function handleCreate(submittedcamera, cameraLocation) {
    let locationResult;

    try {
      locationResult = await LocationAPI.createLocation(cameraLocation);
    } catch (error) {
      console.log(error);
    }

    const locationId = locationResult.data.locationId;
    submittedcamera.locationId = locationId;

    try {
      const cameraResult = await CameraAPI.createCamera(submittedcamera);
      console.log(cameraResult);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleUpdate(submittedcamera, cameraLocation) {
    try {
      LocationAPI.updateLocation(camera.locationId, cameraLocation);
    } catch (error) {
      console.log(error);
    }

    try {
      CameraAPI.updateCamera(camera.cameraId, submittedcamera);
    } catch (error) {
      console.log(error);
    }
  }

  let title;
  let submitText;
  let handleEdit;

  (() => {
    switch (edit) {
      case "create":
        title = "Camera Toevoegen";
        submitText = "Toevoegen";
        handleEdit = handleCreate;
        return;
      case "update":
        title = "Camera Updaten";
        submitText = "Updaten";
        handleEdit = handleUpdate;
        return;
      default:
        title = "Camera Toevoegen";
        submitText = "Toevoegen";
    }
  })();

  const onSubmit = async (data) => {
    console.log(data);
    const camera = data;
    const cameraLocation = {};
    [...locationFields, "longitude", "latitude"].forEach((field) => {
      cameraLocation[field] = camera[field];
      delete camera[field];
    });
    await handleEdit(camera, cameraLocation);
    afterSubmit();
  };

  return (
    <div className="edit-camera container">
      <div className="container-top">
        <h1>{title}</h1>
        <div className="container-close">
          <CloseIcon
            fontSize="large"
            style={{ color: "#E43287" }}
            className="close-icon"
            onClick={onClose}
          />
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="field-group">
          <div className="input-group">
            <div className="label-input">
              <label>Naam: </label>
              <input {...register("name")} />
            </div>
            <p className="error-message">{errors.name?.message}</p>
          </div>
          <div className="input-group">
            <div className="label-input">
              <label>MAC-adres: </label>
              <input {...register("macAddress")} />
            </div>
            <p className="error-message">{errors.macAddress?.message}</p>
          </div>
        </div>
        <h2>Locatie</h2>
        <div className="field-group">
          <div className="input-group">
            <div className="label-input">
              <label>Straat: </label>
              <input {...register("street")} />
            </div>
            <p className="error-message">{errors.street?.message}</p>
          </div>
          <div className="input-group">
            <div className="label-input">
              <label>Huisnummer: </label>
              <input {...register("streetNumber")} />
            </div>
            <p className="error-message">{errors.streetNumber?.message}</p>
          </div>
          <div className="input-group">
            <div className="label-input">
              <label>Gemeente: </label>
              <input {...register("city")} />
            </div>
            <p className="error-message">{errors.city?.message}</p>
          </div>
          <div className="input-group">
            <div className="label-input">
              <label>Postcode: </label>
              <input {...register("zipcode")} />
            </div>
            <p className="error-message">{errors.zipcode?.message}</p>
          </div>
          <div className="input-group">
            <div className="label-input">
              <label>Snelheidslimiet: </label>
              <input {...register("speedLimit")} />
            </div>
            <p className="error-message">{errors.speedLimit?.message}</p>
          </div>
        </div>
        <div className="button-container">
          <button type="submit">{submitText}</button>
        </div>
      </form>
    </div>
  );
}
