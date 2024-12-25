"use client";

import { useEffect, useState } from "react";
import { COMPANION_URL, COMPANION_ALLOWED_HOSTS } from "@uppy/transloadit";
import Dropbox from "@uppy/dropbox";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import Transloadit from "@uppy/transloadit";
import Url from "@uppy/url";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import "@uppy/url/dist/style.min.css";

export const FileUploader = ({
  onDone,
}: {
  onDone: (files: (File | Blob)[]) => void;
}) => {
  const [files, setFiles] = useState<(File | Blob)[]>([]);
  // IMPORTANT: passing an initializer function to prevent Uppy from being reinstantiated on every render.
  const [uppy] = useState(() =>
    new Uppy({
      restrictions: { allowedFileTypes: ["application/pdf"] },
    })
      .use(Url, {
        companionUrl: COMPANION_URL,
        companionAllowedHosts: COMPANION_ALLOWED_HOSTS,
      })
      .use(Dropbox, {
        companionUrl: COMPANION_URL,
        companionAllowedHosts: COMPANION_ALLOWED_HOSTS,
      })
      .use(Transloadit, {
        assemblyOptions: {
          params: {
            auth: { key: process.env.NEXT_PUBLIC_TRANSLOADIT_KEY! },
            template_id: process.env.NEXT_PUBLIC_TRANSLOADIT_TEMPLATE_ID!,
          },
        },
      })
  );

  useEffect(() => {
    uppy.on("upload-success", (file, response) => {
      if (response.status === 200) {
        console.log(file?.data);
        if (file?.data) {
          setFiles((prevFiles) => [...prevFiles, file.data]);
        }
      } else {
        console.error(response);
      }
    });
  }, [uppy]);

  return (
    <Dashboard
      uppy={uppy}
      proudlyDisplayPoweredByUppy={false}
      doneButtonHandler={() => onDone(files)}
      // @ts-expect-error Status bar locale is different from what it expects here
      locale={{
        strings: { complete: "Uploaded", done: "Extract Data" },
      }}
    />
  );
};
