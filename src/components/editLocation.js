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

export default function EditCamera({ edit, camera, onClose, afterSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    let locationResponse
    try {
        locationResponse = await LocationAPI.createLocation(data)
    } catch(error) {
        console.log(error)
    }
  };

  return (
    <div className="edit-camera container">
      <div className="container-top">
        <h1>Locatie toevoegen</h1>
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
          <button type="submit">Toevoegen</button>
        </div>
      </form>
    </div>
  );
}
