import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center py-24 text-center">
      <h1 className="text-2xl font-bold">Not Found</h1>
      <div>
        <Image
          src={"/error-icon.png"}
          width={124}
          height={124}
          alt="Resource not found"
          className="py-6 dark:text-white"
        />
      </div>
      <p className="text-base">Could not find requested resource.</p>
      <p className="text-base">Contact your administrator.</p>
      <Link href="/dashboard">
        <Button className="mt-5">Return Home</Button>
      </Link>
    </div>
  );
}
