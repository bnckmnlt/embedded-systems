"use client";

import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";

type ImageComponentProps = { path: string };

const ShowImageComponent = ({ path }: ImageComponentProps) => {
  const [mediaUrl, setMediaUrl] = React.useState<string | null>(null);
  const [fileType, setFileType] = React.useState<string | null>(null);
  const [fileSize, setFileSize] = React.useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["path", path],
    queryFn: async () => {
      const response = await axios.post(
        "/api/get-image",
        { path },
        {
          responseType: "blob",
        },
      );

      const blob = new Blob([response.data], { type: response.data.type });
      const url = URL.createObjectURL(blob);
      setMediaUrl(url);
      setFileType(response.data.type);
      setFileSize(response.data.size);

      return response.data;
    },
  });

  if (isLoading) {
    return <Skeleton className="h-full max-h-96 w-full rounded-lg" />;
  }

  const fileName = path.split("/");

  return (
    <Dialog>
      <DialogTrigger className="max-w-32 truncate underline-offset-2 hover:text-blue-400 hover:underline">
        {fileName[1]}
      </DialogTrigger>
      <DialogContent className="px-12 sm:max-w-md md:max-w-xl lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col pb-8">
          <div className="border-overlay my-4 border">
            <div className="flex max-h-96 w-full items-center justify-center overflow-hidden">
              {mediaUrl && fileType ? (
                fileType.startsWith("image/") ? (
                  <Image
                    className="flex h-full w-full items-center justify-center bg-contain bg-center bg-no-repeat"
                    width={74}
                    height={74}
                    quality={100}
                    loading="lazy"
                    src={mediaUrl}
                    alt="Fetched from Blob"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                ) : fileType.startsWith("video/") ? (
                  <video
                    className="rounded-lg"
                    controls
                    preload="none"
                    style={{ maxWidth: "100%", height: "auto" }}
                  >
                    <source src={mediaUrl} type={fileType} />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <p>Unsupported file type</p>
                )
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
          <div>
            <div className="mt-2 text-sm font-medium text-white">
              {fileName[1]}
            </div>
            <div className="text-xs text-muted-foreground">
              {fileType} - {fileSize && fileSize / 1000} kb
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShowImageComponent;
