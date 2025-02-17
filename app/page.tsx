import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href={"/trustadmin"}>
        Super Admin
      </Link>
      <br />
      <br />
      <Link href={"/trustsub"}>
        Admin
      </Link>
      <br />
      <br />
      <Link href={"/volunteer"}>
        App (Volunteer)
      </Link>
    </div>
  );
}
