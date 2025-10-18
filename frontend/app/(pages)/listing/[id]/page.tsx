
import PageDetails from "./PageDetails";

const page = async({params}:{params:Promise<{id:string}>})=> {
    const { id } = await params;
    // const dispatch = useAppDispatch();
    // const {listingloading, listingerror, listingDetail} = useSelector((state:RootState)=>state.listings)
    // console.log('hello');
    // useEffect(()=>{
    //     await dispatch(listingById());
    // }, [])
  return (
    <PageDetails id={id} />
  )
}
export default page 