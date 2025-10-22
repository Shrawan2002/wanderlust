import ListingForm from '@/app/components/ListingForm';
import React from 'react'

const page = async ({params}:{params:Promise<{id:string}>}) => {
    const {id} = await params;
  return (
    
    <>
    <ListingForm isEdit={id} />
    </>
  )
}

export default page