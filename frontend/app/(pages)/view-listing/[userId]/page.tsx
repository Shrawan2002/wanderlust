import ListingOfUser from "./ListingOfUser";

export default async function ViewListing({params}:{params:Promise<{userId:string}>}) {
  const {userId} = await params;


  return (
    <>
    <ListingOfUser userId={userId} />
    </>
  );
}
