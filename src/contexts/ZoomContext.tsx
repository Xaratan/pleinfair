import {
  generateContext,
  GenerateContextOptions,
} from "./helpers/generateContext";

const [getZoomContextProvider, ZoomContextConsumer, ZoomContext] =
  generateContext(
    {
      transform: "",
    },
    { storage: "none", storagePrefix: "zoom" }
  );

export { getZoomContextProvider, ZoomContextConsumer, ZoomContext };
