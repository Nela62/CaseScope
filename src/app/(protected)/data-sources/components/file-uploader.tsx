"use client";

import React, { useEffect, useState } from "react";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import Url from "@uppy/url";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import "@uppy/url/dist/style.min.css";

export const FileUploader = () => {
  // IMPORTANT: passing an initializer function to prevent Uppy from being reinstantiated on every render.
  const [uppy] = useState(() =>
    new Uppy().use(Url, {
      companionUrl: "http://localhost:3000/api/documents/process",
    })
  );

  return <Dashboard uppy={uppy} proudlyDisplayPoweredByUppy={false} />;
};
