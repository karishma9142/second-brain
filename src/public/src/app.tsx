import { Button } from "./components/buttom";
import { PlusIcon } from "./icons/plusIcon";

export function App() {

  return (
    <>
    <br />
      <Button  startIcon={<PlusIcon size="md"/>} varient="primary" size="md" text="Share Brain" onclick={()=>{}}></Button>
      <br />
      <Button varient="secondary" size="md" text="Add Content" onclick={()=>{}}></Button>
    </>
  )
}
